import { Image } from 'react-native';
import React from 'react';
import { full_sync } from '../../../utils/data-sync';
import { APP } from 'common';
import { useAppSelector } from '@/app/state/hooks';
import Login from 'auth/components/login';
import { router } from 'expo-router';

const LoginScreen = () => {
  // const { app_name, logo_path } = useLocalSearchParams();
  const settings = useAppSelector((state) => state.settings.settings);
  // console.log("LocalSearchParams", useLocalSearchParams())
  const app_name = useAppSelector((state) => state.settings.settings.app_name);
  const sync_down = async () => {
    APP.notify('GLOBAL.SYNC_IN_PROGRESS');
    // down_sync();
    full_sync();
    APP.notify('GLOBAL.SYNC_COMPLETED');
  };

  return (
    <Login
      onLoginSuccess={async () => {
        await sync_down();
        //APP.route_to_path('/modules/engage/screens/Index');
        router.push('/(drawer)/(tabs)/engage');
      }}
      onForgotPassword={() => {
        //APP.route_to_path('/modules/auth/screens/ForgotPasswordScreen');
        router.push('/modules/auth/screens/ForgotPasswordScreen');
      }}
      onRegister={() => {
        //APP.route_to_path('/modules/auth/screens/RegisterScreen');
        router.push('/modules/auth/screens/RegisterScreen');
      }}
      appName={app_name}
      clientLogo={
        <Image
          style={{
            borderRadius: 50,
          }}
          source={{ uri: settings.logoUri }}
          height={40}
          width={40}
        />
      }
      bannerLogo={
        <Image
          source={require('../../../assets/images/pp4.jpg')}
          // source={{ uri: "https://picsum.photos/200/300" }}
          style={{
            height: 120,
            width: 120,
            transform: [
              {
                rotate: '-5deg',
              },
            ],
          }}
          resizeMode="cover"
        />
      }
    />
  );
};

export default LoginScreen;
