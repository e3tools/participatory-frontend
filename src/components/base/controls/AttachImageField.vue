<template>
  <attach-file     
    :v-model="value"
    :label="label" 
    :style="style"
    :multiple="false"
    :images-only="true"
  />
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent} from 'vue' 
export default defineComponent({
  name: 'WbAttachImage',
  components: {
    'attach-file': defineAsyncComponent(()=> import('components/base/controls/AttachFileField.vue'))
  },
  props: ['label', 'tooltip', 'value', 'style'],
  setup(props){ 
    return {}
  }
})
</script>