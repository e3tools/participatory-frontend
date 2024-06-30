import { observable } from "@legendapp/state";
import { APP } from "../utils/app";
import { configureObservablePersistence, persistObservable } from "@legendapp/state/persist";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { LocalDBState$ } from "../stores/db";
import { all } from "axios";

const ID_PROPERTY = '_name';
const NEW_RECORD_MARKER_PROPERTY = '_new'

/**
 * Wrapper for data that is stored locally 
 */
const LocalDB = class LocalDB {    
    /**
     * Show not implemented message
     * @param message 
     */
    static throw_not_implemented = (message: string) => {
        APP.alert_error(APP._("GLOBAL.NOT_IMPLEMENTED_IN_OFFLINE") + message);
    }
    /**
     * Remove all records in the local storage
     */
    static clear = async() => {
       LocalDBState$.data.assign({});
    }
    
    /**
     * Insert new record
     * @param doctype . Type of record
     * @param new_docs . List of records to insert
     * @param is_new . Is this a new entry into the local state
     * @param is_table_writable. Is the table writeable from the frontend
     */
    static insert = async (doctype: string, doc: object, is_new: boolean = true, is_table_writable: boolean = true) => {
        this.insert_many(doctype, [doc], is_new, is_table_writable)
    }

    /**
     * Insert new records
     * @param doctype . Type of record
     * @param new_docs . List of records to insert
     * @param is_new . Is this a new entry into the local state
     * @param is_table_writable. Is the table writeable from the frontend
     */
    static insert_many = async (doctype: string, new_docs: [], is_new: boolean = false, is_table_writable: boolean = true) => { 
        let docs = await this.get_all(doctype); 
        new_docs.forEach((doc) => { 
            if(is_table_writable) {
                doc[ID_PROPERTY] = is_new ? APP.generate_random_string(10) : doc.name;
                doc[NEW_RECORD_MARKER_PROPERTY] = is_new
            }
            // doc['doctype'] = doctype; 
            docs.push(doc); 
        })        
        this._persist(doctype, docs);
    }

    /**
     * Update existing record
     * @param doctype 
     * @param doc 
     */
    static update = async (doctype: string, doc: object) => {
        const existing = await this.get_doc(doctype, doc[ID_PROPERTY]);
        if (existing) {
            const docs = await this.get_all(doctype)
            const index = docs.findIndex((el) => el[ID_PROPERTY] == doc[ID_PROPERTY]);
            docs[index] = doc; 
            this._persist(doctype, docs);
        }
        throw APP._("GLOBAL.DELETE_NOT_EXIST");
    }

    /**
     * Update existing record
     * @param doctype 
     * @param doc 
     */
    static upsert = async (doctype: string, doc: object) => {
        const existing = await this.get_doc(doctype, doc[ID_PROPERTY]);
        if (existing) {
            return await this.update(doctype, doc); 
        } else {
            return await this.insert(doctype, doc, true, true)
        } 
    }

    /**
     * Delete existing record
     * @param doctype 
     * @param docname 
     */
    static delete = async (doctype: string, docname: string) => {
        const docs = await this.get_all(doctype);
        let others = docs.filter((el) => el[ID_PROPERTY] != docname); 
        if(docs.length == others.length || docs.length == 0){
            throw APP._("GLOBAL.DELETE_NOT_EXIST");
        }
        this._persist(doctype, others);
    }

    /**
     * Delete multiple exisiting records
     * @param doctype 
     * @param docnames 
     */
    static delete_many = async (doctype: string, docnames: []) => {
        const docs = await this.get_all(doctype);
        let others = docs.filter((el) => !docnames.includes(el[ID_PROPERTY])); 
        if(docs.length == others.length || docs.length == 0){
            throw APP._("GLOBAL.DELETE_NOT_EXIST");
        }
        this._persist(doctype, others);
    }

    /**
     * Get all records stored locally
     * @param doctype 
     * @returns 
     */
    static get_all = async (doctype: string) => { 
        console.log("LocalDBState$ Offline", LocalDBState$)
        let all_docs = await LocalDBState$.data.get(); 
        console.log("Retrieved all docs", all_docs)
        let docs = all_docs ? all_docs[doctype] : [];
        return docs ? docs : []; 
    }

    /**
     * Get list of docs
     * @param doctype. Type of records to be filtered 
     * @param filters. Array of AND filters e.g [["name", "=", "steve"]]
     * @param or_filters. Array of OR filters e.g [["name", "=", "Nyaga"]]
     * @param order_by . Array of form [key, dir] e.g ["name", "asc"]. For now we are support only one filter
     */
    static get_list = async(doctype: string, filters: [] = [], or_filters: [] = [], order_by: Array<string> = []) => {
        let docs = await this.get_all(doctype);        
        docs = this._filter(docs, filters, or_filters);
        if(order_by){
            this._sort(docs, order_by[0], order_by[1]);
        }
        return docs;    
    }   

    /**
     * Get count of records
     * @param doctype 
     * @param filters 
     * @param or_filters 
     * @param order_by 
     * @returns 
     */
    static get_count = async(doctype: string, filters: [] = [], or_filters: [] = [], order_by: Array<string> = []) => {
        let docs = await this.get_list(doctype, filters, or_filters, order_by);
        return docs?.length;
    }

    /**
     * Get document
     * @param doctype 
     * @param docname 
     * @returns 
     */
    static get_doc = async (doctype: string, docname: string) => {
        const docs = await this.get_all(doctype);
        return docs.filter((el) => el[ID_PROPERTY] === docname);
    }

    /**
     * Internal method to save records in localdb
     * @param doctype 
     * @param docs 
     */
    static _persist = (doctype: string, docs:[]) => { 
        // LocalDBState$[doctype].set(JSON.stringify(docs)); 
        //LocalDBState$.doctype.set(docs);
        // const state = Object.assign({}, LocalDBState$);
        // state[doctype] = docs
        // LocalDBState$.assign(state)
        // // LocalDBState$.`${doctype}`.set(docs); 

        // get current recs
        const recs = LocalDBState$.data.get();
        recs[doctype] = docs;
        LocalDBState$.data.set(recs);
    }

    /**
     * Apply filters locally
     * @param docs 
     * @param filters 
     * @param or_filters 
     */
    static _filter = (docs: [], filters: [] = [], or_filters: Array<[]> = []) => {
        // start with OR filters  
        let res1 = docs.filter((el) => {
            let res = false;
            for(var i=0; i < filters.length; i++){
                let filter = filters[i];
                res = i == 0 ? this._filter_element(el, filter) : res || this._filter_element(el, filter);
            }
            return res;
        })
       
        // then AND filters
        let res2 = res1.filter((el) => {
            let res = false;
            for(var i=0; i < filters.length; i++){
                let filter = filters[i];
                res = i == 0 ? this._filter_element(el, filter) : res && this._filter_element(el, filter);
            }
            return res;
        })

        return res2;

        /*
        if (fields) {
        // url = url + '?fields=' + fields
        url = url + '?fields=' + JSON.stringify(fields);
        }
        if (config.filters) {
        filters = JSON.stringify(config.filters);
        url = url + '&filters=' + JSON.stringify(config.filters);
        }
        if (config.or_filters) {
        filters = JSON.stringify(config.or_filters);
        url = url + '&or_filters=' + JSON.stringify(config.or_filters);
        }
        if (config.order_by) {
        url = url + `&order_by=${config.order_by}`;
        }
        //page start / limits
        url = url + `&limit_start=${config.limit_start || 0}`;
        if (config.limit_page_length) 
        { 
        url = url + `&limit_page_length=${config.limit_page_length || GLOBALS.MAX_DATA_ROWS }`;
        } 
        else {
        url = url + `&limit_page_length=${GLOBALS.MAX_DATA_ROWS }`;
        }
        */
    }

    static _filter_element = (el: object, filter_obj: Array<object> = []) => {
        let key = filter_obj[0];
        let operator = filter_obj[1];
        let val = filter_obj[2];
   
        switch(operator) {
        case "=":
            return el[key] === val;	
            break; 
        case '!=':
            return el[key] !== val;	
            break; 
        case '<':
            return el[key] < val;	
            break; 
        case '<=':
            return el[key] > val;	
            break; 
        case '>':
            return el[key] > val;	
            break; 
        case '>=':
            return el[key] > val;	
            break; 
        case 'like':
            return el[key].indexOf(val) != -1;	
            break;  
        }
        return false;
    }

    static _sort = (docs: [], sort_by: string = "name", sort_dir: string = "asc") => {
        docs.sort((a, b) => {
            return sort_dir.toLocaleLowerCase () ? a[sort_by] - b[sort_by] : b[sort_by] - a[sort_by];
        })
    }
}

export { LocalDB }