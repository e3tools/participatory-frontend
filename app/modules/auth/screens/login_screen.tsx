import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Login from '../components/login'
import { useNavigation } from 'expo-router';
import { APP } from '@/app/utils/app';

const LoginScreen = () => { 
  const navigation = useNavigation();
   
  useEffect(() => {
    navigation.setOptions({ title: APP._('LOGIN_PAGE.TITLE') });
  }, []);
  
  return (
    <Login />
  )
}

export default LoginScreen

const styles = StyleSheet.create({})