<!--See https://codepen.io/metalsadman/pen/OJyoYPB for validation badges and more important example-->

<template>  
  <!---When there is more than 1 Tab break-->
  <q-card class="q-pa-sm" v-if="tabs.length > 1">
    <q-tabs 
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator       
    >
      <q-tab v-for="tb in tabs" :name="tb.fieldname" :label="tb.label" :key="tb.fieldname">
        <!-- <q-badge v-if="validators.formHasError" color="red" floating>{{validators.errCount}}</q-badge> -->
      </q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel keep-alive v-for="tb in tabs" :name="tb.fieldname" :key="tb.fieldname">  
        <suspense>
          <keep-alive>
            <component v-for="field in getTabFields(tb.fieldname)" :key="field.name"
              :is="componentMap[field.fieldtype]"
              v-model="formData[field.fieldname]"
              :model-value="formData[field.fieldname]"
              :fieldname="formData[field.fieldname]"
              :name="formData[field.fieldname]"
              :v-show="setVisibility(field)" 
              :readonly="setReadonly(field)"
              v-bind="field"
              :label="field.label"
              v-bind:options="field.options"
              :class="setClass(field)" 
              :rules="setRequired(field)"
              v-bind:rules3="[ val => val && val.length > 0 || 'Please type something']"
              :columns="field.fieldtype=='Table' ? [] : field.columns"
              :parenttype="setParentProp(field, 'parenttype')"
              :parentfield="setParentProp(field, 'parentfield')"
              :parent="setParentProp(field, 'parent')"
              :ischildtable="field.fieldtype=='Table' ? true : false"
              :parentdoc="field.fieldtype=='Table' ? formData : false"
              @change="onChangeValue"
              v-bind:doctype="field.fieldtype=='Table' ? field.options: null"
              :ref="(el) => fieldRefs[field.fieldname] = el"
            >
            </component>
          </keep-alive>
        </suspense>
            <!-- <component 
              v-for="field in getTabFields(tb.fieldname)" :key="field.name"
              :is="componentMap[field.fieldtype]"
              :v-model="formData[field.fieldname]"
              :model-value="formData[field.fieldname]"
              :fieldname="formData[field.fieldname]"
              v-show="!field.hidden"
              :readonly="setReadonly(field)"
              v-bind2="field"
              :label="field.label"
              v-bind:options="field.options"
              :class="setClass(field)" 
              :rules="setRequired(field)"
              v-bind:rules3="[ val => val && val.length > 0 || 'Please type something']"
            >
            </component> -->
          <!-- </keep-alive> -->
      <!-- </q-card> -->
          </q-tab-panel>
    </q-tab-panels>
  </q-card>

  <!--- Else when there is 0 or 1 tab break-->
  <q-card v-else class="q-gutter-sm q-pa-sm">
    <suspense>
      <!-- <div v-if="selectedField"> -->
        <keep-alive>
          <component v-for="field in formFields" :key="field.name"
            :is="componentMap[field.fieldtype]"
            v-model="formData[field.fieldname]"
            :model-value="formData[field.fieldname]"
            :fieldname="formData[field.fieldname]"
            :name="formData[field.fieldname]"
            v-show="setVisibility(field)" 
            :readonly="setReadonly(field)"
            v-bind="field"
            :label="field.label"
            v-bind:options="field.options"
            :class="setClass(field)"
            :rules="setRequired(field)"
            v-bind:rules3="[ val => val && val.length > 0 || 'Please type something']"
            :columns="field.fieldtype=='Table' ? [] : field.columns"
            :parenttype="setParentProp(field, 'parenttype')"
            :parentfield="setParentProp(field, 'parentfield')"
            :parent="setParentProp(field, 'parent')"
            :ischildtable="field.fieldtype=='Table' ? true : false"
            :parentdoc="field.fieldtype=='Table' ? formData : false"
            @change="onChangeValue"    
            v-bind:doctype="field.fieldtype=='Table' ? field.options: null"
            :ref="(el) => fieldRefs[field.fieldname] = el"
            @click2.stop="selectedField = field.df"
            @updatevalue="onUpdateValue"
             @input="onChangeValue"     
            @focus2="onFocus"
          >          
          </component>
        </keep-alive>
        <!-- <keep-alive>
          <component v-for="field in formFields" :key="field.name"
            :is="componentMap[field.fieldtype]"
            v-model="formData[field.fieldname]"
            :model-value="formData[field.fieldname]"
            :fieldname2="formData[field.fieldname]"
            :fieldname="field.fieldname"
            v-show="setVisibility(field)" 
            @click2.stop="selectedField = field.df"
            :readonly="setReadonly(field)"
            v-bind="field"
            :label="field.label"
            v-bind:options="field.options"
            :class="setClass(field)"
            :rules="setRequired(field)"
            v-bind:rules3="[ val => val && val.length > 0 || 'Please type something']"
            @updatevalue="onUpdateValue"
            @change="onChangeValue"    
            @input="onChangeValue"     
            @focus2="onFocus"
            :columns="field.fieldtype=='Table' ? [] : field.columns"
            :parenttype="setParentProp(field, 'parenttype')"
            :parentfield="setParentProp(field, 'parentfield')"
            :parent="setParentProp(field, 'parent')"
            :ischildtable="field.fieldtype=='Table' ? true : false"
            :parentdoc="field.fieldtype=='Table' ? formData : false"
            v-bind:doctype="field.fieldtype=='Table' ? field.options: null"
          >
          </component> 
        </keep-alive> -->
      <!-- </div> -->
    </suspense>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useComponentMap } from '../../../composables/ComponentMap' 
import { useI18n } from 'vue-i18n'
import { AppUtil } from 'src/utils/app'
import { DocTypeService } from 'src/services/DocTypeService'
import { computed } from 'vue'
import { useEngagementStore } from 'src/stores/engagement-store'
import { onMounted } from 'vue'

export default defineComponent({
  name: 'FrappeUIGenerator',
  props: ['doctype', 'docname', 'doc'],
  async setup(props) {
    const { componentMap } = useComponentMap()
    const selectedField = ref(null)
    const selectedValue = ref(null)
    const initialFormLoad = ref(true)
    const fieldRefs = ref({})
    const t = (text) => AppUtil.translate(text)
    const doctype_def = ref({
      fields: []
    })
    const formData = ref({})
    const nonFormFields = ['Tab Break',
                           'Section Break',
                           'Column Break'
                          ]
    const db = new DocTypeService(props.doctype) 
    const engagementStore = useEngagementStore()

    const loadDocTypeDef = async () => { 
      doctype_def.value = await db.get_doctype() 
    }
    onMounted(async () => {
       await loadDocTypeDef()
    })
 
    console.log("Getting doctype FrappeUI")
    //doctype_def.value = await db.get_doctype()
    console.log("Retrieved doctype FrappeUI")
    if(props.doc && props.doc !== undefined){
      formData.value = props.doc
    } else {
      if (props.docname && props.docname !== undefined && props.docname !== 'new'){
        formData.value = await db.get_doc(props.docname)        
      } else {
        formData.value = await db.new_doc(null)
      }
    }
    const setClass = (field: object) => {
      let cssClasses = ''
      if(field.bold){
        cssClasses = `${cssClasses} text-bold`
      }
      return cssClasses
    }

    const isNumericField = (field) => {
      const numerics = ['Int', 'Currency', 'Float']
      for(var i=0; i<numerics.length; i++){
        if(field.fieldtype == numerics[i]){
          return true
        }
      }
      return false
    }

    const setRequired = (field: object) => {
      let rules = []
      if(field.reqd){
        if(isNumericField(field)){
          rules = [val => val !== null && val !== '' || t('VALIDATION.REQUIRED')]
        }
        else{
          rules = [val => val && val.length > 0 || t('VALIDATION.REQUIRED')]
        }
      }
    }

    const setParentProp = (field: object, propName: string) => {
      if(field.fieldtype == 'Table'){ 
        if(propName == 'parenttype'){
          return field.parent
        }
        if(propName == 'parentfield'){ 
          return field.fieldname
        } 
        if(propName == 'parent'){
          return props.docname // field.parent
        } 
      }
      return null
    } 

    const setVisibility = (field: object) => {
      if(field.hidden){
        return false
      }
      //check if visibility is based on another field
      if(field.depends_on){
        //eval:doc.update_type=='Percentage Progress' || doc.update_type=='Multiple Fields At Once'
        // let res = eval(field.depends_on.replace(/eval:/g, "").replace(/doc./g, "formData.value."))
        let res = evaluateDependsOn(field.depends_on, selectedValue.value)
        return res
      } 
      return true
    }

    const setReadonly = (field: object) => {
      return field.read_only ? true : false; 
    }

    const formFields = computed(()=>{
      return doctype_def.value.fields.filter((df) => {
        console.log("Selected Field: ", selectedField.value)
        if(nonFormFields.includes(df.fieldtype)){
          return false
        }
        if(df.depends_on
          && !evaluateDependsOn(df.depends_on, selectedValue.value)){
          return false
        }
        if(df.mandatory_depends_on){
          let res = evaluateDependsOn(df.mandatory_depends_on, selectedValue.value)
          df.reqd = res
        } 
        return !nonFormFields.includes(df.fieldtype)
      })
    })
    
    /**
     * Return form values
     */
    const getValues = () => {
      //get values for child tables
      childTables.value.forEach((el: object) => {
        debugger
        formData.value[el.fieldname] = fieldRefs.value[el.fieldname]?.getRows()
      })
      return formData.value
    }

    const tabs = computed(() => {
      let tabs = doctype_def.value.fields.filter((itm)=>itm.fieldtype == 'Tab Break')
      if(doctype_def.value.fields.length > 0){
        //check if the first field is a Tab Break, if not, insert a new Tab Break
        if(doctype_def.value.fields[0].fieldtype != 'Tab Break'){
          tabs.splice(0, 0, {
            'fieldtype': 'Tab Break',
            'fieldname': 'DEFAULT_TAB',
            'label': t('FORM_VIEW_PAGE.DETAILS_TAB_TITLE')
          })
        }
      }
      return tabs
    }) 

    const childTables = computed(() => {
      let grids = doctype_def.value.fields.filter((itm)=>itm.fieldtype == 'Table')  
      return grids
    })

    const tbname = tabs.value.length > 0 ? tabs.value[0].fieldname : ''
    const tab = ref(tbname) // ref('basic_details_tab')
    
    const onUpdateValue = (field: string, value: object) => {
      debugger
      console.log("On Update value: ", value)
      formData.value[field] = value
    }

    const onChangeValue = (value) => { 
      console.log("On Change:", selectedField.value)
      selectedValue.value = value
    }

    const evaluateDependsOn = (expression:string, selectedField: object) => {      
      //check if visibility is based on another field
      if(expression){
        let tmp = expression
        if(tmp.indexOf('doc.') === -1){
          //If we have an expression without doc. prefix
          tmp = 'formData.value.' + tmp
        }
        let exp = tmp.replace(/eval:/g, "").replace(/doc./g, "formData.value.")
        
        let res = eval(exp)
        return res
      } 
      return true
    }

    const onFocus = (evt) => {
      console.log("Focused: ", evt)
      selectedField.value = evt
      // const tmp = doctype_def.value
      // doctype_def.value = tmp 
    } 
    return {  
      t,
      selectedField,
      getValues,
      onFocus,
      componentMap,
      doctype_def,
      formData,
      setClass,
      setReadonly,
      setRequired,
      setVisibility,
      setParentProp,
      formFields,
      onChangeValue,
      onUpdateValue,
      fieldRefs,
      tabs,
      childTables,
      tab, //: tabs.value.length > 0 ? ref(tabs.value[0].fieldname) : ref(null), // ref('DEFAULT_TAB'), 
      validators: ref({}),
      getTabFields: ((tabName: string) => {
        let tabFields = []
        // If we are getting fields when there is no TabBreak specified at the start of the form defition, copy starting from first field
        let start_copy = tabName == 'DEFAULT_TAB' ? true : false
        
        for(var i = 0; i < doctype_def.value.fields.length; i++){
          let element = doctype_def.value.fields[i]
          if(!start_copy){
            start_copy = element.fieldname == tabName //start copy when we finally locate the tab field we are interested in inside the array            
          }
          else {
            if(element.fieldtype == 'Tab Break'){
              break //If we encounter another tabbreak, we exit
            }
            if(start_copy){
              tabFields.push(element)
            }
          }
        }
        return tabFields
      })
    }
  }
})
</script>
