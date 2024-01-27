<template>
  <q-page padding>
    <!-- content -->
    <q-card>
      <q-card-section>
        <div class="text-h6">
          {{ doctype }}
        </div>
      </q-card-section> 

      <q-card-section>
        <suspense>
          <template #default>
            <doc-form 
              :doctype="doctype"
              :show-submit-button="true"
              ref="formRef"
            >
            </doc-form>
          </template>

          <template #fallback>
            <q-spinner-orbit
              color="primary"
              size="2em"
            />
          </template>
      </suspense>
      </q-card-section> 
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineAsyncComponent } from 'vue';
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'UpdateActionTaskPage',
    //props: ['doctype'],
    components: {
      'doc-form': defineAsyncComponent(() => import('components/base/views/DocFormView.vue'))
    },
    setup() {
      return {
        doctype: 'Engagement Action Task Update'
      }
    }
})
</script>
