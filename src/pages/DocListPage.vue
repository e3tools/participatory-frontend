<template>
  <q-page class="q-pa-sm">
    <!-- content -->
    <q-card>
      <q-card-section>
        <div class="text-h6" v-if="doctype">
          {{ doctype }} {{ t('List') }}
        </div> 
      </q-card-section> 

      <q-card-section>
        <suspense>
          <template #default>
            <doc-list 
              :doctype="doctype"
            >
            </doc-list>
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
  name: 'DocListPage',
  props: ['doctype'],
  components: {
    'doc-list': defineAsyncComponent(()=> import('components/base/views/DocListView.vue'))
  },
  setup(props) { 
    return { 
      t: (text) => AppUtil.translate(text)
    }
  }
})
</script>
