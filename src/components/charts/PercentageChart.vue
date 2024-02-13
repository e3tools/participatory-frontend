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
  name: 'PercentageChart',
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
        yAxis: {
          type: 'category',
          data: ['Total']
        },
        xAxis: {
          type: 'value'
        },
        tooltip: {},
        series: [],
        label: {
          show: true,
          formatter: (params) => Math.round(params.value * 1000) / 10 + '%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '20%',
          top: '5%',
          containLabel: true
        },
    })
    DashboardService.get_chart_data(props.chart.chart).then((data) => {
      //transform data
      let totalData = 0
      //convert to percentage. First get the total values
      data.datasets.forEach((itm) => {
        if(itm.name == props.chart.chart){
          itm.values.forEach((val) =>{ 
            totalData += val
          })
        }
      })  
      data.labels.forEach((label: string) => {
        // options.value.yAxis.data.push(label)
        options.value.series.push({ 
          'name': label, 
          'type': 'bar', 
          'stack': 'total', 
          'label': {
            show: true
          },
          'data': []
        })
      });
      data.datasets.forEach((itm) => {
        if(itm.name == props.chart.chart){
          itm.values.forEach((val, idx) =>{
            //set percentage
            options.value.series[idx].data.push(val / totalData)
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
