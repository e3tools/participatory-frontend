import { statesData } from 'src/data/us-states';
import { adminZero } from 'src/data/admin0_ke';
import { adminOne } from 'src/data/admin1_ke';
import { adminTwo } from 'src/data/admin2_ke';
import { adminThree } from 'src/data/admin3_ke';
import { AppUtil } from 'src/utils/app';
import { Frappe } from 'src/backend/frappe';

class VectorService {
  // constructor() { }

  static backend = new Frappe(AppUtil.backendURL)

  static async get_states() {
    return statesData;
  }

  static async get_admin_zero() {
    return adminZero;
  }

  static async get_admin_one() {
    return adminOne;
  }

  static async get_admin_two() {
    return adminTwo;
  }

  static async get_admin_three() {
    return adminThree;
  }

  /**
   * Returns a complete list of admins with children objects set
   */
  static async get_admin_tree(as_tree: boolean=true) {
    const res = await this.backend.call_api_endpoint('get_all_admins', {
      as_tree: as_tree 
    });
    return res
  }

  /**
   * Get admin level object from the backend
   * @param admin_id 
   * @param admin_level 
   */
  static async get_admin(admin_id, admin_level) {
    const res = await this.backend.call_api_endpoint('get_admin', {
      admin_id: admin_id,
      admin_level: admin_level
    });
    return res
  }
}

export { VectorService };
