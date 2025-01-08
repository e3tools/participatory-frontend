import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Data, VictoryBar, VictoryChart, VictoryTheme } from "victory-native"; 
//import { DashboardService } from '@/app/services/dashboard';
import AppLoader from '../shared/app-loader'; 

import {
  barDataItem,
  BarChart as BarGraph,
  LineChart,
  PieChart,
  pieDataItem,
} from "react-native-gifted-charts";

interface Props {
  data: barDataItem[]
}
 
export default function BarChart(props: Props) {
  // See https://commerce.nearform.com/open-source/victory/docs
  /*
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    DashboardService.getChartData(chartId).then((data) => {
      //transform data
      let vals = [];
      data.labels.forEach((label: string) => {
        vals.push({ label: label, value: null });
      });
      data.datasets.forEach((itm) => {
        if (itm.name == chartId) {
          itm.values.forEach((val, idx) => {
            vals[idx]["value"] = val;
          });
        }
      });
      setChartData(vals);
      setLoading(false);
    });
  }, []);

   return (
    <View>
      {loading === false ? (
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryBar data={chartData} x="label" y="value" />
        </VictoryChart>
      ) : (
        <AppLoader />
      )}
    </View>
  );
  */ 
  return ( 
      <BarGraph data={props.data} /> 
  );
}