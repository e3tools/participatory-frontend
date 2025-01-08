import { IDBReadParam } from 'data-layer/interfaces/database';
import { DocTypeService } from 'data-layer/services/doctype';
import { APP } from 'common';
import { Frappe } from 'data-layer/backends/frappe';
import { LocalDB } from 'data-layer/backends/local-db';

class EngagementFormService {
  static doctype = 'Engagement Form';
  static doctypeService = new DocTypeService(this.doctype);
  static backend = new Frappe(APP.backendURL);
  /**
   * Get list of engagement forms
   */
  static async get_engagement_forms() {
    const cfg = {} as IDBReadParam;
    cfg.fields = ['*'];
    cfg.filters = [
      ['is_published', '=', 1],
      ['docstatus', '!=', 2],
    ];
    if (await this.backend.is_online()) {
      return await this.doctypeService.get_list(cfg);
    } else {
      return await LocalDB.get_list(this.doctype, cfg.filters);
    }
  }

  static async get_engagement_form(engagement_form: string) {
    if (await this.backend.is_online()) {
      return await this.doctypeService.get_doc(engagement_form);
    } else {
      return await LocalDB.get_doc(this.doctype, engagement_form);
    }
  }
}

export { EngagementFormService };
