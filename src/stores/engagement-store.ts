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

  const makeTempEngagementEntry = async () => {
    const svc = new DocTypeService(`${DOCTYPES.ENGAGEMENT_ENTRY}`)
    const curr_engagement = getCurrentEngagement()

    const new_doc = await svc.new_doc({})
    new_doc.engagement = curr_engagement.name
    new_doc.engagement_name = curr_engagement.engagement_name
    new_doc.entered_by = AppUtil.getCurrentUser().name
    new_doc.entered_on = new Date()
    new_doc.status = "Draft"

    engagementStore.value.TempEngagementEntry = new_doc
    return new_doc
  }
  /**
   * Set the current engagement after it has been selected from the main menu
   * @param engagement 
   */
  const setCurrentEngagement = (engagement: string) => { 
    engagementStore.value.CurrentEngagement = engagement
  }

  /**
   * Retrieve last selected engagement
   * @returns 
   */
  const getCurrentEngagement = () => { 
    return engagementStore.value.CurrentEngagement
  }

  /**
   * Save survey data
   * @param engagement 
   * @param doctype 
   * @param data 
   */
  const setSurveyFormData = (engagement: string, doctype: string, data:object, ) => {
    _setFormValue(engagement, SURVEY, doctype, data)
  }

  /**
   * Retrieve survey data
   * @param engagement 
   * @param doctype 
   * @returns 
   */
  const getSurveyFormData = (engagement: string, doctype: string) => {
    return _getFormValue(engagement, SURVEY, doctype)
  }

  /**
   * set Doctype values
   * @param engagement 
   * @param engagement_type 
   * @param doctype 
   * @param data 
   */
  const _setFormValue = (engagement: string, engagement_type: string, doctype: string, data:object, ) => {
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
  const _getFormValue = (engagement: string, engagement_type: string, doctype: string) => {
    return engagementStore.value[engagement_type][engagement][doctype]
  }

  /**
   * Get all data entered against a particular engagement
   * @param engagement 
   * @returns 
   */
  const getSurveyEngagementEntryData = (engagement: string) => {
    return _getValueByEngagementType(engagement, SURVEY)
  }

  /**
   * Set data that has been captured for a particular engagement
   * @param engagement 
   * @param data 
   * @returns 
   */
  const setSurveyEngagementEntryData = (engagement: string, data: object) => {
    return _setValueByEngagementType(engagement, SURVEY, data)
  }

  /**
   * Filter captured data by engagement_type
   * @param engagement 
   * @param engagement_type 
   * @returns 
   */
  const _getValueByEngagementType = (engagement: string, engagement_type: string ) => {
    return engagementStore.value[engagement_type][engagement]
  }
  
  /**
   * Set engagement data by engagement type
   * @param engagement 
   * @param engagement_type 
   * @param data 
   * @returns 
   */
  const _setValueByEngagementType = (engagement: string, engagement_type: string, data: object ) => {
    return engagementStore.value[engagement_type][engagement] = data
  }

  return { 
    getSurveyFormData,
    setSurveyFormData,
    getSurveyEngagementEntryData,
    setSurveyEngagementEntryData,
    getCurrentEngagement,
    setCurrentEngagement,
    makeTempEngagementEntry
  }
}, 
{persist: true} 
  // {
  //   persist: {
  //     storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
  //   }
  // }
) 