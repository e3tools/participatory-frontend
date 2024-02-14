<template>
  <q-page padding class="q-pa-xs">
    <!-- content -->
    <q-card>
      <!-- <q-card-section>
        <div class="text-h6" v-if="docname && docname !== 'new'">
          {{ doctype }} : {{ docname }}
        </div>
        <div class="text-h6" v-else>
          Add new {{ doctype }}
        </div>
      </q-card-section>  -->

      <q-card-section>
        <suspense>
          <template #default>
            <doc-form 
              :doctype="doctype"
              :docname="docname"
              :data="data"
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

    <!-- place QPageSticky at end of page -->
    <q-page-sticky expand position="top">
      <q-toolbar class="bg-accent text-white">
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
        </q-avatar>
        <!-- <q-toolbar-title>
          <div class="text-h7" v-if="docname && docname !== 'new'">
            {{ doctype }} : {{ docname }}
          </div>
          <div class="text-h6" v-else>
            Add new {{ doctype }}
          </div>
        </q-toolbar-title>  -->
        <q-breadcrumbs active-color="white" style="font-size: 16px" class="q-pl-sm">
          <q-breadcrumbs-el :label="$props.doctype" :to="`/list/${$props.doctype}`" />
          <q-breadcrumbs-el class="text-caption" v-if="docname" :label="$props.docname" />
          <q-breadcrumbs-el v-else :label="t('FORM_VIEW_PAGE.NEW_DOCTYPE')" />
        </q-breadcrumbs>
      </q-toolbar>

      <!-- <q-toolbar inset>
        <q-breadcrumbs active-color="white" style="font-size: 16px">
          <q-breadcrumbs-el label="Home" icon="home" />
          <q-breadcrumbs-el label="Components" icon="widgets" />
          <q-breadcrumbs-el label="Toolbar" />
        </q-breadcrumbs>
      </q-toolbar> -->

    </q-page-sticky>
  </q-page>

  <!-- <q-page class="q-pa-sm"> 
    <q-card>
      <q-card-section>
        <div class="text-h6" v-if="docname && docname !== 'new'">
          {{ doctype }} : {{ docname }}
        </div>
        <div class="text-h6" v-else>
          Add new {{ doctype }}
        </div>
      </q-card-section> 

      <q-card-section>
        <suspense>
          <template #default>
            <doc-form 
              :doctype="doctype"
              :docname="docname"
              :data="data"
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
  </q-page> -->
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, onMounted, ref, reactive } from 'vue'
import { AppUtil } from 'src/utils/app'
import { IDBCreateParam } from 'src/interfaces'
export default defineComponent({  
  name: 'DocFormPage',
  props: ['doctype', 'docname'],
  components: { 
    'doc-form': defineAsyncComponent(() => import('components/base/views/DocFormView.vue'))
  },
  setup(props) {
    const formRef = ref(null)
    const data = ref({})
  
    // onMounted(async () => {
    //   const res = loadFormData()
    // })
    return {
      t: (text) => AppUtil.translate(text),
      formRef,
      data, 
    }
  }
})
</script>
