import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { DashboardService } from '@/app/services/dashboard'
import { DocTypeService } from '@/app/services/doctype';
import ChartFactory from '@/app/components/charts/ChartFactory';
import { GlobalStyles } from '@/app/styles/global';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { rotateY } from '@shopify/react-native-skia';
import { APP } from '@/app/utils/app';
// import { MusicChart } from 'components/charts/Bar';

export default function DashboardPage() {
  const navigation = useNavigation(); 
    const { id } = useLocalSearchParams<{id: string}>();
    const [charts, set_charts] = useState([]); 

    useEffect(() => {
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

      // const set_chart_type = async (itm: object) => {
      //   const doc = await new DocTypeService("Dashboard Chart").get_doc(itm.chart);
      //   itm.chart_type = doc.type
      //   console.log("Retrieved chart type")
      // }

      get_dashboard_charts().then(async(items) => {
        /*for(let i=0; i< items.length; i++) {
          const doc = await new DocTypeService("Dashboard Chart").get_doc(items[i].chart);
          // items[i]['chart_type'] = ''  ;
          console.log("Doc.type: ", doc.type);
          //items[i]['chart_type'] = doc.type;
          console.log("Doc.type: ", items[i]);
          //items[i]['chart_type'] = doc.type;
        }*/
        set_charts(items);
      })

      // get_dashboard_charts().then(items => {
        
      //   for(const itm of items) {
      //     const doc = await new DocTypeService("Dashboard Chart").get_doc(itm.chart);
      //     itm.chart_type = doc.type
      //     if(idx == items.length - 1){
      //       set_charts(items); 
      //       //loading.value = false
      //     }
      //   }
      //   /*
      //   items.forEach(async (itm: object, idx: number) => {
      //     const doc = await new DocTypeService("Dashboard Chart").get_doc(itm.chart);
      //     itm.chart_type = doc.type
      //     if(idx == items.length - 1){
      //       set_charts(items); 
      //       //loading.value = false
      //     }
      //   })*/
      // })
        // DashboardService.get_dashboard_charts(id).then((items) => {
        //   console.log(items) 
        //   items.forEach(async (itm: object, idx: number) => {
        //     const doc = await new DocTypeService("Dashboard Chart").get_doc(itm.chart) 
        //     itm.chart_type = doc.type
        //     // if(idx == items.length - 1){
        //     //   charts.value = items
        //     //   loading.value = false
        //     // }
        //   }) 
        //   set_charts(items);
        //   console.log("items after: ", items)
        // })
    }, []);
  
  //const DashboardItem = ({color}) => <View style={[mystyles.item, {backgroundColor: color}]} />
  const DashboardChart = ({color}) => <View style={[mystyles.item, {backgroundColor: color}]} />

  // return (
  //   <View
  //     style={[
  //       //styles.container,
  //       {
  //         // Try setting `flexDirection` to `"row"`.
  //         flex: 1,
  //         flexWrap: 'wrap',
  //         padding: 20,
  //         flexDirection: 'row',
  //         alignContent: 'flex-start'
  //       },
  //     ]}>
  //     <DashboardItem color='red' />
  //     <DashboardItem color='darkorange' />
  //     <DashboardItem color='green' />
  //     <DashboardItem color='red' />
  //     <DashboardItem color='darkorange' /> 
  //   </View>
  // )
  return (
    <ScrollView>
      <View style={GlobalStyles.dashboard}>  
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