import { Frappe } from '../backends/frappe';
import { LocalDB } from '../backends/localDB';
import { URLS } from '../constants/enums'; 

const DB = new Frappe(URLS.BACKEND);
const ping = DB.ping;
export { DB, ping, LocalDB }