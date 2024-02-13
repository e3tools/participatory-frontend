<template>
  <q-form class="q-gutter-sm" @submit.prevent="save" ref="formContainer">
    <!-- <form id="form" @submit.prevent="save" ref="formContainer"> -->
      <Suspense>
        <ui-generator 
          :doctype="doctype" 
          :docname="docname !== undefined && docname !== 'new' ? docname : null" 
          :doc="doc"
          ref="myForm" />    
      </Suspense>
      <div v-if="showSubmitButton" class="text-center">
        <q-btn :label="t('BUTTON.SAVE')" icon="save" type="submit" color="primary"/>
        <!-- <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" /> -->
      </div>
    <!-- </form> -->
  </q-form> 
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, ref } from 'vue' 
import { DocTypeService } from 'src/services/DocTypeService'; 
import { useQuasar } from 'quasar';
import { onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { AppUtil } from 'src/utils/app';

export default defineComponent({
  name: 'DocForm',
  components: {
    //'wb-data': defineAsyncComponent(()=> import('../../base/controls/Data.vue')),
    'ui-generator': defineAsyncComponent(() => import('../../ui/UIGenerator.vue'))
  },
  props: ['doctype', 'docname', 'doc', 'showSubmitButton'],
  async setup(props) {
    const myForm = ref(null)  
    const formContainer = ref(null)
    const formValues = ref({}) 
    const $q = useQuasar()
    const router = useRouter() 

    onBeforeUnmount(()=> {
      $q.loading.hide()
    })
  
    const db = new DocTypeService(props.doctype)
    // // get data from db
    // if(props.docname){
    //     const obj = await db.get_doc(props.docname)
    //     formValues.value = obj
    // } else {
    //    const obj =  await db.new_doc({})
    //    formValues.value = obj
    // }

    const getValues = async () => { 
      //var form = document.getElementById('form');
      // var formData = new FormData(formContainer.value); 
      return await myForm.value.getValues()
    }

    const getDocType = () => {
      return props.doctype
    }

    const validate_OLD = async () => {  
      const res = await formContainer.value.validate(false)
      if(!res){
        console.log("Form has errors")
      }
      return res
    }

    const validate = async () => {  
      const [res, fields] = await myForm.value.validateForm()
      if(!res){ 
        AppUtil.notify_error(AppUtil.translate('VALIDATION.VALIDATION_ERRORS'))
      } 
      return res 
    }

    const save = async () => {
      const valid = await validate()
      if(valid){
        const values = await getValues()// myForm.value.getValues()
        values.name = props.docname === undefined || props.docname == 'new' ? null : props.docname

        const first = $q.loading.show({
          // group: 'first',
          // message: 'Saving...',
          // spinnerColor: 'white',
          // messageColor: 'amber'
        })  
        const res = await db.upsert_doc(values)
        if (res){
          $q.loading.hide()
          router.go(0)
        } else {
          $q.loading.hide()
        }
        // if(props.docname){
        //   return await db.update_doc(values, formValues.value.name) 
        // } else { 
        //   return await db.create_doc(values)
        // }
      }
      return false
    }
    const onSubmit = (evt)=> {
      console.log('About to submit')
      evt.target.submit()       
    }
    
    return {
      t: (text) => AppUtil.translate(text),
      myForm,
      formContainer,
      //formValues, 
      validate,
      save,
      onSubmit,
      getValues,
      getDocType
    }
  }
})
</script>
