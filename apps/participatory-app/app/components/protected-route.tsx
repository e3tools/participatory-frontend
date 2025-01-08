import { View, Text } from 'react-native';
import React, { PropsWithChildren } from 'react';
import { useAuth } from '../providers/auth-provider';
import AppLoader from 'ui/components/shared/app-loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP } from 'common';
import { arrayIntersection } from 'common/utils/array';
import { router, useNavigation } from 'expo-router';

type ProtectedRouteProps = PropsWithChildren & {
  allowedRoles?: [];
};
export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { currentUser } = useAuth();
  const navigation = useNavigation();

  if (currentUser === undefined || currentUser === null) {
    // router.push('/modules/auth/screens/LoginScreen');
    APP.navigateToPath(navigation, 'modules/auth/screens/LoginScreen');
  }

  if (currentUser === undefined) {
    return (
      <SafeAreaView>
        <AppLoader />
      </SafeAreaView>
    );
  }

  //reset allowedRoles
  if (allowedRoles === undefined || allowedRoles === null) allowedRoles = [];

  let intersection = allowedRoles
    ? arrayIntersection(allowedRoles, currentUser?.roles || [])
    : [];
  if (
    //currentUser === null ||
    // intersection.length === 0 ||
    intersection.length < allowedRoles.length // All roles in allowedRoles must exist in currentUSer.roles
    // (allowedRoles && !allowedRoles.filter((x) => currentUser.roles.includes(x)))
  ) {
    return (
      <View>
        <Text>{APP._('GLOBAL.PERMISSION_DENIED')}</Text>
      </View>
    );
  }
  return children;
}
