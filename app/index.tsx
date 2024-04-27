import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AuthService } from './modules/auth/services/auth';
import App from './App';
import LoginScreen from './modules/auth/screens/login_screen';
import HomeScreen from './screens/home_screen';
import EngagementIndexScreen from './modules/engage/screens/engage_index_screen'; 
import { AuthProvider } from './contexts/auth';

const index = () => {
  // const [authenticated, set_authenticated] = useState(false);
  // useEffect(() => {
  //   const load = async () => {
  //     const res = await AuthService.is_authenticated();
  //     set_authenticated(res)
  //   }
  //   load();
  // }, []);

  return (
    // authenticated ? <App /> : <LoginScreen />  
      <HomeScreen /> 
  )
}

export default index

const styles = StyleSheet.create({})