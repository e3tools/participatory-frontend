import { View, Text, StyleSheet } from 'react-native'
import React, { lazy, useEffect } from 'react'

import PieChart from './pie';
import BarChart from './bar';
import { GlobalStyles } from '../styles/global'; 
import { barDataItem } from 'react-native-gifted-charts';

interface Chart {
  chart_name: string,
  chart_type: string;
  data: barDataItem[]
}

const charts = {
    'pie-chart': PieChart,
    'bar-chart': BarChart
    // 'bar-chart': lazy(() => import("components/charts/bar")), 
    // //'line-chart': defineAsyncComponent(()=> import('components/charts/LineChart.vue')),
    // 'pie-chart': lazy(() => import("components/charts/bar")), 
    //'donut-chart': defineAsyncComponent(()=> import('components/charts/DonutChart.vue')),
    //'percentage-chart': defineAsyncComponent(()=> import('components/charts/PercentageChart.vue')),
};


  
export default function ChartFactory(props: Chart) {
  console.log("Chart factory: ", props)
  const getChartType = (chart_type: string) => {
    if (chart_type == "Line") {
      return "line-chart";
    }
    if (chart_type == "Bar") {
      return "bar-chart";
    }
    if (chart_type == "Pie") {
      return "pie-chart";
    }
    if (chart_type == "Percentage") {
      return "percentage-chart";
    }
    if (chart_type == "Donut") {
      return "donut-chart";
    }
    return "bar-chart";
  };
  const FactoryComponent = charts[getChartType(props.chart_type)];  
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={styles.chart_title}>{props.chart_name}</Text>
      <FactoryComponent chart_id={props.chart_type} data={props.data} />
    </View>
  );
}

 const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    chart_container: {
        flex: 1,
        flexWrap: 'wrap',
        padding: 20,
        flexDirection: 'row',
        alignContent: 'flex-start',
    },    
    chart_title: {
        fontWeight: '700',
        fontSize: 16,
        textDecorationLine: 'underline'
    },
    chart: {
        flexBasis: 90,
        height: 200,
        padding: 10,
        margin: 10,
        borderColor: 'red',
        borderStyle: 'solid',
        borderWidth: 2
    }});