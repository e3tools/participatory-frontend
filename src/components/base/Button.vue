<template>
  <q-btn
    color="primary" 
    unelevated
    rounded
    @click="onClick"
    :label="label"
    :style="style"
  >
    <slot></slot>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
   name: 'WbButton',
   props: ['onClick', 'label', 'style']
})
</script>
