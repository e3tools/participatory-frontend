<template>
  <q-field>
    <template #control>
      <child-table 
        :doctype="doctype"
        :parenttype="parenttype"
        :parent="parent"
        :parentfield="parentfield"
        :parentdoc="parentdoc"
        ref="gridRef"
      />
    </template>
  </q-field>
</template>

<script lang="ts"> 
import { defineAsyncComponent, ref } from 'vue';
import { defineComponent } from 'vue'
export default defineComponent({
   name: 'WbChildTable',
   props: ['doctype', 'parentdoc', 'parenttype', 'parent', 'parentfield'],
   components: {
    'child-table': defineAsyncComponent(()=> import('../views/ChildTableListView.vue'))
   },
   setup(props) { 
    const gridRef = ref(null)
    console.log(props)
    return {
      gridRef,
      getRows: () => {
        return gridRef.value.getRows()
      }
    }
   }
})
</script>
