import { IDBReadParam } from 'src/interfaces';
import { DocTypeService } from './DocTypeService';

class UserService extends DocTypeService {
  constructor() {
    super('User');
  }

  async get_all() {
    const config = {} as IDBReadParam;
    config.doctype = this.doctype;
    config.fields = ['name'];
    return await super.get_list(config);
  }
}

export { UserService };
