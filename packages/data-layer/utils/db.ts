import { Frappe } from '../backends/frappe';
import { LocalDB } from '../backends/localDB'; 
import { IBackend } from '../interfaces/backend'; 
import { IDBReadParam } from '../../../apps/participatory-app/app/interfaces/database';
import * as CONFIG from '../config';
import { APP } from 'common';

const DB = new Frappe(CONFIG.URLS.BACKEND);
const FrappeBackend = new Frappe(CONFIG.URLS.BACKEND);
const ping = DB.ping;
export { DB, ping, LocalDB }

export const DBManager = class DBManager implements IBackend {
    async login(data: object) : Promise<string> {
        return '';
    }

    async get_doc(doctype: string, docname: string) : Promise<object>{
        return await LocalDB.get_doc(doctype, docname);
    }

    async call_api_endpoint(endpoint: string, data: object, method: string, is_upload: boolean, is_export: boolean , timeout: number = CONFIG.GLOBALS.BACKEND_TIMEOUT) : Promise<object>{
        return await FrappeBackend.call_api_endpoint(endpoint, data, method, is_upload, is_export , timeout);
    }

    async update_doc(doctype: string, docname: string, data: object) : Promise<object>{
        return await LocalDB.update(doctype, data);
    }

    async get_doctype(doctype: string): Promise<object>{
        return await LocalDB.get_doc("DocType", doctype);
    }

    async delete_doc(doctype: string, docname: string): Promise<object>{
        return await LocalDB.delete(doctype, docname);
    }

    async get_all(doctype: string): Promise<object[]>{
        return await LocalDB.get_all(doctype);
    }

    async get_list(config: IDBReadParam, get_global_count:boolean) : Promise<object[]>{
        return await LocalDB.get_list(config.doctype, config.filters, config.or_filters, config.order_by);
    }

    async get_count(config: IDBReadParam): Promise<number>{
        return await LocalDB.get_count(config.doctype, config.filters, config.or_filters, config.order_by);
    }

    /**
    * Is backend server up and running
    * @returns 
    */
    async is_online() {
        return await FrappeBackend.is_online(); 
    }

    /**
    Synchronize data downwards from backend
    */
    async sync_down() {
        if(await this.is_online()) {
            // sync data downwards
            
        } else {
            APP.alert_error("You are offline!")
        }     
    }
}