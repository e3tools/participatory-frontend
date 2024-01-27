<!-- https://v0-17.quasar-framework.org/components/building-reusable-components.html
https://dev.to/maceto2016/data-driven-ui-with-vuejs-and-quasar-2ccb
https://dev.to/ajmal_hasan/api-wrappers-using-axios-fetch-55dl
https://gist.github.com/santospatrick/752a605dca66cbbdba5abf62c6cfcd74

https://stackoverflow.com/questions/63100658/add-global-variable-in-vue-js-3
-->
<template>
  <q-select
    v-model="fieldVal"
    :options="parsedOptions" 
    @change="handleChange"
    filter
    filter-placeholder="select"
    lazy-rules
    :rules="rules"
  />
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { QSelect } from 'quasar';

export default defineComponent({
  name: 'WbSelect',
  emits: ['input'],
  props: ['value', 'options', 'rules'],// 'option_value', 'option_label'],
  components: { QSelect },
  setup(props, ctx) {
    const parsedOptions = props.options ? (props.options instanceof Array ? props.options : props.options.split('\n')) : []
    const handleChange = (newVal: string) => {      
      ctx.emit('input', newVal);
    };
    const fieldVal = ref(props.value)
    return {
      fieldVal,
      parsedOptions,
      handleChange,
    };
  },
});
</script>
  