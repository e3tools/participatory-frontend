import { Frappe } from './backends/frappe';
import { LocalDB } from './backends/localDB'; 
import * as CONFIG from './config';

const DB = new Frappe(CONFIG.URLS.BACKEND);
const FrappeBackend = new Frappe(CONFIG.URLS.BACKEND);
const ping = DB.ping;
export { DB, ping, LocalDB }
