<template>
  <q-page padding>
    <!-- content -->
    <q-card class="q-pa-sm">
      <qa-form 
        :project="project"
        :question="question"
      />
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, ref } from 'vue' 
export default defineComponent({
  name: 'QAPage',
  props: ['project'],
  components: {
    'qa-form': defineAsyncComponent(() => import('../../components/engage/QAForm.vue'))
  },
  setup() {
    const question = ref(null)
    return {
      question
    }
  }
})
</script>
