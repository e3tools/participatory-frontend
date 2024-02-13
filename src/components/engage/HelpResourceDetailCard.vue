<template>
  <q-card class="no-shadow" bordered>
    <q-card-section class="text-center bg-transparent">
       <img v-if="doc.image" :src="makeURL(doc.image)">
       <q-avatar v-else size="100px" class="shadow-10">
        <img src="profile.svg"> 
      </q-avatar>
      <div class="text-subtitle1 q-mt-lg">By {{ doc.author }}</div>
      <div class="text-h6 q-mt-md">{{ doc.title }}</div>
    </q-card-section>
    <q-card-section>  
      <div class="text-body2 text-justify">
        {{ doc.content }}
      </div>
     
    </q-card-section> 
  </q-card>

  <card class="bg-positive">
    <q-card-section class="q-pa-md">      
      <div class="col-12" v-if="doc.upload_file">
        <span class="text-bold">{{ t('HELP_RESOURCE_DETAIL_PAGE.ATTACHED_FILE') }} : </span> 
        <span class="text-muted"> <a :href="makeURL(doc.upload_file)">{{ doc.upload_file }}</a></span>
      </div>
      <div class="col-12" v-if="doc.county">
        <span class="text-bold">{{ t('HELP_RESOURCE_DETAIL_PAGE.RELEVANT_COUNTY') }} : </span>
        <span class="text-muted"> {{ doc.county }} </span>
      </div>
      <div class="col-12" v-if="doc.sector">
        <span class="text-bold">{{ t('HELP_RESOURCE_DETAIL_PAGE.RELEVANT_SECTOR') }} : </span>
        <span class="text-muted"> {{ doc.sector }} </span>
      </div>
      <div class="col-12" v-if="doc.published_on">
        <span class="text-bold">{{ t('HELP_RESOURCE_DETAIL_PAGE.PUBLICATION_DATE') }} : </span>
        <span class="text-muted"> {{ doc.published_on }} </span>
      </div>      
    </q-card-section>
  </card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { DocTypeService } from '../../services/DocTypeService'
import { AppUtil } from '../../utils/app'  

export default defineComponent({
   name: 'HelpResourceDetailCard',
   props: ['docname'],
   setup(props) {
    const doc = ref({})
    new DocTypeService('Help Resource').get_doc(props.docname).then((rec) => {
      doc.value = rec
    })
    return {
      t: (text) => AppUtil.translate(text),
      makeURL: (url) => AppUtil.make_backend_url(url),
      doc,
      // encode: (text) => {
      //   return $(text).encode(text).text()
      // }
    }
   }
})
</script>
