import { IDBReadParam } from "src/interfaces";
import { Frappe } from "../backend/frappe";
import { AppUtil } from "src/utils/app";
import { DocTypeService } from "./DocTypeService";
import { DOCTYPES } from "../enums";

class EngagementService {
    constructor() { }    
    static backend = new Frappe(AppUtil.backendURL)
    static doctypeService = new DocTypeService(`${DOCTYPES.ENGAGEMENT_ENTRY}`)

    /**
     * Get list of draft engagement entries associated with currently logged in user
    */
    static async getDraftEngagementEntries(engagement_name: string) {
        const cfg = {} as IDBReadParam
        cfg.filters = [
                        ["status", "=", "Draft"], 
                        ["engagement", "=", engagement_name], 
                        ["entered_by", "=", AppUtil.getCurrentUser().name]
                    ]
        const res = await this.doctypeService.get_list(cfg)
        return res
    }

    /**
     * Get a merged record of all doctype entries linked to a specific engagement entry
     * @param engagement_name 
     */
    static async getEngagementEntryRecord(engagement_entry_name: string) {
        return await this.backend.callAPIEndPoint("get_engagement_entry_records", { "engagement_entry_name": engagement_entry_name })
    }

    static async saveEngagementEntry(data: object) {
        return await this.backend.callAPIEndPoint("save_engagement_entry", { "entry": data })
    }

    static async discard_draft_engagement_entry(name: object) {
        return await this.backend.callAPIEndPoint("discard_draft_engagement_entry", { "engagement_entry_name": name })
    }
}

export { EngagementService }
