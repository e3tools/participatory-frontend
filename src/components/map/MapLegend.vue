<template>
  <q-card class="q-gutter-xs">
    <!-- <q-card-section>
      <div class="text-h6">{{ legend_title }}</div>
    </q-card-section> -->
    <q-card-section class="q-pa-xs">
      <div class="text-weight-bold text-subtitle1 text-center bg-grey">{{ legend_title }}</div>
      <div v-for="itm in legend_entries" class="row no-wrap" :key="itm.name">
        <div class="col-2" :style="{ 'background-color': itm.color }"></div>
        <div v-show="false" class="col-3">{{ itm.expression }}</div>
        <div class="col-7 q-pl-xs">{{ itm.label }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { DocTypeService } from 'src/services/DocTypeService';
export default defineComponent({
  name: 'MapLegend',
  props: ['analysis_name', 'title'],
  setup(props) {
    const legend_entries = ref([]);
    const legend_title = ref(props.title);
    const make_legend_by_legend = (legend_name: string, legend_title: string) => {
      if(!legend_name){
        return;
      }
      // legend_title.value = legend_title;
      legend_entries.value = [];
      new DocTypeService("Legend").get_doc(legend_name).then((doc) => {      
        doc.legend_entries?.forEach(element => {
          legend_entries.value.push(element);
        });
      });
    }

    const make_legend_by_analysis = (analysis_name: string, legend_title: string) => { 
      if(!analysis_name){
        return;
      }
      new DocTypeService("Technical Analysis").get_doc(analysis_name).then((doc) => {
        return make_legend_by_legend(doc.legend, legend_title);
      });
    }

    make_legend_by_analysis(props.analysis_name, props.title);
    return {
      legend_title,
      legend_entries,
      make_legend_by_legend,
      make_legend_by_analysis
    }
  }
})
</script>
