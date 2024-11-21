import React, { useEffect, useLayoutEffect } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import ChartFactory from 'ui/components/charts/chart_factory';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native'; 
import { APP } from 'common';
import { useAppDispatch, useAppSelector } from '@/app/state/hooks';
import { getDashboardCharts } from '@/app/state/dashboard/actions/dashboard.action';
// import { MusicChart } from 'components/charts/Bar';

export default function DashboardPage() {
  const navigation = useNavigation(); 
    const { id } = useLocalSearchParams<{id: string}>();
    // const [charts, set_charts] = useState([]); 
    const dispatch = useAppDispatch();
    const charts = useAppSelector((state) => state.dashboard.currentDashboard?.charts)

    useLayoutEffect(() => {
      navigation.setOptions({ title: `${APP._('DASHBOARD_PAGE.TITLE')} : ${id}` }); 
    }, []);

    useEffect(() => { 
      // const get_dashboard_charts = async () => {
      //   const dash_charts = await DashboardService.get_dashboard_charts(id); 
      //   for(let i=0; i < dash_charts.length; i++){
      //     let dc = await new DocTypeService("Dashboard Chart").get_doc(dash_charts[i].chart);
      //     dash_charts[i].chart_type = dc.type;
      //   }
      //   return dash_charts;
      // }; 

      // get_dashboard_charts().then(async(items) => { 
      //   set_charts(items);
      // }) 
      dispatch(getDashboardCharts(id));
    }, []);
  
  return (
    <ScrollView> 
        {
          charts?.map((item) => 
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