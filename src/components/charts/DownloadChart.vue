<template>
  <q-btn
    icon="fa fa-download"
    class="float-right"
    @click="saveImage"
    flat
    dense
  > 
  <q-tooltip>{{ t('BUTTON.DOWNLOAD_PNG') }} </q-tooltip>
  </q-btn>
</template>

<script lang="ts">
import { AppUtil } from 'src/utils/app';
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'DownloadChart',
  props: {
    getChartRef: {
      type: Function,
      default: () => ({})
    }
  },
  setup(props){     
    return {
      t: (text: string) => AppUtil.translate(text),
      saveImage: () => {
        const linkSource = props.getChartRef().getDataURL()
        const downloadLink = document.createElement('a')
        document.body.appendChild(downloadLink)
        downloadLink.href = linkSource
        downloadLink.target = '_self'
        downloadLink.download = 'Chart.png'
        downloadLink.click()
      }
    }
  }
})
</script>
