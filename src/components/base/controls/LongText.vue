<template>
  <q-input
    outlined
    :value="value"
    :label="label"
    :hint="tooltip"
    type="textarea"
    lazy-rules 
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'; 

export default defineComponent({
  name: 'WbLongText',
  props: ['label', 'tooltip', 'value'],
  setup(props) { 
    const fieldVal = ref(null); 
    return {
      fieldVal,
    };
  },
});

</script>