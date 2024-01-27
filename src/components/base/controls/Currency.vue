<template>
  <!-- <q-field
    outlined
    :model-value="value"
    :label="label"
    :hint="tooltip"
    > 
  <template v-slot:control="{ id, floatingLabel, modelValue, emitValue }">
    <input :id="id" class="q-field__input text-right" :value="modelValue" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
  </template>
  </q-field>  -->
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
import { defineComponent, ref } from 'vue';
import { useI18n } from "vue-i18n"

export default defineComponent({
  name: 'WbCurrency',
  props: ['label', 'tooltip', 'value', 'rules'],
  setup(props) {      
    return {
      moneyFormatForComponent: {
        decimal: '.',
        thousands: ',',
        prefix: '$ ',
        suffix: ' #',
        precision: 2,
        masked: true
      },
      moneyFormatForDirective: {
        decimal: '.',
        thousands: ',',
        prefix: '$ ',
        suffix: ' #',
        precision: 2,
        masked: false /* doesn't work with directive */
      }
    };
  },
});
</script>
