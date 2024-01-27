<template>
  <q-page padding>
    <!-- content -->
    <div v-if="loading" class="text-center">
      <q-spinner-grid
        color="primary"
        size="4em"
      /> 
    </div>

    <div class="row q-col-gutter-sm q-py-sm"> 
      <div 
        class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
        v-for="chart in charts" :key="chart.name"
      >
        <component :is="getChartType(chart.chart_type)" :chart="chart"> 
        </component>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue' 
import { DashboardService } from '../services/DashboardService' 
import { defineAsyncComponent } from 'vue'
import { DocTypeService } from 'src/services/DocTypeService' 

export default defineComponent({
  name: 'DashboardPage',
  props: ['dashboard'],
  components: {
    'bar-chart': defineAsyncComponent(()=> import('components/charts/BarChart.vue')),
    'line-chart': defineAsyncComponent(()=> import('components/charts/LineChart.vue')),
    'pie-chart': defineAsyncComponent(()=> import('components/charts/PieChart.vue')),
    'donut-chart': defineAsyncComponent(()=> import('components/charts/DonutChart.vue')),
    'percentage-chart': defineAsyncComponent(()=> import('components/charts/PercentageChart.vue')),
  },
  setup(props) { 
    const charts = ref([])
    const loading = ref(true)
    const db = new DocTypeService("Dashboard Chart")
    DashboardService.getDashboardCharts(props.dashboard).then((items) => {
      if(items.length == 0){
        loading.value = false
      }
      items.forEach(async (itm, idx) => {
        const doc = await db.get_doc(itm.chart) 
        itm.chart_type = doc.type
        if(idx == items.length - 1){
          charts.value = items
          loading.value = false
        }
      }) 
    })
    return {
      charts,
      loading,
      getChartType: (chart_type: string) => {
        if(chart_type == 'Line'){
          return 'line-chart'
        }
        if(chart_type == 'Bar'){
          return 'bar-chart'
        }
        if(chart_type == 'Pie'){
          return 'pie-chart'
        }
        if(chart_type == 'Percentage'){
          return 'percentage-chart'
        }
        if(chart_type == 'Donut'){
          return 'donut-chart'
        }
        return 'bar-chart'
      }
    }
  }
})
</script>
