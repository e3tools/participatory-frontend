import axios, { AxiosError } from "axios";
import { APP } from "./app";
import { GLOBALS } from "../constants/defaults";
import { Alert } from "react-native"; 
import { AuthService } from "../modules/auth/services/auth";
import { UserStore } from "../modules/auth/stores/user_store";

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
        is_export: boolean=false,
        timeout: Number = GLOBALS.BACKEND_TIMEOUT
    ){
       
      try {
        APP.toggle_loading(true);
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
            timeout: timeout
          }) 
          APP.toggle_loading(false);
          return await this.handle_response(res, data_property, is_upload, is_export);
         } catch (error: AxiosError) { 
          APP.toggle_loading(false);
          if (error.response) {
            // Request made but the server responded with an error
            console.log("RESP DATA:", error.response.data);
            console.log("RESP STATUS:", error.response.status);
            console.log("RESP HEADERS:", error.response.headers);
            if(error.code === 'ECONNABORTED'){
              const message = JSON.parse(JSON.parse(error.response.data._server_messages)[0]).message
              APP.show_error(message)  
            } 
            else {              
              const title = `Server Error: ${error.response.status}`
              const message = error.response.data?.exception || ''
              APP.show_error(message, title);
              // do actions after showing the error message
              if (error.response.status == 401){
                // const auth = useAuth();
                // auth.is_authenticated = false;
                // auth.logout()
                // AuthService.logout();
                // await UserStore.remove_user();
                // console.log("Logging out ")
                // AuthService.logout()
              }
            }
          } else if (error.request) {
            // Request made but no response is received from the server.
            console.log("NETWORK ERROR", error.request);
            APP.show_error("Server is unavailable", "Network Error")
          } else {
            // Error occured while setting up the request
            console.log('API ERROR', error.message);
            Alert.alert("Error: ", error.toString())
          }
          // Alert.alert("Login error: ", error.toString())
          // const message = JSON.parse(JSON.parse(error.response.data._server_messages)[0]).message
          // APP.show_error(message)  

          // if (error.code === "ECONNABORTED") {
          //   console.log("Request timed out");
          // } else {
          //   console.log(error.message);
          // }
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
          if(data instanceof Object){
            return await { status_code: res.status, data: data[data_property] }; 
          }
          return await { status_code: res.status, data: res[data_property] };
        }
      } else if (res?.status == 404) {
          return { status_code: res.status, text: res.statusText };
      }
    };  
}

// class FetchHandler {
    
// /**
//  *  Make request
//  * @param url URL to make request to
//  * @param method either GET/PUT/DELETE/POST
//  * @param body JSON object
//  * @param data_property Property of the response that contains data from server
//  * @returns
//  */
// static async do_request(
//     url: string,
//     method = 'POST',
//     body: object = {},
//     headers: object = {},
//     data_property = 'data'
//   ){
//     try {
//       const payload = {
//         method,
//         headers: headers,
//       };
//       if (method != 'GET' && body) {
//         payload['body'] = JSON.stringify(body);
//       }
//       const res = await fetch(url, payload)/*.catch((error) => { 
//       });*/
//       if (!res.ok) {
//         const message = `An error has occured: ${res.status}`;
//         throw new Error(message);
//       }
//       return await this.handle_response(res, data_property);
//     } catch (error) { 
//       console.log(error);
//     }
//   };
  
//   /**
//    * Handle response
//    * @param res Response object
//    * @param data_property Property of the response that contains data from server
//    * @returns
//    */
//   static async handle_response(res: object, data_property: string){
//     if (res?.status == 200) {
//       const data = await res.json();
//       return await { status_code: res.status, data: data[data_property] };
//     } else if (res?.status == 404) {
//       return { status_code: res.status, text: res.statusText };
//     }
//   };  
// }
export { AxiosHandler /*, FetchHandler*/ }