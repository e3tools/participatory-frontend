import { IDBReadParam } from "../interfaces/database";
import { DB } from "../utils/db";

class DocTypeService {
  constructor(doctype: string) {
    this.db = DB;
    this.doctype = doctype;
  }

  /**
   * Get definition of a doctype
   * @param doctype 
   */
  get_doctype = async () => { 
    return await this.db.get_doctype(this.doctype);
  }; 

  /**
   * Get document from backend
   * @param docname 
   * @returns 
   */
  get_doc = async (docname: string) => {
    return await this.db.get_doc(this.doctype, docname);
  };

  /**
   * Instantiate a new document without saving it
   * @param data 
   * @returns 
   */
  new_doc = async (data: object) => {
    return await this.db.new_doc(this.doctype, data);
  };

  /**
   * Save new document
   * @param data 
   * @returns 
   */
  create_doc = async (data: object) => {
    return await this.db.create_doc(this.doctype, data);
  };

   /**
   * Update existing document if it exists, else create a new one
   * @param data 
   * @returns 
   */
   upsert_doc = async (data: object) => {
    if(data.name){
      return await this.db.update_doc(this.doctype, data.name, data);
    } else {
      return await this.db.create_doc(this.doctype, data);
    }
  };

  /**
   * Update existing document
   * @param data 
   * @returns 
   */
  update_doc = async (data: object, docname: string) => {
    return await this.db.update_doc(this.doctype, docname, data);
  };

  /**
   * Delete document
   * @param docname 
   * @returns 
   */
  delete_doc = async (docname: string) => {
    return await this.db.delete_doc(this.doctype, docname);
  };

  /**
   * Get a list of documents
   * @param config 
   * @returns 
   */
  async get_list(config: IDBReadParam, get_global_count=false) {
    if(!config.doctype){
      config.doctype = this.doctype
    }
    if(!config.fields){
      config.fields = ['name']
    } 
    return await this.db.get_list(config, get_global_count);
  }

  /**
   * Get a list of documents
   * @param config 
   * @returns 
   */
  async get_count(config: IDBReadParam) {
    if(!config.doctype){
      config.doctype = this.doctype;
    } 
    return await this.db.get_count(config);
  }

}

export { DocTypeService };
