import { statesData } from 'src/data/us-states';
import { adminZero } from 'src/data/admin0_ke';
import { adminOne } from 'src/data/admin1_ke';
import { adminTwo } from 'src/data/admin2_ke';
import { adminThree } from 'src/data/admin3_ke';

class VectorService {
  // constructor() { }

  static async getStates() {
    return statesData;
  }

  static async getAdminZero() {
    return adminZero;
  }

  static async getAdminOne() {
    return adminOne;
  }

  static async getAdminTwo() {
    return adminTwo;
  }

  static async getAdminThree() {
    return adminThree;
  }
}

export { VectorService };
