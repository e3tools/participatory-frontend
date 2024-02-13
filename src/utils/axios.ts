import axios from "axios"
import { AppUtil } from '../utils/app'
/**
 *  Make request
 * @param url URL to make request to
 * @param method either GET/PUT/DELETE/POST
 * @param body JSON object
 * @param data_property Property of the response that contains data from server
 * @returns
 */
const do_request = async (
  url: string,
  method = 'POST',
  body: object = {},
  headers: object = {},
  data_property = 'data'
) => {
  try {
    const payload = {  
      headers: headers,
    };
    if (method != 'GET' && body) {
      payload['body'] = JSON.stringify(body);
    }

    const res = await axios({
      method: method.toLocaleLowerCase(),// 'post',
      url: url,      
      //timeout: 4000, // 4 seconds timeout
      data: method != 'GET' ? payload['body'] : {},
      params: method == 'GET' ? payload['body'] : {},
      headers: headers
    })
    // .then(response => { 
    //   /* handle the response */
    // })
    .catch(error => {
      console.log(error)  
      const message = JSON.parse(JSON.parse(error.response.data._server_messages)[0]).message
      AppUtil.show_error(message)      
    }) 
    return await handle_response(res, data_property);
     
  } catch (error) { 
    console.log(error);
  }
};

/**
 * Handle response
 * @param res Response object
 * @param data_property Property of the response that contains data from server
 * @returns
 */
const handle_response = async (res: object, data_property: string) => {
  if (res.status == 200) {
    const data = await res.data;
    return await { status_code: res.status, data: data[data_property] };
  } else if (res.status == 404) {
    return { status_code: res.status, text: res.statusText };
  }
};

export { do_request };
