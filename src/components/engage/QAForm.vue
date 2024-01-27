<template>
  <q-form>
    <div class="text-h6">
      {{ question }}
    </div>
    <wb-data
      :label="t('QA.ANSWER')"
      :autogrow="true" 
    /> 
  <wb-button 
    :label="t('BUTTON.SUBMIT')"
    :on-click="submitAnswer"
    />
  </q-form>>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue' 
import { AppUtil } from '../../utils/app'

export default defineComponent({
    name: 'QAForm',
    components: {
      'wb-data': defineAsyncComponent(()=> import('../../components/base/controls/Data.vue')),
      'wb-button': defineAsyncComponent(() => import('../../components/base/Button.vue'))
    },
    props: ['question', 'project'],
    setup() {
      const submitAnswer = () => {
          console.log("Save answer")
      }
      return {
        t: (text) => AppUtil.translate(text)
      }
    }
})
</script>
