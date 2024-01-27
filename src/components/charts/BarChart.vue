<template>
  <div>
    <q-card class="no-shadow" bordered>
      <q-card-section class="text-h6">
        {{ $props.chart.chart }} 
        <download-chart :getChartRef="() => chartRef" />
      </q-card-section>
      <q-card-section>
        <ECharts 
          ref="chartRef"
          :option="options"
          class="q-mt-md"
          :resizable="true"
          :loading="loading"
          autoresize
          style="height: 300px"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import ECharts from 'vue-echarts'
import 'echarts'
import { AppUtil } from 'src/utils/app'
import { DashboardService } from 'src/services/DashboardService' 

export default defineComponent({
  props: ['chart'],
  name: 'BarChart',
  components: {
    ECharts,
    'download-chart': defineAsyncComponent(()=> import('src/components/charts/DownloadChart.vue'))
  },
  setup(props) {
    const loading = ref(true)
    const chartRef = ref(null) 
    const options = ref({        
        legend: {
          bottom: 10,
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {},
        tooltip: {},
        series: [{
          type: 'bar',
          data: []
        }],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '20%',
          top: '5%',
          containLabel: true
        },
    })
    DashboardService.getChartData(props.chart.chart).then((data) => {
      //transform data
      data.labels.forEach((label: string) => {
        options.value.xAxis.data.push(label)
      });
      data.datasets.forEach((itm) => {
        if(itm.name == props.chart.chart){
          itm.values.forEach((val) =>{
            options.value.series[0].data.push(val)
          })
        }
      })  
      loading.value = false
    }) 
    return {
      loading,
      chartRef,
      t: (text: string) => AppUtil.translate(text),
      options,     
    }
  }
})
</script>
