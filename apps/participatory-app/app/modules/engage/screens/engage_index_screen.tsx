import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { DocTypeService } from 'data-layer/services/doctype';
import { IDBReadParam } from 'data-layer/interfaces/database';
import { ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { APP } from 'common';
import AppContainer from 'ui/components/shared/app_container';
import Engagement from '../components/engagement';
import { useAppDispatch, useAppSelector } from '@/app/state/hooks';
import { getActiveEngagements } from '@/app/state/engagement/actions/engagement.action';
import AppLoader from 'ui/components/shared/app_loader';
import { ActivityIndicator } from 'react-native-paper';

const EngagementIndexScreen = () => {
  // const [engagements, set_engagements] = useState([]);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const engagements = useAppSelector((state) => state.engagement.engagements);
  const loading = useAppSelector((state) => state.engagement.loading);

  useEffect(() => {  
    // const load_engagements = async() => {  
    //   let cfg = {} as IDBReadParam;
    //   cfg.filters = [['status', '=', 'Open'], ['is_published', '=', 1]];
    //   cfg.fields = ["*"]; 
    //   new DocTypeService('Engagement').get_list(cfg).then((recs) => { 
    //     set_engagements(recs);
    //   });
    // }     
    // load_engagements(); 
    dispatch(getActiveEngagements())
  }, []);

  useLayoutEffect(()=> {
    navigation.setOptions({ title: APP._('ENGAGEMENT_LIST_PAGE.TITLE') }); 
  }, [])

  if(loading) {
    return <AppContainer>
      <View style={{ marginTop: 100, display: 'flex', alignContent: 'center' }}>
        <AppLoader />
        </View> 
      
    </AppContainer>
  }
  return (
    <AppContainer>
      <ScrollView style={{ display: 'flex' }} key={APP.generate_random_string()}>
        <View style={styles.container}> 
          {
            engagements?.map((engagement) => (  
               <Engagement engagement={engagement} key={engagement.name} /> 
            ))     
          }  
        </View>
      </ScrollView>
    </AppContainer>
  )
}

export default EngagementIndexScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10, 
  },
})