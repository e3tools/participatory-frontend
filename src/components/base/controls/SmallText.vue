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
import { useI18n } from "vue-i18n"

export default defineComponent({
  name: 'WbSmallText',
  props: ['label', 'tooltip', 'value'],
  setup(props) { 
    const fieldVal = ref(null);
    console.log(props);
    return {
      fieldVal,
    };
  },
});

</script>