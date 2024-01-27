<template>
  <!-- <div> -->
    <!-- <q-card> -->
      <!-- <q-card-section> -->
        <q-file     
          :model-value2="value"
          :label="t('BASE_CONTROLS.ATTACH_FILE')" 
          :style="style"
          :multiple="multiple"
          :max-files="maxFiles"
          :accept2="acceptedTypes"
          accept=".png, .jpg, .jpeg, .pdf, image/*, .doc, .docx, .xls, .xlsx" 
          @rejected="onRejected"
          max-file-size="1048576"
          bottom-slots
          clearable
          :counter="multiple"
          v-model="files"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
            
            <q-btn @click="upload" label="Upload" v-if="0==1">
              <q-icon name="add" />
            </q-btn>
          </template>
          <template v-slot:hint>
          </template>
        </q-file>

        <file-uploader v-model="show_uploader" />
      <!-- </q-card-section> -->

    <!-- </q-card> -->
    <!-- <q-separator /> -->
    <!-- <q-btn @click="uploads" label="Upload" icon="add" /> -->
  <!-- </div> -->
</template>

<script lang="ts">
//See https://gist.github.com/yoyosan/8dbcbddf70d28d29d32fc5e5e6bd8c1b

import { defineComponent, ref } from 'vue'
import { AppUtil } from 'src/utils/app'; 
import { computed } from 'vue';
import { makeRequest } from 'src/utils/api';
import { APPS } from 'src/enums'
import { defineAsyncComponent } from 'vue';

export default defineComponent({
  name: 'WbAttachFile',
  props: ['label', 'tooltip', 'value', 'multiple', 'imagesOnly', 'fileTypes', "maxFiles", 'hint', 'style'],
  components: {
    FileUploader: defineAsyncComponent(() => import('components/file_upload/FileUploader.vue'))
  },
  setup(props){  
    const files = ref([])
    const uploadField = ref(null)
    const show_uploader = ref(false)
    const getFiles = () => {
      debugger
      const formData = new FormData() 
      formData.append('description', 'this.form.description');
      if(props.multiple){
        if(files.value && files.value.length > 0){
          for(let i=0; i< files.value.length; i++){
            formData.append('files[' + i + ']', files.value[i])
          }
        }
      } else {
        if(files.value){
          //formData.append('files[' + 0 + ']', files.value)
          formData.append('files', files.value)
        }
      }
      for(var pair of formData.entries()) {
        console.log(pair[0]+', '+pair[1]);
      }
      return formData
    }
    const upload = async () => {
      show_uploader.value = true
      return
      /*  
      const formData =  getFiles()// {'name': 'Cow', 'gender': 'Male'} // getFiles()

      var object = {};
      formData.forEach((value, key) => object[key] = value);
      var json = JSON.stringify(object); 
      const res = await makeRequest(
        AppUtil.makeFrappeAppAPIEndpoint('do_upload'),
        'POST',
        formData,
        { 
          "Content-Type": 'multipart/form-data'
        },
        'data'
      )
      return res*/
    }
    return {
      show_uploader,
      vl: ref(null),
      uploadField,
      files,
      t: txt => AppUtil.translate(txt),
      onRejected: (rejectedEntries)=>{ 
        if(rejectedEntries.length > 0){
          switch(rejectedEntries[0].failedPropValidation){
            case 'accept':              
              AppUtil.showError(AppUtil.translate('BASE_CONTROLS.INVALID_FILE_TYPES'))
              break
            case 'max-file-size':
              AppUtil.showError(AppUtil.translate('BASE_CONTROLS.MAX_FILE_SIZE_EXCEEDED'))
              break;
          }
        }
      },
      acceptedTypes: computed(() => { 
        if(props.fileTypes !== undefined){
          return props.fileTypes
        }
        else {
          if(props.imagesOnly){
            return ".jpg, image/*"
          }  
        }
        return ".jpg, .pdf, image/*, .doc, .docx, .xls, .xlsx"
      }),
      getFiles,
      upload 
    }
  }
})
</script>