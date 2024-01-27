<template>
  <base-card>
    <template v-slot:header>
      {{ data.title }}
    </template>
   
    <template v-slot:content>
        {{ data.caption }}
    </template> 

    <template v-slot:actions>
        <q-btn label="Go Somewhere" class="text-capitalize q-ma-sm" color="indigo-7"/>
      </template>
  </base-card>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
export default defineComponent({
  name: 'CardHelp',
  props: ['data'],
  components: {
    'base-card': defineAsyncComponent(() => import('components/base/BaseCard.vue'))
  },
  setup() {

  }
})
</script>
