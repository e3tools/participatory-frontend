import { AxiosHandler } from "./api_handlers";
import { UserStore } from '../modules/auth/stores/user_store';
import { GLOBALS } from "../constants/defaults";

 /**
   * Get updated headers
   */
const get_headers = async (headers: object) => {
  const token = await UserStore.get_auth_token();
  headers['Authorization'] = `token ${token}`;
  headers['Accept'] = 'application/json'
  //headers['X-Frappe-CSRF-Token'] = AuthService.get_csrf_token();
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
  data_property = 'data',
  is_upload=false,
  is_export=false,
  timeout: Number = GLOBALS.BACKEND_TIMEOUT
) => {
   /**r
   * Get updated headers
   */
  headers = await get_headers(headers)
  // if(is_upload){
  //   headers['Accept'] = "application/x-www-form-urlencoded"
  // }   
  return AxiosHandler.do_request(url,
    method,
    body,
    headers,
    data_property,
    is_upload,
    is_export,
    timeout
  )
}; 

export { make_request, get_headers };
