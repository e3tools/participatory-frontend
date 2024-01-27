<template>
  <q-input
    filled
    v-model="fieldRef"
    label="Your name"
    hint="Name and surname"
    lazy-rules
    :rules="[(val) => (val && val.length > 0) || 'Please type something']"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'WbData',
  props: ['field'],
  setup(props) {
    const fieldRef = ref(null); 
    return {
      fieldRef,
    };
  },
});
</script>
