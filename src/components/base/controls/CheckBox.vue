<template>
  <q-checkbox
    outlined
    :model-value="value==1"
    :label="label"
    :hint="tooltip"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from "vue-i18n"

export default defineComponent({
  name: 'WbCheckBox',
  props: ['label', 'tooltip', 'value'],
  setup(props) { 
    return {};
  },
});
</script>