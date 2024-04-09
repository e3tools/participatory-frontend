import { APP } from "../utils/app";
import { Frappe } from "../backends/frappe";

class VectorService {
  // constructor() { }

  static backend = new Frappe(APP.backendURL)

  /**
   * Returns a complete list of admins with children objects set either as a tree or a flat list
   */
  static async get_admin_tree(as_tree: boolean=true) {
    const res = await this.backend.call_api_endpoint('get_all_admins', {
      as_tree: as_tree 
    });
    return res
  }

  /**
   * Get single admin level object from the backend
   * @param admin_id 
   * @param admin_level 
   */
  static async get_admin(admin_id, admin_level) {
    const res = await this.backend.call_api_endpoint('get_admin', {
      admin_id: admin_id,
      admin_level: admin_level,      
    }); 
    return res
  }
}

export { VectorService };
