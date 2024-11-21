import { IDBReadParam } from "./database";

export interface IBackend {
    login(data: object) : Promise<string>;
    get_doc(doctype: string, docname: string) : Promise<object>;
    call_api_endpoint?(endpoint: string, data: object, method: string, is_upload: boolean, is_export: boolean , timeout: number) : Promise<object>;
    update_doc(doctype: string, docname: string, data: object) : Promise<object>;
    get_doctype(doctype: string): Promise<object>;
    delete_doc(doctype: string, docname: string): Promise<object>;
    get_all(doctype: string): Promise<object[]>;
    get_list(config: IDBReadParam, get_global_count:boolean) :Promise<object[]>;
    get_count(config: IDBReadParam): Promise<number>; 
}; 