import React, { useEffect, useLayoutEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import ChartFactory from 'ui/components/charts/chart-factory';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { APP } from 'common';
import { useAppDispatch, useAppSelector } from '@/app/state/hooks';
import { getDashboardCharts } from '@/app/state/dashboard/actions/dashboard.action';
import AppLoader from 'ui/components/shared/app-loader';
import AppContainer from 'ui/components/shared/app-container';
// import { MusicChart } from 'components/charts/Bar';

export default function DashboardPage() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  // const [charts, set_charts] = useState([]);
  const dispatch = useAppDispatch();
  const charts = useAppSelector(
    (state) => state.dashboard.currentDashboard?.charts,
  );
  const loading = useAppSelector((state) => state.dashboard.loading);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${APP._('DASHBOARD_PAGE.TITLE')} : ${id}`,
    });
  }, [navigation, id]);

  useEffect(() => {
    console.log('Charts: ', charts);
  }, [charts]);

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
  }, [dispatch, id]);

  return (
    <AppContainer>
      <Text style={styles.title}>{id}</Text>
      <ScrollView>
        {loading && <AppLoader />}
        {charts?.map((item) => <ChartFactory chart={item} key={item.name} />)}
      </ScrollView>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 2,
  },
});
