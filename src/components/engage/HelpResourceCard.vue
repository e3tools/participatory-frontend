<template>
  <q-card class="no-shadow q-pa-sm bg-grey-4"  bordered> 
    <q-img :src="getImageURL(doc.image)" height="220px" align="center">
      <q-chip v-if="doc.chip" 
      :class="doc.chip_class" 
      :color="doc.chip_color || 'accent'" 
      :label="doc.chip"
      icon="event"
      ></q-chip>
    </q-img>

    <q-card-section>
      <q-btn
        fab
        color="teal-7"
        icon="fas fa-download"
        padding="sm"
        class="absolute"
        style="top: 0; right: 12px; transform: translateY(-50%);"
      />
    </q-card-section>

    <q-card-section>
      <div class="text-h6 text-justify">
        {{ doc.title }}
      </div>
      <div class="text-subtitle1 text-justify q-mt-sm">
        {{ getCaption(doc.caption) }}
      </div>
      <div class="text-muted"> 
        <!-- <q-rating
        v-model="doc.rating"
          max="5"
          size="1.5em"
          color="yellow"
          icon="star_border"
          icon-selected="start"
          icon-half="star-half"
          readonly
          no-dimming
        /> -->
      </div>
    </q-card-section>

    <q-card-section>
      <div class="col-12">
        <span class="text-muted">{{ doc.published_on }}</span>
        <span class="text-h6 float-right">
          <q-btn 
            :label="t('BUTTON.SEE_DETAILS')"
            rounded
            color="secondary"
            outline  
            :to="`/resources/${doc.name}`"
          ></q-btn> 
        </span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { log } from 'console';
import { AppUtil } from '../../utils/app'  

export default defineComponent({
  name: 'HelpResourceCard',
  props: ['doc'],
  setup(props) {
   console.log('data:', props.doc)
    const getImageURL = (url: string) => { 
      return AppUtil.make_backend_url(url)
      // let imageUrl = new URL(`../../assets/images/${url}`, import.meta.url).href
      // if(!url){
      //   imageUrl = new URL(`../../assets/images/document.png`, import.meta.url).href
      // }
      // //url = new URL(`../../assets/images/document.png`, import.meta.url).href
      // return imageUrl
    }
    return {
      t: (text) => AppUtil.translate(text),
      getCaption: (text) => {
        return text.length > 100 ? text.substring(0, 100) + '...' : text
      },
      getImageURL
    }
  }
})
</script>
