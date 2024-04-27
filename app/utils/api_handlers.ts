import axios from "axios";
import { APP } from "./app";
import { GLOBALS } from "../constants/defaults";
import { Alert } from "react-native";
class AxiosHandler {
    /**
     *  Make request
     * @param url URL to make request to
     * @param method either GET/PUT/DELETE/POST
     * @param body JSON object
     * @param data_property Property of the response that contains data from server
     * @returns
     */
    static async do_request(
        url: string,
        method = 'POST',
        body: object = {},
        headers: object = {},
        data_property = 'data',
        is_upload: boolean=false,
        is_export: boolean=false
    ){
      
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
            headers: headers,
            timeout: GLOBALS.BACKEND_TIMEOUT
          })  
        return await this.handle_response(res, data_property, is_upload, is_export);
      } catch (error) { 
        Alert.alert("Login error: ", error.toString())
        const message = JSON.parse(JSON.parse(error.response.data._server_messages)[0]).message
        APP.show_error(message)  
          if (error.code === "ECONNABORTED") {
            console.log("Request timed out");
          } else {
            console.log(error.message);
          }
      }
/*
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
                headers: headers,
                timeout: GLOBALS.BACKEND_TIMEOUT
            })
            
            .then(response => { 
              //handle the response  
              // Alert.alert("Login rers: ", response)
            })
        .catch(error => { 
            Alert.alert("Login error: ", error)
            const message = JSON.parse(JSON.parse(error.response.data._server_messages)[0]).message
            APP.show_error(message)      
        })  
        return await this.handle_response(res, data_property, is_upload, is_export);
        
        } catch (error) { 
          console.log(error);
        }*/
    };
    
    /**
     * Handle response
     * @param res Response object
     * @param data_property Property of the response that contains data from server
     * @returns
     */
    static async handle_response(res: object, data_property: string, is_upload: boolean = false, is_export: boolean = false){ 
        if (res?.status == 200) {
          if(is_export){
            const file_name = await res.headers?.['content-disposition'];
            if(file_name){
              let fname = file_name.toString().replace('"', '').replace("filename=", "");
              return await { status_code: res.status, data: file_name.toString().replace('"', '').replace("filename=", "") };
            }
            else {
              return { status_code: 404, text: 'Export failed' };
            }
          }
          else {
            const data = await res.data;
            return await { status_code: res.status, data: data[data_property] };
          }
        } else if (res?.status == 404) {
            return { status_code: res.status, text: res.statusText };
        }
    };  
}

class FetchHandler {
    
/**
 *  Make request
 * @param url URL to make request to
 * @param method either GET/PUT/DELETE/POST
 * @param body JSON object
 * @param data_property Property of the response that contains data from server
 * @returns
 */
static async do_request(
    url: string,
    method = 'POST',
    body: object = {},
    headers: object = {},
    data_property = 'data'
  ){
    try {
      const payload = {
        method,
        headers: headers,
      };
      if (method != 'GET' && body) {
        payload['body'] = JSON.stringify(body);
      }
      const res = await fetch(url, payload)/*.catch((error) => { 
      });*/
      if (!res.ok) {
        const message = `An error has occured: ${res.status}`;
        throw new Error(message);
      }
      return await this.handle_response(res, data_property);
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
  static async handle_response(res: object, data_property: string){
    if (res?.status == 200) {
      const data = await res.json();
      return await { status_code: res.status, data: data[data_property] };
    } else if (res?.status == 404) {
      return { status_code: res.status, text: res.statusText };
    }
  };  
}
export { AxiosHandler, FetchHandler }