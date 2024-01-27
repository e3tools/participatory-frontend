<template>
    <q-img
      :src="value"
      spinner-color="white"
      style="height: 140px; max-width: 150px"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'WbImageViewer',
  props: ['label', 'tooltip', 'value'],
  setup(props){
    return {

    }
  }
})
</script>
