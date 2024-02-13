import { statesData } from 'src/data/us-states';
import { adminZero } from 'src/data/admin0_ke';
import { adminOne } from 'src/data/admin1_ke';
import { adminTwo } from 'src/data/admin2_ke';
import { adminThree } from 'src/data/admin3_ke';

class VectorService {
  // constructor() { }

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
}

export { VectorService };
