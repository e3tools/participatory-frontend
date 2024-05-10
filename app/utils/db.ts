import { Frappe } from '../backends/frappe';
import { URLS } from '../constants/enums'; 

/**
 * Middleware for backend DB connections.
 * If another backend needs to be plugged, create a class similar to Frappe and extend the `DB` 
 * class to inherit from that backend
 * @param url 
 */
// export class DB extends Frappe {
//     constructor(url: string = URLS.BACKEND) {
//         debugger
//         super(url);
//     }
// };

console.log("Frappe:", Frappe); 
const DB = new Frappe(URLS.BACKEND);

const ping = async () => {
    const res = await DB.call_api_endpoint("ping", {}, "POST", false, false, 30000); 
}
export { DB, ping }