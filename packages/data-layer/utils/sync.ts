 
import { boolean } from "yup";
import { DB, ping, LocalDB } from "../index";
import { DocTypeService } from "../services/doctype";
import { IDBReadParam } from "../interfaces/database"; 
import { resolveConflict } from "./conflict-resolver";
// import { VectorService } from "../services/vector";


/**
 * Class to handle frontend and backend synchronization
 */
const Sync = class Sync {
    /**
     * 
     * @param up_sync_tables : Tables whose contents will be sync'd up
     * @param down_sync_tables : Tables whose contents will be sync'd down
     * @param down_sync_extra_fields : Extra fields to be down-synced per table
     * @param writeable_tables. Tables whose data can be created on the frontend
     */
    constructor(up_sync_tables: Array<string>, down_sync_tables: Array<string>, down_sync_extra_fields: Array<string>, writeable_tables: Array<string>) {
        this.TABLES_TO_UP_SYNC = up_sync_tables;
        this.TABLES_TO_DOWN_SYNC = down_sync_tables;
        this.TABLES_TO_DOWN_SYNC_EXTRA_FIELDS = down_sync_extra_fields; 
        this.ALL_TABLES = Array.from(new Set(up_sync_tables.concat(down_sync_tables)));
    }
    // static TABLES_TO_UP_SYNC = SYNC_CONFIG.TABLES_TO_UP_SYNC;
    // static TABLES_TO_DOWN_SYNC = SYNC_CONFIG.TABLES_TO_DOWN_SYNC;
    // // extra fields to be down-synced per table
    // static TABLES_TO_DOWN_SYNC_EXTRA_FIELDS = SYNC_CONFIG.TABLES_TO_DOWN_SYNC_EXTRA_FIELDS;
    // // Tables whose data can be created on the frontend
    // static WRITEABLE_TABLES = SYNC_CONFIG.WRITEABLE_TABLES;

    /**
     * Synchronize data from local to server
     */
    sync_up = async () => {
        this.TABLES_TO_UP_SYNC.forEach(async (el, idx)=> { 
            let records = await LocalDB.get_all(el); 
            const res = await DB.callApiEndpoint('sync_records', {
                docs: records,
                doctype: el 
            });
            
            if(res.success) {
                // if there were failures, remove from local storage those that succeeded
                await LocalDB.delete_many(el, res.success)
            }
            
            if (res.res === true) {

            } else {
                
            }
        })
    }
    
    /**
     * Synchronize data from server to local
     */
    sync_down = async (on_complete: () => void) => { 
        LocalDB.clear(); // Delete all records before syncing 
        this.TABLES_TO_DOWN_SYNC.forEach(async (el, idx)=> { 
            const keys = Object.keys(this.TABLES_TO_DOWN_SYNC_EXTRA_FIELDS);
            const fields = keys.includes(el) ? this.TABLES_TO_DOWN_SYNC_EXTRA_FIELDS[el]["fields"] : [];
            const filters = keys.includes(el) ? this.TABLES_TO_DOWN_SYNC_EXTRA_FIELDS[el]["filters"] : [];
            const is_writeable = Object.keys(this.WRITEABLE_TABLES).includes(el);      
            let records = [];
            if(filters){
                let cfg = {} as IDBReadParam; 
                cfg.doctype = el
                cfg.fields = fields ? fields : ['name'];
                cfg.filters = filters;
                records = await new DocTypeService(el).get_list(cfg);
            } else {
                records = await new DocTypeService(el).get_all(fields);
            }            
            await LocalDB.insert_many(el, records, false, is_writeable);
        }) 

        // sync reusable lists
        const lists = await new DocTypeService("Reusable List").get_all(["name"]);
        lists?.forEach(async (lst: string) => {
            console.log("Syncing reusable list: ", lst);
            const items = await new DocTypeService(lst).get_all(["name"]);
            await LocalDB.insert_many(lst, items, true, false);
        })
        //VectorService._initialize_localDB();
        on_complete();
    }

    /**
     * Synchronize data from local to server
     */
    full_sync = async () => {  
        this.ALL_TABLES.forEach(async (doctype: string)=> {
            let localRecords: Array<any> = await LocalDB.get_all(doctype) || [];
            let serverRecords: Array<any> = await DB.get_all(doctype) || [];
            
            const finalServerDocs: Array<any> = [];

            // loop through localRecords to see if they exist in server Records
            localRecords.map(async (localDoc) => {
                if(localDoc.name) {
                    // if has an id assigned, then check if it exists in server,
                    // If it does not exist, it may have been deleted
                    const remoteDoc = serverRecords.filter((itm) => itm.name == localDoc.name);
                    if(remoteDoc){
                        const finalDoc = await resolveConflict(localDoc, remoteDoc[0], doctype);
                        if(finalDoc){
                            finalServerDocs.push(finalDoc);
                        }
                    }
                } else {
                    finalServerDocs.push(localDoc);
                }
            })

            // If there are records to push to the server, push
            if(finalServerDocs.length > 0) { 
                const res = await DB.callApiEndpoint('sync_records', {
                    docs: finalServerDocs,
                    doctype: doctype 
                });
            }

            // Retrieve the just saved remote records from server
            const updatedServerRecs = await DB.get_all(doctype);
            // clear the local storage first
            await LocalDB.delete_all(doctype);
            await LocalDB.insert_many(doctype, updatedServerRecs, false, true); 
        })
    }
    
    /**
     * Check if user is online
     */
    static is_online = async () => {
        // ping backend
        let res = await ping();
        return res === 'pong';
    }
}

export { Sync }