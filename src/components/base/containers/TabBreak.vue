<template>
    <q-tab-panels :v-model="fieldname" animated>
        <q-tab-panel :name="fieldname">
            <div class="text-h6">Tab break</div>
        </q-tab-panel>
    </q-tab-panels> 
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'WbTabBreak',
    props: ['label', 'tooltip', 'value', 'fieldname'],
    setup(props) { 
      const fieldVal = ref(null); 
      return {
        fieldVal,
      };
    },
  });
  </script>
  