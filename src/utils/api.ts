import { do_request } from '../utils/axios'
import { AuthenticationService } from 'src/services/AuthenticationService';

 /**
   * Get updated headers
   */
const get_headers = (headers: object) => {
  const token = AuthenticationService.get_loggedIn_user_token();
  headers.Authorization = `token ${token}`;
  headers.Accept = 'application/json'
  //headers['X-Frappe-CSRF-Token'] = AuthenticationService.get_csrf_token();
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
const make_request = async (
  url: string,
  method = 'POST',
  body: object = {},
  headers: object = {},
  data_property = 'data'
) => {
   /**
   * Get updated headers
   */
  headers = get_headers(headers)
  return do_request(url,
    method,
    body,
    headers,
    data_property)
};
export { make_request, get_headers };
