<template>
   <q-btn flat color="primary" label="Options" no-caps icon="settings" align="right" >
      <q-menu >
        <div class="row no-wrap q-pa-md">
          <div class="column">           
            <!-- <div class="text-h6 q-mb-md">Settings</div> -->

            <div v-for="analysis in technical_analyses" :key="analysis.name">  
              <div class="overline col-xs-12 text-caption">{{ analysis.name }}</div>
              <!-- <q-item-label class="q-pa-sm" header>{{ analysis.name }}</q-item-label> -->
              <div class="row no-wrap q-gutter-sm">
                <!-- <q-icon size="md" class="column justify-center" name="device_thermostat" /> -->
                <q-checkbox class="column justify-center" v-model="visible_analyses[analysis.name]" @update:model-value ="toggle_analysis(analysis.name)" />
                <q-slider class="column justify-center" color="teal" v-model="opacities[analysis.name]" :step="0.1" :min="0" :max="1" label @pan="on_opacity_slider_focus(analysis.name)" />
              </div>
            </div>
            <!-- <q-list v-for="analysis in technical_analyses" :key="analysis.name">     
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
            </q-list> -->
          
            <!-- <q-toggle v-model="mobileData" label="Use Mobile Data" />
            <q-toggle v-model="bluetooth" label="Bluetooth" /> -->
          </div>

          <!-- <q-separator vertical inset class="q-mx-lg" />

          <div class="column items-center">
            <q-avatar size="72px">
              <img src="https://cdn.quasar.dev/img/avatar4.jpg">
            </q-avatar>

            <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

            <q-btn
              color="primary"
              label="Logout"
              push
              size="sm"
              v-close-popup
            />
          </div> -->
        </div>
      </q-menu>
    </q-btn>
</template>

<script lang="ts">
import { TechnicalAnalysisService } from 'src/services/TechnicalAnalysisService';
import { AppUtil } from 'src/utils/app'; 
import { computed } from 'vue';
import { defineAsyncComponent } from 'vue';
import { defineComponent, ref, watch, watchEffect, defineEmits } from 'vue'
export default defineComponent({
  name: 'MapSettings',
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

    const visible_analyses = ref({})
    const opacities = ref({}) 
    const vector_select_ref = ref(null);
    const slider_ref = ref(null);
    const technical_analyses = ref([])
    TechnicalAnalysisService.get_analyses().then((recs) => {
      technical_analyses.value = recs
      recs.forEach(el => {
        visible_analyses.value[el.name] = false
        opacities.value[el.name] = 0.5
      })      
    });
    
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
      //const selected_admin = get_selected_admin()
      ctx.emit('toggle-analysis', analysis_name, visible_analyses.value[analysis_name]);//, selected_admin.name, selected_admin.level)
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
