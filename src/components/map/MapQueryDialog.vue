<template>
  <div>
    <q-dialog v-model="display" :style="card_style">
      
      <!-- <q-bar class="bg-primary text-white" v-touch-pan.mouse="onPan">
        <div>Dragme</div>
        <q-space></q-space> 
      </q-bar> -->
      
      <q-card style="width: 300px;" class="q-px-sm q-pb-sm">        
        <q-toolbar>
          <q-avatar>
            <q-icon name="settings" />
          </q-avatar>

          <q-toolbar-title><span class="text-h6">{{ t('MAP_PAGE.SET_OPTIONS') }}</span></q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <!-- <q-card-section>
          <div class="text-h6"></div>
        </q-card-section> -->

        <q-card-section>
          <vector-select ref="vector_select_ref" @select-admin="select_admin" />
        </q-card-section>

        <q-card-section class="q-pa-xs">
          <!-- <q-item-label class="text-overline">{{ t('MAP_PAGE.OVERLAYS') }}</q-item-label> -->
          
          <q-list v-for="analysis in technical_analyses" :key="analysis.name">     
            <q-item-label header>{{ analysis.name }}</q-item-label> 
            <q-item dense >
              <q-item-section avatar>
                <q-icon name="device_thermostat" />
              </q-item-section>
              <q-item-section>
                <q-checkbox v-model="visible_analyses[analysis.name]" @update:model-value ="toggle_analysis(analysis.name)" />
              </q-item-section>
              <q-item-section>
                <q-slider color="teal" v-model="opacities[analysis.name]" :step="0.1" :min="0" :max="1" label @pan="on_opacity_slider_focus(analysis.name)" />
              </q-item-section>
            </q-item>
          </q-list>
          
          
          <!-- <q-item-label header>{{ t('MAP_PAGE.TEMPERATURE') }}</q-item-label>
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
          </q-item> -->
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            outline
            dense
            rounded
            icon="check"
            color="primary"
            v-close-popup
          >
          </q-btn>          
          <q-btn
            outline 
            rounded
            icon="close"
            color="primary"
            v-close-popup
          >
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

</template>

<script lang="ts">
import { TechnicalAnalysisService } from 'src/services/TechnicalAnalysisService';
import { AppUtil } from 'src/utils/app';
import { createOmittedExpression, displayPartsToString } from 'typescript';
import { computed } from 'vue';
import { defineAsyncComponent } from 'vue';
import { defineComponent, ref, watch, watchEffect, defineEmits } from 'vue'
export default defineComponent({
  name: 'MapQueryDialog',
  components: {
    'vector-select': defineAsyncComponent(()=> import('../map/VectorSelect.vue'))
  },
  props: ['show'], 
  setup(props, ctx) {
    let card_pos = {
      x: 0,
      y: 0
    }
    const display = ref(props.show)
    const emit = defineEmits(['toggle-analysis'])
    const showWindow = (doShow) => {
      display.value = doShow
    }

    const technical_analyses = ref([])
    TechnicalAnalysisService.get_analyses().then((recs) => {
      technical_analyses.value = recs
      recs.forEach(el => {
        visible_analyses.value[el.name] = false
        opacities.value[el.name] = 0.5
      })      
    }) 

    const visible_analyses = ref({})
    const opacities = ref({}) 
    const vector_select_ref = ref(null);
    const slider_ref = ref(null);

    watch(visible_analyses.value, (newVal, oldVal) => {
      // console.log("Visible analysis changed3")
    }, { immediate: true});  

    watch(opacities.value, (newVal, oldVal) => {  
      if(opacities.value){
        ctx.emit('update-opacity', opacities.value, slider_ref.value);
      }
      // for (const [key, value] of Object.entries(opacities.value)) {
      //   // let mp = get_analysis(key);
      //   // mp.layer.setOpacity(value);
       
      // }
    }, { immediate: true });

    const get_selected_admin = () => {
      return vector_select_ref.value.get_selected_admin();
    }

    const toggle_analysis = (analysis_name: string) => {  
      const selected_admin = get_selected_admin()
      ctx.emit('toggle-analysis', analysis_name, visible_analyses.value[analysis_name], selected_admin.name, selected_admin.level)
    } 
    const onPan = (evt) => {
      card_pos = {
        x: card_pos.x + evt.delta.x,
        y: card_pos.y + evt.delta.y
      }
    }

    const card_style = computed(() => { 
      return {
        transform: `translate(${card_pos.x}px, ${card_pos.y}px)`
      } 
    });

    const on_opacity_slider_focus = (analysis_name) => { 
      slider_ref.value = analysis_name;
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
      showWindow,
      technical_analyses,
      visible_analyses,
      opacities,
      toggle_analysis,
      vector_select_ref,
      get_selected_admin,
      select_admin: (admin) => {
        console.log("Now selecting admin ", admin);
        ctx.emit('select-admin', admin);
      },
      onPan,
      card_style,
      on_opacity_slider_focus,
      slider_ref
    }
  }
})
</script>
