import { defineStore } from 'pinia';
import { ref } from 'vue'
import { DocTypeService } from '../services/DocTypeService'
import { AppUtil } from 'src/utils/app'; 
import { DOCTYPES } from 'src/enums'


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

export const useEngagementStore = defineStore('engagement', () => {
  const SURVEY = 'Survey',
        SUBMISSION = 'Submission',
        GUESTBOOK = 'Guestbook',
        STORIES = 'Stories',
        QA = 'QA',
        QUICK_POLL = 'Quick Poll',
        IDEAS = 'Ideas',
        DISCUSSION_FORUM='Discussion Forum',
        MAP = 'Map'

  const engagementStore = ref<Engagement>({  
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
  })

  const make_temp_ngagement_entry = async () => {
    const svc = new DocTypeService(`${DOCTYPES.ENGAGEMENT_ENTRY}`)
    const curr_engagement = get_current_engagement()

    const new_doc = await svc.new_doc({})
    new_doc.engagement = curr_engagement.name
    new_doc.engagement_name = curr_engagement.engagement_name
    new_doc.entered_by = AppUtil.get_current_user().name
    new_doc.entered_on = new Date()
    new_doc.status = "Draft"

    engagementStore.value.TempEngagementEntry = new_doc
    return new_doc
  }
  /**
   * Set the current engagement after it has been selected from the main menu
   * @param engagement 
   */
  const set_current_engagement = (engagement: string) => { 
    engagementStore.value.CurrentEngagement = engagement
  }

  /**
   * Retrieve last selected engagement
   * @returns 
   */
  const get_current_engagement = () => { 
    return engagementStore.value.CurrentEngagement
  }

  /**
   * Save survey data
   * @param engagement 
   * @param doctype 
   * @param data 
   */
  const set_survey_form_data = (engagement: string, doctype: string, data:object, ) => {
    _set_form_value(engagement, SURVEY, doctype, data)
  }

  /**
   * Retrieve survey data
   * @param engagement 
   * @param doctype 
   * @returns 
   */
  const get_survey_form_data = (engagement: string, doctype: string) => {
    return _get_form_value(engagement, SURVEY, doctype)
  }

  /**
   * set Doctype values
   * @param engagement 
   * @param engagement_type 
   * @param doctype 
   * @param data 
   */
  const _set_form_value = (engagement: string, engagement_type: string, doctype: string, data:object, ) => {
    if(!(engagement_type in engagementStore.value)){ 
      engagementStore.value[engagement_type] = {}
    }
    if(!(engagement in engagementStore.value[engagement_type])){
      engagementStore.value[engagement_type][engagement] = {}
    }
    if(!(doctype in engagementStore.value[engagement_type][engagement])){
      engagementStore.value[engagement_type][engagement][doctype] = {}
    }
    engagementStore.value[engagement_type][engagement][doctype] = data
  }

  /**
   * Get Form values from store
   */
  const _get_form_value = (engagement: string, engagement_type: string, doctype: string) => {
    return engagementStore.value[engagement_type][engagement][doctype]
  }

  /**
   * Get all data entered against a particular engagement
   * @param engagement 
   * @returns 
   */
  const get_survey_engagement_entry_data = (engagement: string) => {
    return _get_value_by_engagement_type(engagement, SURVEY)
  }

  /**
   * Set data that has been captured for a particular engagement
   * @param engagement 
   * @param data 
   * @returns 
   */
  const set_survey_engagement_entry_data = (engagement: string, data: object) => {
    return _set_Value_by_engagement_type(engagement, SURVEY, data)
  }

  /**
   * Filter captured data by engagement_type
   * @param engagement 
   * @param engagement_type 
   * @returns 
   */
  const _get_value_by_engagement_type = (engagement: string, engagement_type: string ) => {
    return engagementStore.value[engagement_type][engagement]
  }
  
  /**
   * Set engagement data by engagement type
   * @param engagement 
   * @param engagement_type 
   * @param data 
   * @returns 
   */
  const _set_Value_by_engagement_type = (engagement: string, engagement_type: string, data: object ) => {
    return engagementStore.value[engagement_type][engagement] = data
  }

  return { 
    get_survey_form_data,
    set_survey_form_data,
    get_survey_engagement_entry_data,
    set_survey_engagement_entry_data,
    get_current_engagement,
    set_current_engagement,
    make_temp_ngagement_entry
  }
}, 
{persist: true} 
  // {
  //   persist: {
  //     storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
  //   }
  // }
) 