import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import Login from '../components/login'
import { useNavigation } from 'expo-router';
import { APP } from '@/app/utils/app';
import AppContainer from '@/app/components/shared/AppContainer';
import BackButton from '@/app/components/navigation/back_button';
import { RefreshControl } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import * as Random from 'randomstring'; 
import { WebView } from 'react-native-webview';

const LoginScreen = () => { 
  const navigation = useNavigation();
  const [refreshing, set_refreshing] = useState(false);//true);
  const is_focused = useIsFocused();

  const on_refresh = React.useCallback(() => {
    set_refreshing(true);
    // load data/views
    // setTimeout(() => {
    //   set_refreshing(false);
    // }, 3000);
  }, []);
   
  useLayoutEffect(()=>{
    navigation.setOptions({ title: APP._('LOGIN_PAGE.TITLE')});    
    //refresh screen contents 
    on_refresh();
  }, [navigation]);
   
  return (
    <AppContainer key={APP.generate_random_string()}>
      <BackButton on_press={() => APP.route_to_path('/screens/home_screen') /* APP.navigate_to_path(navigation, '/screens/home_screen')*/ } />  
      {/* <RefreshControl refreshing={refreshing} onRefresh={on_refresh}> */}
        <Login /> 
      {/* </RefreshControl>  */}
    </AppContainer>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})