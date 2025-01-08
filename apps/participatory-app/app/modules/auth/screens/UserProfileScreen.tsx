import { ScrollView } from 'react-native';
import React, { useLayoutEffect } from 'react';
import KeyboardAvoidingWrapper from 'ui/components/shared/keyboard-avoiding-wrapper';
import UserProfile from 'auth/components/user-profile';
import ChangePassword from 'auth/components/change-password';
import ProtectedRoute from '../../../components/protected-route'; // '@/app/components/protected-route';
import { useNavigation } from 'expo-router';
import { APP } from 'common';

const UserProfileScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ title: APP._('USER_PROFILE_PAGE.TITLES.PAGE') });
  }, [navigation]);

  return (
    <KeyboardAvoidingWrapper>
      <ScrollView>
        {/* <ProtectedRoute> */}
        <UserProfile />
        <ChangePassword />
        {/* </ProtectedRoute> */}
      </ScrollView>
    </KeyboardAvoidingWrapper>
  );
};

export default UserProfileScreen;
