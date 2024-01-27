<template>
  <q-page class="q-pa-sm">
    <!-- content -->
    <q-card>
      <q-card-section>
        <div class="text-h6" v-if="doctype">
          {{ doctype }} {{ t('Report') }}
        </div> 
      </q-card-section> 

      <q-card-section>
        <suspense>
          <template #default>
            <doc-report 
              :doctype="doctype"
            >
            </doc-report>
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
import { AppUtil } from 'src/utils/app';
import { defineAsyncComponent, defineComponent, ref } from 'vue' 

export default defineComponent({
  name: 'DocReportPage',
  props: ['doctype'],
  components: {
    'doc-report': defineAsyncComponent(()=> import('components/base/views/DocReportView.vue'))
  },
  setup(props) { 
    return { 
      t: (text) => AppUtil.translate(text)
    }
  }
})
</script>
