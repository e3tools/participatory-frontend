<template>
  <q-dialog v-model="showAbout">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ t('MAIN_LAYOUT.HEADER.ABOUT') }}</div>
        <q-space /> 
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n';

export default defineComponent({
   name: 'AboutDialog',
   setup() {
    const { t } = useI18n()
    const showAbout = ref(false)

    return {
      t,
      showAbout
    }
   }
})
</script>
