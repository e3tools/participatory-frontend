import { APP } from "../utils/app";
import { Frappe } from "../backends/frappe";
import { LocalDB } from "../backends/localDB";

const ADMIN_TREE_LOCALDB_KEY = 'admin_tree'
class VectorService {
  // constructor() { }

  static backend = new Frappe(APP.backendURL)

  /**
   * Initialize data to load onto LocalDB
   */
  static async _initialize_localDB() {
    let res = await this.get_admin_tree();
    await LocalDB.insert_many(ADMIN_TREE_LOCALDB_KEY, res);
  }
  /**
   * Returns a complete list of admins with children objects set either as a tree or a flat list
   */
  static async get_admin_tree(as_tree: boolean=true) {
    if(await this.backend.is_online()){
      const res = await this.backend.call_api_endpoint('get_all_admins', {
        as_tree: as_tree 
      });
      return res
    } else {
      return await LocalDB.get_all(ADMIN_TREE_LOCALDB_KEY)
    }
  }

  /**
   * Get single admin level object from the backend
   * @param admin_id 
   * @param admin_level 
   */
  static async get_admin(admin_id, admin_level) {
    if(await this.backend.is_online()){
      const res = await this.backend.call_api_endpoint('get_admin', {
        admin_id: admin_id,
        admin_level: admin_level,      
      }); 
      return res
    } else {
      let filters = [['admin_id', '=', admin_id], ['admin_level', '=', admin_level]]
      const docs = await LocalDB.get_list(ADMIN_TREE_LOCALDB_KEY, filters);
      return docs ? docs[0] : null;
    }
  }
}

export { VectorService };
