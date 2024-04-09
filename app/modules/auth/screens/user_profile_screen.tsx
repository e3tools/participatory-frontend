import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import UpdateUserProfile from '../components/update_user_details'
import ChangePassword from '../components/change_password'
import { useNavigation } from 'expo-router'
import { APP } from '@/app/utils/app'

const UserProfileScreen = () => {
  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({ title: APP._('USER_PROFILE_PAGE.TITLES.PAGE') });
  }, []); 
  
  return (
    <SafeAreaView>
      <UpdateUserProfile />
      <ChangePassword />
    </SafeAreaView>
  )
}

export default UserProfileScreen

const styles = StyleSheet.create({})