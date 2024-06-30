import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import UpdateUserProfile from '../components/update_user_details'
import ChangePassword from '../components/change_password'
import { useNavigation } from 'expo-router'
import { APP } from '@/app/utils/app'
import KeyboardAvoidingWrapper from '@/app/components/shared/KeyboardAvoidingWrapper'
import { ScrollView } from 'react-native'

const UserProfileScreen = () => {
  const navigation = useNavigation();
  
  useLayoutEffect(() => {
    navigation.setOptions({ title: APP._('USER_PROFILE_PAGE.TITLES.PAGE') });
  }, []); 
  
  return (
    <KeyboardAvoidingWrapper>
      <ScrollView>
        <UpdateUserProfile />
        <ChangePassword />
      </ScrollView>
    </KeyboardAvoidingWrapper>
  )
}

export default UserProfileScreen

const styles = StyleSheet.create({})