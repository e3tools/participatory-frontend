 
import { boolean } from "yup";
import { DB, ping, LocalDB } from "../utils/db";
import { DocTypeService } from "../services/doctype";
import { IDBReadParam } from "../interfaces/database";
import { VectorService } from "../services/vector";
 

/**
 * Class to handle frontend and backend synchronization
 */
const Sync = class Sync {
    static TABLES_TO_UP_SYNC = [];
    static TABLES_TO_DOWN_SYNC = ["DocType", "User", "Admin 0", "Admin 1", 
            "Admin 2", "Admin 3", "Admin 4", "Admin 5",
            "Engagement", "Engagement Template", "Technical Analysis"
        ];
    
    // extra fields to be down-synced per table
    static TABLES_TO_DOWN_SYNC_EXTRA_FIELDS = { 
        "User": { "fields": ["full_name"], "filters": {} },
        "DocType": { "fields": ["*"], "filters": [["module", "=", "Engage"]] },
        "Engagement": { "fields": ["*"], "filters": [] },
        "Engagement Template": { "fields": ["*"], "filters": [] }, 
        "Technical Analysis": { "fields": ["*"], "filters": []}
    } 
    // Tables whose data can be created on the frontend
    static WRITEABLE_TABLES = [
        'Engagement'
    ]

    /**
     * Synchronize data from local to server
     */
    static sync_up = async () => {
        this.TABLES_TO_UP_SYNC.forEach(async (el, idx)=> {
            console.log("Uploading...", el);
            let records = await LocalDB.get_all(el);
            const res = await DB.call_api_endpoint('sync_records', {
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
    static sync_down = async () => { 
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

        VectorService._initialize_localDB();
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