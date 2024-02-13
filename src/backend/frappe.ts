// import { boot } from 'quasar/wrappers'
import { AuthenticationService } from 'src/services/AuthenticationService';
import {
  IDBReadParam,
  IDBReadSingleParam,
  IDBCreateParam,
  IDBUpdateParam,
  IDBDeleteParam,
} from '../utils/database';

import { make_request } from 'src/utils/api';
import { APPS, URLS } from 'src/enums'; 

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
const Frappe = class Frappe {
  constructor(url) {
    this.url = url;
    this.token = '';
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    this.resource_url = `${this.url}/api/resource`;
    this.frappe_custom_app = APPS.FRAPPE_CUSTOM_APP;
    this.api_url = `${this.url}/api/method/${this.frappe_custom_app}.api`;
  }
  async login(data) {
    //const res = await fetch(`${this.url}/api/method/login`, {
    const res = await fetch(
      `${this.url}/api/method/${this.frappe_custom_app}.api.login`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    const auth = await res.json();
    if (auth.message.status_code == 200) {
      let user = await fetch(`${this.resource_url}/User/${auth.message.user}`, {
        method: 'GET',
        headers: { Authorization: `token ${auth.message.token}` },
      });
      user = await user.json();
      return await { ...user, token: auth.message.token };
    } else {
      return auth.message;
    }
  }

  /**
   * Call API method
   * @param endpoint. API Endpoint name without prefix i.e non-fully qualified
   * @param method. Either GET/POST/PUT/DELETE
   */
  async call_api_endpoint(endpoint: string, data: object = {}, method: 'POST') {
    return await this._makeRequest(
      `${this.url}/api/method/${this.frappe_custom_app}.api.${endpoint}`,
      method,
      data,
      'message'
    );
  }

  /**
   * Get updated headers
   */
  // get_headers() {
  //   const token = AuthenticationService.get_loggedIn_user_token();
  //   this.headers.Authorization = `token ${token}`;
  // }

  /**
   *  Make request
   * @param url URL to make request to
   * @param method either GET/PUT/DELETE/POST
   * @param body JSON object
   * @param data_property Property of the response that contains data from server
   * @returns
   */
  async _makeRequest(
    url: string,
    method: string,
    body: object = {},
    data_property = 'data'
  ) {
    //this.get_headers();
    const res = await make_request(
      url,
      method,
      body,
      this.headers,
      data_property
    );
    if (res?.status_code === 200) {
      return await res?.data;
    } else {
      return await res?.statusText;
    }
  }

  /**
   * Retrieve a document
   * @param doctype Model name
   * @param docname Unique identifier for record
   * @returns An object
   */
  async get_doc(doctype: string, docname: string) {
    return await this._makeRequest(
      `${this.resource_url}/${doctype}/${docname}`,
      'GET'
    );
  }

  /**
   * Retrieve a document
   * @param doctype Model name
   * @param docname Unique identifier for record
   * @returns An object
   */
  async get_doc_v2(config: IDBReadSingleParam) {
    return await this._makeRequest(
      `${this.resource_url}/${config.doctype}/${config.docname}`,
      'GET'
    );
  }

  /**
   * Update a model
   * @param doctype Name of the model
   * @param docname Unique identifier for record
   * @param data Object containing key-values to update model
   * @returns
   */
  async update_doc(doctype: string, docname: string, data: object) {
    return await this._makeRequest(
      `${this.resource_url}/${doctype}/${docname}`,
      'PUT',
      data
      //JSON.stringify(data)
    );
  }

  /**
   * Update a model
   * @param doctype Name of the model
   * @param docname Unique identifier for record
   * @param data Object containing key-values to update model
   * @returns
   */
  async update_doc_v2(config: IDBUpdateParam) {
    return await this._makeRequest(
      `${this.resource_url}/${config.doctype}/${config.docname}`,
      'PUT',
      JSON.stringify(config.data)
    );
  }

  /**
   * Get definition of a doctype
   * @param doctype Name of the model
   * @param data JSON object to initialize record with
   * @returns
   */
  async get_doctype(doctype: string) {
    const url = `${this.api_url}.get_doctype`;
    const args = { doctype: doctype, with_parent: 1, cached_timestamp: null };
    const obj = await this._makeRequest(
      `${url}`,
      'POST',
      args, // JSON.stringify(args),
      'docs'
    );
    const matches = obj ? obj.filter((itm) => itm.name == doctype) : {};
    return matches ? matches[0] : {};
    // let newDoc = {};
    // if (obj) {
    //   const filtered = obj.filter((itm) => itm['name'] === doctype);
    //   newDoc = filtered.length === 1 ? filtered[0] : {};
    // }
    // const doc = {
    //   ...newDoc,
    //   //...data,
    // };
    // return doc;
  }

  /**
   * Initialize a new record
   * @param doctype
   * @param data JSON object to initialize record with
   * @returns
   */
  async new_doc(doctype: string, data: object) {
    const url = `${this.api_url}.new_doc`;
    const args = { doctype: doctype };
    const obj = await this._makeRequest(
      `${url}`,
      'POST',
      args, // JSON.stringify(args),
      'message'
    );
    return obj;
  }

  /**
   * Insert/save a new record
   * @param doctype Name of the model
   * @param data JSON object to initialize record with
   * @returns
   */
  async create_doc(doctype: string, data: object) {
    return await this._makeRequest(
      `${this.resource_url}/${doctype}`,
      'POST',
      data //JSON.stringify(data)
    );
  }

  /**
   * Insert/save a new record
   * @param doctype Name of the model
   * @param data JSON object to initialize record with
   * @returns
   */
  async create_doc_v2(config: IDBCreateParam) {
    return await this._makeRequest(
      `${this.resource_url}/${config.doctype}`,
      'POST',
      config.data // JSON.stringify(config.data)
    );
  }

  /**
   * Delete a record
   * @param doctype Name of the model
   * @param docname Unique identifier of the record
   * @returns
   */
  async delete_doc(doctype: string, docname: string) {
    return await this._makeRequest(
      `${this.resource_url}/${doctype}/${docname}`,
      'DELETE'
    );
  }

  /**
   * Delete a record
   * @param doctype Name of the model
   * @param docname Unique identifier of the record
   * @returns
   */
  async delete_doc_v2(config: IDBDeleteParam) {
    return await this._makeRequest(
      `${this.resource_url}/${config.doctype}/${config.docname}`,
      'DELETE'
    );
  }

  /**
   * Get a list of documents
   * @param doctype Model to retrieve data for
   * @param filters AND filters pass as [["field1", "=", "value1"], ["field2", ">", "value2"]]
   * @param or_filters OR filters pass as [["field1", "=", "value1"], ["field2", ">", "value2"]]
   * @param fields Fields to retrieve. pass as ["field1", "field2"]
   * @param order_by Feilds to sort by. pass as "field1 ASC, field2 DESC"
   * @param limit_start Which record to pick as first. Pass a positive number. To retrieve all, pass 0
   * @param limit_page_length Number of records to return. Pass a positive number. To retrieve all, pass 0
   * @returns
   */
  async get_list(config: IDBReadParam, get_global_count=false) {
    let url = `${this.resource_url}/${config.doctype}`;
    const fields = config.fields || 'name';
    let filters = {}
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
    if (config.limit_page_length) {
      url = url + `&limit_start=${config.limit_start || 0}`;
      url = url + `&limit_page_length=${config.limit_page_length}`;
    }
    const docs = await this._makeRequest(`${url}`, 'GET');
    let total_count = docs.length
    if(get_global_count){
      total_count = await this.call_api_endpoint('get_count', { filters, doctype: config.doctype, fields: ['name'] }, 'POST');
    }
    return get_global_count ? [docs, total_count] : docs
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
    format = format ? format : 'Standard';
    no_letterhead = no_letterhead ? no_letterhead : 1;
    letterhead = letterhead ? letterhead : 'No Letterhead';
    lang = lang ? lang : 'en';

    //this.get_headers();
    const url = `${this.resource_url}/frappe.utils.print_format.download_pdf?doctype=${doctype}&docname=${docname}&format=${format}&no_letterhead=${no_letterhead}&letterhead=${letterhead}&settings=%7B%7D&lang=${lang}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });
    if (res.status == 200) {
      const blob = await res.blob();
      const file = await window.URL.createObjectURL(blob);
      window.location.assign(file);
    } else {
      this.$popIt.error('Error', res.statusText);
    }
  }
};

// export default boot(async ({ app } /* { app, router, ... } */) => {
//   // something to do
//   const remoteUrl = URLS.BACKEND; // appConfig.domain
//   app.config.globalProperties.$remoteUrl = remoteUrl
//   app.config.globalProperties.$frappe = new Frappe(remoteUrl)
// })

export { Frappe };
