<template>
  <div>
    <q-dialog :v-model="display">
      <q-card style="width: 300px;" class="q-px-sm q-pb-sm">        
        <q-toolbar>
          <q-avatar>
            <q-icon name="settings" />
          </q-avatar>

          <q-toolbar-title><span class="text-weight-bold">Rainfall distribution. 2022</span></q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        Showing
        <!-- <q-card-section>
          <div class="text-h6"></div>
        </q-card-section> -->

        <!-- <q-card-section class="q-pa-xs">
          <q-item-label class="text-overline">{{ t('MAP_PAGE.OVERLAYS') }}</q-item-label>
          <q-item-label header>{{ t('MAP_PAGE.TEMPERATURE') }}</q-item-label>
          <q-item dense>
            <q-item-section avatar>
              <q-icon name="device_thermostat" />
            </q-item-section>
            <q-item-section>
              <q-checkbox v-model="temperature" />
            </q-item-section>
            <q-item-section>
              <q-slider color="teal" v-model="temperatureOpacity" :step="0" />
            </q-item-section>
          </q-item>

          <q-item-label header>{{ t('MAP_PAGE.RAINFALL') }}</q-item-label>
          <q-item dense>
            <q-item-section avatar>
              <q-icon name="thunderstorm" />
            </q-item-section>
            <q-item-section>
              <q-checkbox v-model="rainfall" />
            </q-item-section>
            <q-item-section>
              <q-slider color="teal" v-model="rainfallOpacity" :step="0" />
            </q-item-section>
          </q-item>

          <q-item-label header>{{ t('MAP_PAGE.PRECIPITATION') }}</q-item-label>
          <q-item dense>
            <q-item-section avatar>
              <q-icon name="cloudy_snowing" />
            </q-item-section>
            <q-item-section>
              <q-checkbox v-model="precipitation" />
            </q-item-section>
            <q-item-section>
              <q-slider color="teal" v-model="precipitationOpacity" :step="0" />
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            outline
            dense
            icon="check"
            color="primary"
            v-close-popup
          >
          </q-btn>          
          <q-btn
            outline
            dense
            icon="close"
            color="primary"
            v-close-popup
          >
          </q-btn>
        </q-card-actions> -->
      </q-card>
    </q-dialog>
  </div>

</template>

<script lang="ts">
import { AppUtil } from 'src/utils/app';
import { displayPartsToString } from 'typescript';
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'MapQueryDialog',
  props: ['show'],
  setup(props) {
    const display = ref(props.show)
    const showWindow = (doShow) => {
      display.value = doShow
    }
    return {
      display,
      temperature: ref(false),
      temperatureOpacity: ref(0),
      rainfall: ref(false),
      rainfallOpacity: ref(0),
      precipitation: ref(false),
      precipitationOpacity: ref(0),
      t: (text) => AppUtil.translate(text),
      showWindow
    }
  }
})
</script>
