<template>
  <q-input
    outlined
    v-model="fieldVal"
    :label="label"
    :hint="tooltip"
    lazy-rules 
    :rules="rules"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'; 

export default defineComponent({
  name: 'WbData',
  props: ['label', 'tooltip', 'value', 'rules'],
  setup(props) { 
    const fieldVal = ref(props.value); 
    return {
      fieldVal,
    };
  },
});
</script>
