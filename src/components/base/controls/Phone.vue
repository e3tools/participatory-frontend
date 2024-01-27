<template>
  <q-input 
    outlined
    :model-value="value" 
    :label="label"
    :hint="tooltip"
  > 
  </q-input>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'WbPhone',
  props: ['label', 'tooltip', 'value'],
  setup(props) { 
    return { 
    }
  }
})
</script>
