import { IDBReadParam } from 'data-layer/interfaces/database';
import { Frappe } from 'data-layer/backends/frappe';
import { APP } from 'common';
import { DocTypeService } from 'data-layer/services/doctype';
import { DOCTYPES } from '../constants/enums';
import { AuthService } from 'auth/services/auth';

class EngagementService {
  static backend = new Frappe(APP.backendURL);
  static doctypeService = new DocTypeService(`${DOCTYPES.ENGAGEMENT_ENTRY}`);

  /**
   * Get list of draft engagement entries associated with currently logged in user
   */
  static async getDraftEngagementEntries(engagement_name: string) {
    const cfg = {} as IDBReadParam;
    cfg.filters = [
      ['status', '=', 'Draft'],
      ['engagement', '=', engagement_name],
      ['entered_by', '=', AuthService.get_current_user().name],
    ];
    const res = await this.doctypeService.get_list(cfg);
    return res;
  }

  /**
   * Get a merged record of all doctype entries linked to a specific engagement entry
   * @param engagement_name
   */
  static async get_engagement_entry_record(engagement_entry_name: string) {
    return await this.backend.callApiEndpoint('get_engagement_entry_records', {
      engagement_entry_name: engagement_entry_name,
    });
  }

  static async save_engagement_entry(data: object) {
    return await this.backend.callApiEndpoint('save_engagement_entry', {
      entry: data,
    });
  }

  static async discard_draft_engagement_entry(name: object) {
    return await this.backend.callApiEndpoint(
      'discard_draft_engagement_entry',
      { engagement_entry_name: name },
    );
  }
}

export { EngagementService };
