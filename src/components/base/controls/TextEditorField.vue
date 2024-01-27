<template>
  <q-editor
    outlined
    :model-value="value"
    :label="label"
    :hint="tooltip"
    lazy-rules 
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from "vue-i18n"

export default defineComponent({
  name: 'WbTextEditor',
  props: ['label', 'tooltip', 'value'],
  setup(props) { 
    return { };
  },
});

</script>