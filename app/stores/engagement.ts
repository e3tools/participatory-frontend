import { set_value, get_value, delete_value} from "../utils/storage";
import { DocTypeService } from "../services/doctype";
import { DOCTYPES } from "../constants/enums";
import { AuthService } from "../modules/auth/services/auth";
// import { useState } from "react";
const KEY = 'engagement';

type Engagement = { 
    Survey: null,
    Submission: null,
    Guestbook: null,
    Stories: null,
    "Q&A": null,
    "Quick Poll": null,
    "Ideas": null,
    "Discussion Forum": null,
    "Map": null
  }

const SURVEY = 'Survey',
    SUBMISSION = 'Submission',
    GUESTBOOK = 'Guestbook',
    STORIES = 'Stories',
    QA = 'QA',
    QUICK_POLL = 'Quick Poll',
    IDEAS = 'Ideas',
    DISCUSSION_FORUM='Discussion Forum',
    MAP = 'Map';

const EngagementStore = class EngagementStore {

    static TempEngagementEntry = null;

    //static _store = {} as Engagement useState<Engagement>({  
    static _store = { 
        TempEngagementEntry: null,
        CurrentEngagement: '',
        Survey: {},
        Submission: {},
        Guestbook: {},
        Stories: {},
        QA: {},
        "Quick Poll": {},
        "Ideas": {},
        "Discussion Forum": {},
        "Map": {}
    };// as Engagement

    static make_temp_engagement_entry = async () => {
        const svc = new DocTypeService(`${DOCTYPES.ENGAGEMENT_ENTRY}`);
        const curr_engagement = this.get_current_engagement();

        console.log("form type: ", `${DOCTYPES.ENGAGEMENT_ENTRY}`)
        const new_doc = await svc.new_doc({});
        new_doc.engagement = curr_engagement.name
        new_doc.engagement_name = curr_engagement.engagement_name
        new_doc.entered_by = AuthService.get_current_user().name
        new_doc.entered_on = new Date()
        new_doc.status = "Draft"

        this.TempEngagementEntry = new_doc
        return new_doc
    }    

    /**
     * Set the current engagement after it has been selected from the main menu
     * @param engagement 
     */
    static set_current_engagement = async (engagement: object) => {
        let obj = {'name': engagement.name, 'engagement_name': engagement.engagement_name, 'has_data_forms': engagement.has_data_forms }; 
        return await set_value(KEY, obj);
    }

    /**
     * Retrieve last selected engagement
     * @returns 
     */
    static get_current_engagement = async () => {
        return await get_value(KEY);
    }
    
     /**
   * Save survey data
   * @param engagement 
   * @param doctype 
   * @param data 
   */
     static set_survey_form_data = (engagement: string, doctype: string, data:object, ) => {
        // console.log("Survey data: ", doctype)
        this._set_form_value(engagement, SURVEY, doctype, data)
    }

    /**
     * Retrieve survey data
     * @param engagement 
     * @param doctype 
     * @returns 
     */
    static get_survey_form_data = (engagement: string, doctype: string) => {
        return this._get_form_value(engagement, SURVEY, doctype)
    }
    /**
     * Delete engagement from local storage
     * @returns 
     */
    static remove_engagement = async () => {
        return await delete_value(KEY);
    }

    /**
   * set Doctype values
   * @param engagement 
   * @param engagement_type 
   * @param doctype 
   * @param data 
   */
    static _set_form_value = (engagement: string, engagement_type: string, doctype: string, data:object, ) => {
        if(!(engagement_type in this._store)){ 
            this._store[engagement_type] = {};
        }
        if(!(engagement in this._store[engagement_type])){
            this._store[engagement_type][engagement] = {};
        }
        if(!(doctype in this._store[engagement_type][engagement])){
            this._store[engagement_type][engagement][doctype] = {};
        }
        this._store[engagement_type][engagement][doctype] = data;
    }

    /**
     * Get Form values from store
     */
    static _get_form_value = (engagement: string, engagement_type: string, doctype: string) => {
        return this._store[engagement_type][engagement][doctype];
    }

    /**
     * Get all data entered against a particular engagement
     * @param engagement 
     * @returns 
     */
    static get_survey_engagement_entry_data = (engagement: string) => {
        return this._get_value_by_engagement_type(engagement, SURVEY);
    }

    /**
     * Set data that has been captured for a particular engagement
     * @param engagement 
     * @param data 
     * @returns 
     */
    static set_survey_engagement_entry_data = (engagement: string, data: object) => {
        return this._set_Value_by_engagement_type(engagement, SURVEY, data);
    }

    /**
     * Filter captured data by engagement_type
     * @param engagement 
     * @param engagement_type 
     * @returns 
     */
    static _get_value_by_engagement_type = (engagement: string, engagement_type: string ) => {
        return this._store[engagement_type][engagement];
    }
    
    /**
     * Set engagement data by engagement type
     * @param engagement 
     * @param engagement_type 
     * @param data 
     * @returns 
     */
    static _set_Value_by_engagement_type = (engagement: string, engagement_type: string, data: object ) => {
        return this._store[engagement_type][engagement] = data;
    }
}

export { EngagementStore }