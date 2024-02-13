import { boot } from 'quasar/wrappers'
import { URLS } from 'src/enums'

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
    this.url = url
    this.token = ''
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    this.resource_url = `${this.url}/api/resource`
    this.frappe_custom_app = 'participatory_backend'
  }
  async login(data) {
    //const res = await fetch(`${this.url}/api/method/login`, {
    const res = await fetch(
      `${this.url}/api/method/${this.frappe_custom_app}.api.login`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data),
      }
    )
    const auth = await res.json()
    if (auth.message.status_code == 200) {
      let user = await fetch(`${this.resource_url}/User/${auth.message.user}`, {
        method: 'GET',
        headers: { Authorization: `token ${auth.message.token}` },
      })
      user = await user.json()
      return await { ...user, token: auth.message.token }
    } else {
      return auth.message
    }
  }
 
  /**
   * Get updated headers
   */
  get_headers() {
    const token = JSON.parse(localStorage.getItem('frappeUser')).token
    this.headers.Authorization = `token ${token}`
  }
  
  /**
   *  Make request    
   * @param url URL to make request to
   * @param method either GET/PUT/DELETE/POST
   * @param body JSON object
   * @returns 
   */
  async make_request(url:string, method:string, body:object = {}) {
    try {
      this.get_headers()
      const payload = {
        method,
        headers: this.headers
      }
      if(method != 'GET' && body){
        payload.update('body', body)
      }

      const res = await fetch(url, payload)
      return await this.handle_response(res)
    } catch (error) {
      console.log(error)
    }
  }
  
  /**
   * Handle response
   * @param res Response object
   * @returns 
   */
  async handle_response(res:object) {
    if (res.status == 200) {
      const data = await res.json()
      return await { status_code: res.status, data: data.data }
    } else if (res.status == 404) {
      return { status_code: res.status, text: res.statusText }
    }
  }

  /**
   * Retrieve a document
   * @param doctype Model name
   * @param docname Unique identifier for record
   * @returns An object
   */
  async get_doc(doctype:string, docname:string) {
    return await this.make_request(
      `${this.resource_url}/${doctype}/${docname}`,
      'GET'
    ) 
  }

 
  /**
   * Update a model
   * @param doctype Name of the model
   * @param docname Unique identifier for record
   * @param data Object containing key-values to update model
   * @returns 
   */
  async update_doc(doctype:string, docname:string, data:object) {
    return await this.make_request(
      `${this.resource_url}/${doctype}/${docname}`,
      'PUT',
      JSON.stringify(data)
    )
  }
 
  /**
   * Create a new record
   * @param doctype Name of the model
   * @param data JSON object to initialize record with
   * @returns 
   */
  async new_doc(doctype:string, data:object) {
    return await this.make_request(
      `${this.resource_url}/${doctype}`,
      'POST',
      JSON.stringify(data)
    )
  }

  /**
   * Delete a record
   * @param doctype Name of the model
   * @param docname Unique identifier of the record
   * @returns 
   */
  async delete_doc(doctype:string, docname:string) {
    return await this.make_request(
      `${this.resource_url}/${doctype}/${docname}`,
      'DELETE'
    )
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
    doctype: string,
    filters : Array<string> = [],
    or_filters : Array<string> = [],
    fields: Array<string> = ['name'],
    order_by: string = 'modified DESC',
    limit: number = 1000
  ) { 
    let url = `${this.resource_url}/${doctype}`
    fields = fields || 'name'
    if (fields) {
      // url = url + '?fields=' + fields
      url = url + '?fields=' + JSON.stringify(fields)
    }
    if (filters) {
      url = url + '&filters=' + JSON.stringify(filters)
    }
    if (or_filters) {
       url = url + '&or_filters=' + JSON.stringify(or_filters)
    }
    if (order_by) {
       url = url + `&order_by=${order_by}`
    }
    if (limit) {
       url = url + `&limit=${limit}`
    }
    return await this.make_request(`${url}`, 'GET')
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
    format = format ? format : 'Standard'
    no_letterhead = no_letterhead ? no_letterhead : 1
    letterhead = letterhead ? letterhead : 'No Letterhead'
    lang = lang ? lang : 'en'

    this.get_headers()
    const url = `${this.resource_url}/frappe.utils.print_format.download_pdf?doctype=${doctype}&docname=${docname}&format=${format}&no_letterhead=${no_letterhead}&letterhead=${letterhead}&settings=%7B%7D&lang=${lang}`
    const res = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    })
    if (res.status == 200) {
      const blob = await res.blob()
      const file = await window.URL.createObjectURL(blob)
      window.location.assign(file)
    } else {
      this.$popIt.error('Error', res.statusText)
    }
  }
}

export default boot(async ({ app } /* { app, router, ... } */) => {
  // something to do
  const remoteUrl = URLS.BACKEND; // appConfig.domain
  app.config.globalProperties.$remoteUrl = remoteUrl
  app.config.globalProperties.$frappe = new Frappe(remoteUrl)
})

export { Frappe }