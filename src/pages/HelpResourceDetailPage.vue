<template>
  <q-page padding>
    <!-- content -->
    <resource-detail :docname="docname" />
  </q-page>
</template>

<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'HelpResourceDetailPage',
  props: ['docname'],
  components: {
    'resource-detail': defineAsyncComponent(() => import('components/engage/HelpResourceDetailCard.vue'))
  }
})
</script>
