import { View, Text } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { DashboardService } from '@/app/services/dashboard'
import { DocTypeService } from '@/app/services/doctype';
import ChartFactory from '@/app/components/charts/ChartFactory';
import { GlobalStyles } from '@/app/styles/global';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native';
import { rotateY } from '@shopify/react-native-skia';
import { APP } from '@/app/utils/app';
// import { MusicChart } from 'components/charts/Bar';

export default function DashboardPage() {
  const navigation = useNavigation(); 
    const { id } = useLocalSearchParams<{id: string}>();
    const [charts, set_charts] = useState([]); 

    useLayoutEffect(() => {
      navigation.setOptions({ title: `${APP._('DASHBOARD_PAGE.TITLE')} : ${id}` }); 
    }, []);

    useEffect(() => { 
      const get_dashboard_charts = async () => {
        const dash_charts = await DashboardService.get_dashboard_charts(id); 
        for(let i=0; i < dash_charts.length; i++){
          let dc = await new DocTypeService("Dashboard Chart").get_doc(dash_charts[i].chart);
          dash_charts[i].chart_type = dc.type;
        }
        return dash_charts;
      };
 

      get_dashboard_charts().then(async(items) => { 
        set_charts(items);
      }) 
    }, []);
  
  return (
    <ScrollView> 
        {
          charts.map((item) => 
              <ChartFactory chart={item} key={item.name} />
          )
        } 
    </ScrollView>
  )
}

const mystyles = StyleSheet.create({
  item: {
    flexBasis: 90,
    height: 200,
    padding: 10,
    margin: 10
  } 
})