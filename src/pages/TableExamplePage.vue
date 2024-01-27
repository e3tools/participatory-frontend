<template>
  <q-page padding>
    <!-- content -->
    <table-view>

    </table-view>
  </q-page>
</template>

<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'TableExamplePage',
  components: {
    'table-view': defineAsyncComponent(() => import('components/base/views/TableExampleView.vue'))
  }
})
</script>
