<template>
  <Suspense>
    <template #default>
      <frappe-generator 
        :doctype="doctype"
        :docname="docname"
        :doc="doc"
        ref="formRef"
      >
      </frappe-generator>
    </template>

    <template #fallback>
      <q-spinner-orbit
        color="primary"
        size="2em"
      />
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, ref } from 'vue' 

export default defineComponent({
  name: 'UIGenerator',
  components: {
    'frappe-generator': defineAsyncComponent(() => import('./generators/FrappeUIGenerator.vue'))
  },
  props: ['doctype', 'docname', 'doc'],
  setup() {
      const formRef = ref(null)
      /**
       * Return form values
      */
      const getValues = () => {
        //ensure UI generator implements getValues method 
        return formRef.value.getValues()
      } 
      return {
        formRef,
        getValues,
        childTables: formRef.value?.childTables,
        validateForm: () => { return formRef.value?.validateForm() },
      }
    }
})
</script>
