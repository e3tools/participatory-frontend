import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import Login from '../components/login'
import { useNavigation } from 'expo-router';
import { APP } from 'common';
import AppContainer from 'ui/components/shared/app_container';
import BackButton from '../components/back_button'; 
import { useIsFocused } from '@react-navigation/native';  

type LoginProps = {
  on_login_success: () => void;
};

const LoginScreen = (props: LoginProps) => { 
  const navigation = useNavigation();
  const [refreshing, set_refreshing] = useState(false);//true);
  const is_focused = useIsFocused();

  const on_refresh = React.useCallback(() => {
    set_refreshing(true); 
  }, []);
   
  useLayoutEffect(()=>{
    navigation.setOptions({ title: APP._('LOGIN_PAGE.TITLE')});    
    //refresh screen contents 
    on_refresh();
  }, [navigation]);
   
  return ( 
    <AppContainer key={APP.generate_random_string()}>
      <BackButton
        on_press={
          () =>
            APP.route_to_path(
              "/screens/home_screen"
            ) /* APP.navigate_to_path(navigation, '/screens/home_screen')*/
        }
      />
      <Login on_login_success={props.on_login_success} />
    </AppContainer> 
  );
}

export default LoginScreen

const styles = StyleSheet.create({})