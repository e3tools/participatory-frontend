import { boot } from 'quasar/wrappers';
import {
  IDBCreateParam,
  IDBDeleteParam,
  IDBReadParam,
  IDBUpdateParam,
} from 'src/interfaces';
import { Frappe } from '../backend/frappe';
// import { IDBReadSinglePara, IDB } from '../utils/database';
import {
  IDBReadParam,
  IDBReadSingleParam,
  IDBCreateParam,
  IDBUpdateParam,
  IDBDeleteParam,
} from 'src/interfaces';

// See https://frappeframework.com/docs/user/en/api/rest

// "async" is optional
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
// export default boot(async (/* { app, router, ... } */) => {
//   // something to do
// })

/**
 * Class to manage CRUD operations to a Frappe backend
 * @param url Url of the backend server
 */
const database = class Database {
  constructor(backendUrl) {
    this.db = new Frappe(backendUrl);
  }
  async login(data) {
    return await this.db.login(data);
  }

  /**
   * Get definition of a doctype
   * @param doctype Model name
   * @returns An object
   */
  async get_doctype(doctype: string) {
    return await this.db.get_doctype(doctype);
  }

  /**
   * Retrieve a document
   * @param doctype Model name
   * @param docname Unique identifier for record
   * @returns An object
   */
  async get_doc(doctype: string, docname: string) {
    return await this.db.get_doc(doctype, docname);
  }

  /**
   * Retrieve a document
   * @param doctype Model name
   * @param docname Unique identifier for record
   * @returns An object
   */
  async get_doc_v2(config: IDBReadSingleParam) {
    return await this.db.get_doc_v2(config);
  }

  /**
   * Update a model
   * @param doctype Name of the model
   * @param docname Unique identifier for record
   * @param data Object containing key-values to update model
   * @returns
   */
  async update_doc(doctype: string, docname: string, data: object) {
    return await this.db.update_doc(doctype, docname, data);
  }

  /**
   * Update a model
   * @param doctype Name of the model
   * @param docname Unique identifier for record
   * @param data Object containing key-values to update model
   * @returns
   */
  async update_doc_v2(config: IDBUpdateParam) {
    return await this.db.update_doc_v2(config);
  }

  /**
   * Create a new record
   * @param doctype Name of the model
   * @param data JSON object to initialize record with
   * @returns
   */
  async new_doc(doctype: string, data: object) {
    return this.db.new_doc(doctype, data);
  }

  /**
   * Create a new record
   * @param doctype Name of the model
   * @param data JSON object to initialize record with
   * @returns
   */
  async new_doc_v2(config: IDBCreateParam) {
    return this.db.new_doc_v2(config);
  }

  /**
   * Insert/save a new record
   * @param doctype Name of the model
   * @param data JSON object to initialize record with
   * @returns
   */
  async create_doc(doctype: string, data: object) {
    return await this.db.create_doc(doctype, data);
  }

  /**
   * Delete a record
   * @param doctype Name of the model
   * @param docname Unique identifier of the record
   * @returns
   */
  async delete_doc(doctype: string, docname: string) {
    return this.db.delete_doc(doctype, docname);
  }

  /**
   * Delete a record
   * @param doctype Name of the model
   * @param docname Unique identifier of the record
   * @returns
   */
  async delete_doc_v2(config: IDBDeleteParam) {
    return this.db.delete_doc_v2(config);
  }

  /**
   * Get a list of documents
   * @param doctype Model to retrieve data for
   * @param filters AND filters pass as [["field1", "=", "value1"], ["field2", ">", "value2"]]
   * @param or_filters OR filters pass as [["field1", "=", "value1"], ["field2", ">", "value2"]]
   * @param fields Fields to retrieve. pass as ["field1", "field2"]
   * @param order_by Feilds to sort by. pass as "field1 ASC, field2 DESC"
   * @param limit Number of records to return. Pass a positive number. To retrieve all, pass 0
   * @returns
   */
  async get_list(
    config: IDBReadParam
    //doctype: string,
    // filters: Array<string> = [],
    // or_filters: Array<string> = [],
    // fields: Array<string> = ['name'],
    // order_by = 'modified DESC',
    // limit = 1000
  ) {
    return await this.db.get_list(
      config
      //doctype,
      //   filters,
      //   or_filters,
      //   fields,
      //   order_by,
      //   limit
    );
  }

  /**
   * Get PDF
   * @param doctype Name of the model
   * @param docname Unique identifier for the record
   * @param format Print Format to apply
   * @param standard Is it a standard format
   * @param no_letterhead Show without letterhead
   * @param letterhead Letterhead to apply
   * @param lang Language to use
   */
  async get_pdf(
    doctype,
    docname,
    format,
    standard,
    no_letterhead,
    letterhead,
    lang
  ) {
    return await this.db.get_pdf(
      doctype,
      docname,
      format,
      standard,
      no_letterhead,
      letterhead,
      lang
    );
  }
};

export default boot(async ({ app } /* { app, router, ... } */) => {
  // something to do
  const remoteUrl = 'http://127.0.0.1:8000'; // appConfig.domain
  app.config.globalProperties.$remoteUrl = remoteUrl;
  app.config.globalProperties.$db = new database(remoteUrl);
});

export { database };
