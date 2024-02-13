<template>
  <!--See https://codepen.io/hoangdng-the-sans/pen/YzLKXaG-->
  <q-page class="q-pa-sm">
    <!-- content -->
    <q-stepper v-if="!loading"
      v-model="step"
      ref="stepperRef"
      color="primary" 
      header-nav
      animated
      keep-alive
      vertical
      done-color2="deep-orange"
      active-color="accent"
      inactive-color="secondary"
    >
      <q-step 
          v-for="form in engagementTemplate.items" :key="form.name"
          :name="form.idx"
          :title="form.display_name"
          icon="settings"
          :prefix="form.idx"
          :done="step > 1"  
      > 
        <div class="text-caption q-pa-sm">{{ form.introduction }} </div>
        <suspense>
          <template #default>
            <doc-form 
              :doctype="form.doctype_item"      
              :docname="docs[form.doctype_item] ? docs[form.doctype_item].name : null"             
              :doc="docs[form.doctype_item] ? docs[form.doctype_item] : null"
              :show-submit-button="false" 
              :ref2="`(el) => (formRefs[form.doctype_item] = el)`" 
              :ref="(el) => (formRefs['form'+form.idx] = el)" 
            >
            </doc-form>            
          </template>

          <template #fallback>
            <q-spinner-orbit
              color="primary"
              size="2em"
            />
          </template>
        </suspense>

        <q-stepper-navigation>
          <q-btn
            no-caps
            @click="onContinueStep" 
            color="primary"
            :label="step === engagementTemplate.items.length ? t('BUTTON.FINISH') : t('BUTTON.CONTINUE')"
          />
          <q-btn
            v-if="step > 1"
            flat
            no-caps
            color="primary"
            @click="onBackStep"
            :label="t('BUTTON.BACK')"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <!-- <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            no-caps
            @click="onContinueStep" 
            color="primary"
            :label="step === engagementTemplate.items.length ? t('BUTTON.FINISH') : t('BUTTON.CONTINUE')"
          />
          <q-btn
            v-if="step > 1"
            flat
            no-caps
            color="primary"
            @click="onBackStep"
            :label="t('BUTTON.BACK')"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template> -->
    </q-stepper>
  </q-page>
</template>

<script lang="ts"> 
import { useQuasar } from 'quasar'
import { DocTypeService } from 'src/services/DocTypeService'
import { EngagementService } from 'src/services/EngagementService' 
import { AppUtil } from 'src/utils/app'
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import { useEngagementStore } from 'src/stores/engagement-store'
import { onBeforeMount } from 'vue' 
import { onMounted } from 'vue'
import { DOCTYPES } from 'src/enums'


export default defineComponent({
  name: 'MultiStepFormViewPage',
  props: ['engagement', 'entry'],
  components: {
    'doc-form': defineAsyncComponent(() => import('components/base/views/DocFormView.vue'))
  },
  setup(props) {
    const engagementStore = useEngagementStore()
    //const db = DocTypeService
    const $q = useQuasar()
    const stepperRef = ref(null)
    const step = ref(1)
    const formRefs = ref({})
    //const formData = ref({})
    const docs = ref([])
    const engagement = ref(null)
    const engagementTemplate = ref({ items: [] }) 
    const loading = ref(true)
    const t = (text) => AppUtil.translate(text)
 
    onBeforeMount(() => {
      $q.loading.hide()
    })

    const onContinueStep = async () => {
      //AppUtil.route_to_path(`/list/${DOCTYPES.ENGAGEMENT_ENTRY}`)       
      const key = `form${step.value}`   
      const form = formRefs.value[key]
      const valid = await form.validate()
      if(valid){
        const vals = await form.getValues()
        const doctype = await form.getDocType()
        engagementStore.set_survey_form_data(engagement.value.name, doctype, vals) 
        if(step.value == engagementTemplate.value.items.length){
          //is the last step. submit data  
          const vals = engagementStore.get_survey_engagement_entry_data(engagement.value.name)
          const drafts = await EngagementService.get_draft_engagement_entries(engagement.value.name)
          if(drafts && drafts.length > 0){
            vals[`${DOCTYPES.ENGAGEMENT_ENTRY}`] = drafts[0]
          }
          $q.loading.show({})
          vals['Engagement'] = engagement.value
          const res = await EngagementService.save_engagement_entry(vals)
          $q.loading.hide()
          if(res){
            AppUtil.notify(t('FORM_VIEW_PAGE.SAVE_SUCCESS_MESSAGE'), false, 'bottom');
            AppUtil.route_to_path(`/list/${DOCTYPES.ENGAGEMENT_ENTRY}`, {}, { 'engagement': engagement.value.name })
          }
          else {
            AppUtil.show_error(t('FORM_VIEW_PAGE.SAVE_ERROR_MESSAGE'));
          }
        }
        else { 
          // continue with next step
          stepperRef.value.next()
        } 
      } else {
        AppUtil.show_error(t('VALIDATION.VALIDATION_ERRORS'));
      }
    }

    const onBackStep = () => {
      stepperRef.value.previous()
    }

    const loadEngagementEntryData = async (engagementName, entry) => {
      EngagementService.get_engagement_entry_record(entry).then((data) => {
        docs.value = data
        engagementStore.set_survey_engagement_entry_data(engagementName, data)
        loading.value = false
      })
    }

    const checkDraftRecords = async () => { 
      //check if its not a new selection
      if(props.entry.toLowerCase() != 'new'){
        // load entry data
        await loadEngagementEntryData(engagement.value.name, props.entry)
        return
      }
      // If its a new entry, check if there is another draft
      let records = await EngagementService.get_draft_engagement_entries(engagement.value.name)
      if(records.length > 0){
        AppUtil.confirm("There is a draft record. Do you want to open it?", '', () => {
            //load draft record
            docs.value[`${DOCTYPES.ENGAGEMENT_ENTRY}`] = records[0]
            engagementStore.set_survey_form_data(engagement.value.name, `${DOCTYPES.ENGAGEMENT_ENTRY}`, records[0])
            EngagementService.get_engagement_entry_record(records[0].name).then((data) => {
              docs.value = data
              engagementStore.set_survey_engagement_entry_data(engagement.value.name, data)
              loading.value = false
            })
          }, 
          ()=>{
            //discard draft record
            EngagementService.discard_draft_engagement_entry(records[0].name)
            loading.value = false
          }
        )
      } else { 
        loading.value = false
      }
    }

    new DocTypeService("Engagement").get_doc(props.engagement).then((d) => {
      engagement.value = d
      if(d.has_data_forms){
        // If is structured survey, get the Engagement Template
        new DocTypeService('Engagement Template').get_doc(d.data_forms_template).then((t)=> { 
          engagementTemplate.value = t
        }).then(() => {
          checkDraftRecords()
        })
      } else { 
        checkDraftRecords()
      }
    })
 
    return {
      loading,
      docs,
      formRefs,
      t: (text) => AppUtil.translate(text),
      step,
      stepperRef,
      onContinueStep,
      onBackStep,
      engagementTemplate
    }
  }
})
</script>
