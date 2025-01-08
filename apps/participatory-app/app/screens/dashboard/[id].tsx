import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { DashboardService } from '@/app/services/dashboard';
import { DocTypeService } from 'data-layer/services/doctype';
import ChartFactory from 'ui/components/charts/chart-factory';
import { GlobalStyles } from '@/app/styles/global';
import { ScrollView } from 'react-native';

export default function DashboardPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [charts, set_charts] = useState([]);
  useEffect(() => {
    const get_dashboard_charts = async () => {
      const dash_charts = await DashboardService.get_dashboard_charts(id);
      for (let i = 0; i < dash_charts.length; i++) {
        let dc = await new DocTypeService('Dashboard Chart').get_doc(
          dash_charts[i].chart,
        );
        dash_charts[i].chart_type = dc.type;
      }
      return dash_charts;
    };

    get_dashboard_charts().then(async (items) => {
      set_charts(items);
    });
  }, [id]);

  return (
    <ScrollView>
      <View style={GlobalStyles.dashboard}>
        <Text>{id}</Text>
        {charts.map((item) => (
          <ChartFactory chart={item} key={item.name} />
        ))}
      </View>
    </ScrollView>
  );
}
