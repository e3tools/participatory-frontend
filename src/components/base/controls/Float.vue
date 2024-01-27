<template>
   <q-input
      outlined
      :model-value="value"
      :label="label" 
      mask="#.##"
      fill-mask="0" 
      reverse-fill-mask
      :hint="tooltip"
      input-class="text-right"
      lazy-rules
      :rules="rules"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'WbFloat',
  props: ['label', 'tooltip', 'value', 'rules'],
  setup(props) {      
    return {
      
    }
  }
})
</script>
