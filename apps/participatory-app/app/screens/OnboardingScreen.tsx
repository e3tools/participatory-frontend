import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  downloadLogo,
  getSettings,
} from '../state/settings/actions/settings.action';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useNavigation } from 'expo-router';
import { APP } from 'common';
import AppLoader from 'ui/components/shared/app-loader';

const OnboardingScreen = (/*{ navigation }*/) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings.settings);
  const loading = useAppSelector((state) => state.settings.loading);
  const isAuthenticated = useAppSelector(
    (state) => state.user?.isAuthenticated,
  );

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings?.logo) {
      const url = `${process.env.EXPO_PUBLIC_BACKEND}${settings.logo}`;
      dispatch(downloadLogo(url));
    }
  }, [dispatch, settings]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: '' });
  }, [navigation]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
        <AppLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.logoWrapper}>
        <Image
          style={styles.logo}
          source={{ uri: settings?.logoUri }}
          height={40}
          width={40}
        />
        <View style={styles.countyDetailsWrapper}>
          <Text style={styles.countyName}>{settings?.county_name}</Text>
          <Text style={styles.countySlogan}>{settings?.county_slogan}</Text>
        </View>
      </View>

      <View style={styles.app_name_container}>
        <Text style={styles.app_name}>
          {settings?.app_name}
          {String.fromCodePoint(8482)}
        </Text>
      </View>
      <View style={styles.logo_container}>
        <Image
          source={require('../assets/images/pp4.jpg')}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{settings?.app_slogan}</Text>
          <Text style={styles.message}>{settings?.app_introduction}</Text>
        </View>

        {/* <View>
                    <View><Text>{`Counter: ${auth.counter}`}</Text></View> 
                    <Button title='Increment' onPress={auth.increment} />
                </View> */}

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            if (isAuthenticated === true /*auth.is_authenticated*/) {
              router.push('/(drawer)/(tabs)/engage');
              // navigation.navigate('(drawer)/favorites', {});
              // APP.route_to_path(
              //   'modules/engage/screens/EngageIndexScreen',
              //   {},
              //   {},
              // );
            } else {
              APP.route_to_path(
                'modules/auth/screens/LoginScreen',
                {
                  app_name: settings?.app_name,
                  logo_path: '../assets/images/pp4.jpg',
                },
                {
                  app_name: settings?.app_name,
                  logo_path: '../assets/images/pp4.jpg',
                },
              );
            }
          }}
        >
          <Text style={styles.button_text}>Let's go</Text>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.powered_by}>
          {/* {String.fromCodePoint(169)}World Bank 2024 */}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  content: {
    padding: 24,
    justifyContent: 'space-between',
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    lineHeight: 40,
    fontWeight: '500',
    color: '#281b52',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
    color: '#9992a7',
    textAlign: 'center',
  },
  message_title: {
    fontWeight: '500',
  },
  logo_container: {
    backgroundColor: '#d8dffe',
    padding: 16,
    borderRadius: 16,
    margin: 12,
    height: 300,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  app_name_container: {
    backgroundColor: '#fff2dd',
    paddingHorizontal: 6,
    width: 140,
    alignSelf: 'center',
    paddingVertical: 10,
    transform: [
      {
        rotate: '-5deg',
      },
    ],
  },
  app_name: {
    fontSize: 28,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#56409e',
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    flexDirection: 'row',
  },
  button_text: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
  },
  powered_by: {
    textAlign: 'center',
    color: 'gray',
    fontWeight: '500',
  },
  logoWrapper: {
    // flex: 1,
    alignItems: 'center',
    backgroundColor: '#eee',
    flexDirection: 'row',
    height: 59,
    paddingLeft: 20,
  },
  logo: {
    padding: 5,
  },
  countyDetailsWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
  },
  countyName: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  countySlogan: {
    textDecorationLine: 'underline',
    fontStyle: 'italic',
  },
});

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    // flexDirection: 'column',
  },
  logoWrapper: {
    // flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    height: 59,
  },
  logo: {
    padding: 5,
  },
  countyDetailsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  countyName: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  countySlogan: {
    textDecorationLine: 'underline',
    fontStyle: 'italic',
  },
  appName: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  intro: {
    padding: 10,
  },
  buttonWrapper: {
    flexDirection: 'row',
    padding: 20,
    width: '90%',
    borderRadius: 10,
    marginBottom: 50,
    justifyContent: 'space-between',
    backgroundColor: '#56409e',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    lineHeight: 40,
    fontWeight: '500',
    color: '#281b52',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
    color: '#9992a7',
    textAlign: 'center',
  },
});
