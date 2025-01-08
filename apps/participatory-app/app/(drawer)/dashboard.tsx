import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import ChartFactory from 'ui/components/charts/chart-factory';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { APP } from 'common';
import { useAppDispatch, useAppSelector } from '@/app/state/hooks';
import { getDashboardCharts } from '@/app/state/dashboard/actions/dashboard.action';
import AppLoader from 'ui/components/shared/app-loader';
import AppContainer from 'ui/components/shared/app-container';
import { DashboardService } from '../services/dashboard';
import { BarChart, barDataItem } from 'react-native-gifted-charts';
import { DashboardChart } from '../state/state.types';

interface TempChart {
  chartName: string;
  chartType: string;
  data: any[];
}

export default function DashboardPage() {
  const navigation = useNavigation();
  //   const { id } = useLocalSearchParams<{ id: string }>();
  const dashboard = useAppSelector(
    (state) => state.dashboard.currentDashboard?.name || '',
  );
  const dispatch = useAppDispatch();
  const charts = useAppSelector(
    (state) => state.dashboard.currentDashboard?.charts || [],
  );
  const loading = useAppSelector((state) => state.dashboard.loading);
  const [chartData, setChartData] = useState<any[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${APP._('DASHBOARD_PAGE.TITLE')} : ${dashboard}`,
    });
  }, [navigation, dashboard]);

  useEffect(() => {
    dispatch(getDashboardCharts(dashboard));
  }, [dispatch, dashboard]);

  useEffect(() => {
    const loadChartData = async (chart: DashboardChart, i: number) => {
      const data = await getChartData(chart.chart);
      console.log('Item data: ', data);
      return data;
    };

    const getAllData = async () => {
      //   const res = await Promise.allSettled(charts?.map(loadChartData));
      //   console.log('Chart data: ', res);
      const tempCharts: TempChart[] = [];
      for (const chart of charts) {
        const data = await getChartData(chart.chart);
         console.log('Chart item data: ', chart.chart, data);
        tempCharts.push({
          chartName: chart.chart,
          chartType: chart.chart_type,
          data: data,
        });
      }
      setChartData(tempCharts);
      console.log('Chart items: ', tempCharts);
    };
    getAllData();

    /*
    const tempCharts: TempChart[] = [];
    const ss = [];
    const res = await Promise.allSettled(urls.map(mapFn));
    const res = charts?.map(async (item) => {
      const data = await getChartData(item.chart);
      console.log('Chart dddd: ', data);
      tempCharts.push({
        chartName: item.name,
        chartType: item.chart_type,
        data: data,
      });
    });
    console.log('Chart items: ', res);
    setChartData(tempCharts);*/
  }, [charts]);

  const getChartData = async (chartId: string) => {
    const data = await DashboardService.getChartData(chartId);
    //transform data
    let vals: barDataItem[] = [];
    data.labels.forEach((label: string) => {
      vals.push({ label: label, value: 0 });
    });
    data.datasets.forEach((itm) => {
      if (itm.name === chartId) {
        itm.values.forEach((val, idx) => {
          vals[idx]['value'] = val;
        });
      }
    });
    return vals;
  };

  const ddd = [
      { label: 'Jan 2024', value: 0 },
      { label: 'Feb 2024', value: 0 },
      { label: 'Mar 2024', value: 1 },
      { label: 'Apr 2024', value: 0 },
      { label: 'May 2024', value: 0 },
      { label: 'Jun 2024', value: 0 },
      { label: 'Jul 2024', value: 0 },
      { label: 'Aug 2024', value: 0 },
      { label: 'Sep 2024', value: 0 },
      { label: 'Oct 2024', value: 0 },
      { label: 'Nov 2024', value: 0 },
      { label: 'Dec 2024', value: 0 },
      { label: 'Jan 2025', value: 0 },
  ];
//   return (
//     <AppContainer>
//       <ScrollView>
//         <BarChart data={ddd} />
//       </ScrollView>
//     </AppContainer>
//   );

  return (
    <AppContainer>
      <ScrollView>
        {loading && <AppLoader />}
        {chartData?.map((item: TempChart, indx: number) => (
          <ChartFactory
            chart_name={item.chartName}
            chart_type={item.chartType}
            key={indx}
            data={item.data}
          />
        ))}
      </ScrollView>
    </AppContainer>
  );
}
