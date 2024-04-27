import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { DashboardService } from '@/app/services/dashboard'
import { DocTypeService } from '@/app/services/doctype';
import ChartFactory from '@/app/components/charts/ChartFactory';
import { GlobalStyles } from '@/app/styles/global';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native';
//import { rotateY } from '@shopify/react-native-skia';
// import { MusicChart } from 'components/charts/Bar';

export default function DashboardPage() {
    const { id } = useLocalSearchParams<{id: string}>();
    const [charts, set_charts] = useState([]);
    
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
  
  //const DashboardItem = ({color}) => <View style={[mystyles.item, {backgroundColor: color}]} />
  const DashboardChart = ({color}) => <View style={[mystyles.item, {backgroundColor: color}]} />
 
  return (
    <ScrollView>
      <View style={GlobalStyles.dashboard}> 
        <Text>Dashboards : {id}</Text>
        {/* <PieChart style={styles.dashboard.chart} /> 
        <BarChart style={styles.dashboard.chart}/> */}
        {/* <BarChart chart_id="3333" /> */}
        {
          charts.map((item) => 
              <ChartFactory chart={item} key={item.name} />
          )
        }
      </View>
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