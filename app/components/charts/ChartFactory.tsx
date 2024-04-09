import { View, Text } from 'react-native'
import React, { lazy } from 'react'

import PieChart from './Pie';
import BarChart from './Bar';
import { GlobalStyles } from '@/app/styles/global'; 

const charts = {
    'pie-chart': PieChart,
    'bar-chart': BarChart
    // 'bar-chart': lazy(() => import("components/charts/bar")), 
    // //'line-chart': defineAsyncComponent(()=> import('components/charts/LineChart.vue')),
    // 'pie-chart': lazy(() => import("components/charts/bar")), 
    //'donut-chart': defineAsyncComponent(()=> import('components/charts/DonutChart.vue')),
    //'percentage-chart': defineAsyncComponent(()=> import('components/charts/PercentageChart.vue')),
};
export default function ChartFactory({chart}) {     
    const get_chart_type = (chart_type: string) => {
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
      const FactoryComponent = charts[get_chart_type(chart.chart_type)];

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={GlobalStyles.chart_title}>{chart.chart}</Text>
      <FactoryComponent chart_id={chart.chart} />
    </View>
  )
}