// const get_api_endpoint = (url) => {
//   let backend = 'http://127.0.0.1:8003/api/method';
//   return `${backend}/${url}`;
// };

// export { get_api_endpoint };

import { doRequest } from '../utils/axios'
import { AuthenticationService } from 'src/services/AuthenticationService';
//import { doRequest } from "../utils/fetch";

 /**
   * Get updated headers
   */
const getHeaders = (headers) => {
  const token = AuthenticationService.getLoggedInUserToken();
  headers.Authorization = `token ${token}`;
  headers.Accept = 'application/json'
  //headers['X-Frappe-CSRF-Token'] = AuthenticationService.getCSRFToken();
  return headers
}

/**
 *  Make request
 * @param url URL to make request to
 * @param method either GET/PUT/DELETE/POST
 * @param body JSON object
 * @param data_property Property of the response that contains data from server
 * @returns
 */
const makeRequest = async (
  url: string,
  method = 'POST',
  body: object = {},
  headers: object = {},
  data_property = 'data'
) => {
   /**
   * Get updated headers
   */
  headers = getHeaders(headers)
  return doRequest(url,
    method,
    body,
    headers,
    data_property)
};

export { makeRequest, getHeaders };
