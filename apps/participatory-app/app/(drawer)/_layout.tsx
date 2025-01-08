import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import Drawer from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import Foundation from '@expo/vector-icons/Foundation';
import { router, usePathname } from 'expo-router';
import { APP } from 'common';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { logout } from 'auth/state/user/userSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ConnectivityProvider from '../providers/connectivity-provider';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from '../state/store';
import AppThemeProvider from '../providers/app-theme-provider';
import AuthProvider from '../providers/auth-provider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { List } from 'react-native-paper';
import { getDashboards } from '../state/dashboard/actions/dashboard.action';
import { setCurrentDashboard } from '../state/dashboard/dashboardSlice';
import { Dashboard } from '../state/state.types';

type iconTypes =
  | typeof MaterialCommunityIcons
  | typeof Feather
  | typeof MaterialIcons;

interface DrawerItemProps {
  label: string;
  path: string;
  iconType: iconTypes;
  iconName: string;
  onPress: () => void;
}

const CustomDrawerComponent = (props) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const bottom = useSafeAreaInsets();
  const dashboards = useAppSelector((state) => state.dashboard.dashboards);

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  useEffect(() => {
    dispatch(getDashboards());
  }, [dispatch]);

  const getIconColor = (path: string) => {
    return path === pathname ? '#fff' : '#000';
  };

  const getBackgroundColor = (path: string) => {
    return path === pathname ? '#332' : '#fff';
  };

  const getItemColors = (path: string) => {
    const iconColor = path === pathname ? '#fff' : '#000';
    const labelColor = path === pathname ? '#fff' : '#000';
    const backgroundColor = path === pathname ? '#332' : '#fff';
    return { iconColor, labelColor, backgroundColor };
  };

  //    const CustomIcon = ({
  //      iconType,
  //      iconName,
  //      size,
  //    }: {
  //      iconType: iconTypes;
  //      iconName: string;
  //      size: number;
  //    }) => {
  //      if (iconType === MaterialCommunityIcons) {
  //        return (
  //          <MaterialCommunityIcons
  //            name={iconName}
  //            size={size}
  //            color={getItemColors(itemPathName).iconColor}
  //          />
  //        );
  //      }
  //      if (iconType === MaterialCommunityIcons) {
  //        return (
  //          <MaterialCommunityIcons
  //            name={iconName}
  //            size={size}
  //            color={getItemColors(itemPathName).iconColor}
  //          />
  //        );
  //      }
  //      if (iconType === MaterialCommunityIcons) {
  //        return (
  //          <MaterialCommunityIcons
  //            name="account-voice"
  //            size={size}
  //            color={getItemColors(itemPathName).iconColor}
  //          />
  //        );
  //      }
  //    };

  //    const CustomDrawerItem = (props: DrawerItemProps) => {
  //     const itemPathName = '/' + props.path.split('/').pop();
  //     return (
  //      <DrawerItem
  //        label={props.label}
  //        labelStyle={[
  //          styles.navItemLabel,
  //          { color: getItemColors(itemPathName).labelColor },
  //        ]}
  //        style={{
  //          backgroundColor: getItemColors(itemPathName).backgroundColor,
  //        }}
  //        icon={({ color, size }) => {

  //        }}
  //        onPress={() => {
  //          props.onPress();
  //        }}
  //      />)
  //    };

  return (
    <DrawerContentScrollView {...props}>
      {/* <CustomDrawerItem
        label="Test"
        path="/(drawer)/(tabs)/engage"
        onPress={() => router.push('/(drawer)/(tabs)/engage')}
        iconType={MaterialCommunityIcons}
        iconName={'account-voice'}
        // icon={({ color, size }) => (
        //   <MaterialCommunityIcons
        //     name="account-voice"
        //     size={size}
        //     color={getItemColors('/engage').iconColor}
        //   />
        //)}
      /> */}
      <View style={styles.logoWrapper}>
        <View>
          <Image
            source={require('../assets/images/logoipsum.png')}
            width={35}
            height={35}
            style={styles.logoImg}
            resizeMode="stretch"
          />
        </View>
        <View style={styles.countyWrapper}>
          <Text style={styles.countyName}>Makueni County</Text>
          <Text style={styles.countySlogan}>Making Makueni</Text>
        </View>
      </View>
      <DrawerItem
        label={APP._('MAIN_LAYOUT.NAVIGATOR.HOME')}
        labelStyle={[
          styles.navItemLabel,
          { color: getItemColors('/home').labelColor },
        ]}
        style={{ backgroundColor: getItemColors('/home').backgroundColor }}
        icon={({ color, size }) => (
          <MaterialCommunityIcons
            name="home"
            size={size}
            color={getItemColors('/home').iconColor}
          />
        )}
        onPress={() => {
          router.push('/screens/OnboardingScreen');
        }}
      />
      <DrawerItem
        label={APP._('MAIN_LAYOUT.NAVIGATOR.ENGAGEMENTS')}
        labelStyle={[
          styles.navItemLabel,
          { color: getItemColors('/engage').labelColor },
        ]}
        style={{ backgroundColor: getItemColors('/engage').backgroundColor }}
        icon={({ color, size }) => (
          <MaterialCommunityIcons
            name="account-voice"
            size={size}
            color={getItemColors('/engage').iconColor}
          />
        )}
        onPress={() => {
          router.push('/(drawer)/(tabs)/engage');
        }}
      />
      {/* Dashboards */}
      <List.Accordion
        title={APP._('MAIN_LAYOUT.NAVIGATOR.DASHBOARD')}
        left={(props) => <List.Icon {...props} icon="view-dashboard" />}
      >
        {dashboards?.map((item) => (
          <List.Item
            key={item.name}
            title={item.name}
            left={(props) => <List.Icon {...props} icon="monitor-dashboard" />}
            style={styles.drawer_child}
            onPress={async () => {
              const dashboard: Dashboard = {
                name: item.name,
                creation: item.creation,
                charts: [],
              } as Dashboard;
              dispatch(setCurrentDashboard(dashboard));
              router.push('/(drawer)/dashboard');
               /*
              APP.navigateToPath(
                props.navigation,
                'modules/reporting/dashboard/screens/[id]',
                { id: item.name },
              );*/
              // APP.route_to_path('screens/dashboard/[id]', {
              //       id: item.name
              //     }
              //   )
            }}
            onLongPress={() => {}}
          />
        ))}
      </List.Accordion>

      <DrawerItem
        label={APP._('MAIN_LAYOUT.NAVIGATOR.DIAGNOSTICS_TITLE')}
        labelStyle={[
          styles.navItemLabel,
          { color: getItemColors('/diagnostics').labelColor },
        ]}
        style={{
          backgroundColor: getItemColors('/diagnostics').backgroundColor,
        }}
        icon={({ color, size }) => (
          <MaterialIcons
            name="troubleshoot"
            size={size}
            color={getItemColors('/diagnostics').iconColor}
          />
        )}
        onPress={() => {
          router.push('/(drawer)/(tabs)/diagnostics');
        }}
      />
      <DrawerItem
        label={APP._('MAIN_LAYOUT.NAVIGATOR.MY_SUBMISSIONS_TITLE')}
        labelStyle={[
          styles.navItemLabel,
          { color: getItemColors('/submissions').labelColor },
        ]}
        style={{
          backgroundColor: getItemColors('/submissions').backgroundColor,
        }}
        icon={({ color, size }) => (
          <Foundation
            name="graph-bar"
            size={size}
            color={getItemColors('/submissions').iconColor}
          />
        )}
        onPress={() => {
          router.push('/(drawer)/submissions');
        }}
      />
      <DrawerItem
        label={APP._('MAIN_LAYOUT.NAVIGATOR.SETTINGS_TITLE')}
        labelStyle={[
          styles.navItemLabel,
          { color: getItemColors('/settings').labelColor },
        ]}
        style={{
          backgroundColor: getItemColors('/settings').backgroundColor,
        }}
        icon={({ color, size }) => (
          <Feather
            name="settings"
            size={size}
            color={getItemColors('/settings').iconColor}
          />
        )}
        onPress={() => {
          router.push('/(drawer)/(tabs)/settings');
        }}
      />
      <DrawerItem
        label={APP._('MAIN_LAYOUT.NAVIGATOR.USER_PROFILE')}
        labelStyle={[
          styles.navItemLabel,
          { color: getItemColors('/user-profile').labelColor },
        ]}
        style={{
          backgroundColor: getItemColors('/user-profile').backgroundColor,
        }}
        icon={({ color, size }) => (
          <Feather
            name="user"
            size={size}
            color={getItemColors('/user-profile').iconColor}
          />
        )}
        onPress={() => {
          router.push('/modules/auth/screens/UserProfileScreen');
        }}
      />
      <DrawerItem
        label={APP._('MAIN_LAYOUT.HEADER.LOGOUT')}
        labelStyle={[
          styles.navItemLabel,
          { color: getItemColors('/logout').labelColor },
        ]}
        style={{
          backgroundColor: getItemColors('/logout').backgroundColor,
          paddingBottom: bottom.bottom + 10,
        }}
        icon={({ color, size }) => (
          <MaterialCommunityIcons
            name="logout"
            size={size}
            color={getItemColors('/settings').iconColor}
          />
        )}
        onPress={() => {
          const res = dispatch(logout());
          console.log('Logged out...', res);
          router.push('/screens/OnboardingScreen');
        }}
      />
    </DrawerContentScrollView>
  );
};

const _layout = () => {
  return (
    <AppThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <ConnectivityProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Drawer
                  drawerContent={(props) => (
                    <CustomDrawerComponent {...props} />
                  )}
                  screenOptions={{
                    headerShadowVisible: false,
                    headerShown: false,
                  }}
                >
                  <Drawer.Screen
                    name="submissions"
                    options={{
                      headerShown: true,
                      title: APP._('SUBMISSIONS_PAGE.SUBMISSIONS'),
                    }}
                  />
                  <Drawer.Screen
                    name="dashboard"
                    options={{
                      headerShown: true,
                      title: APP._('DASHBOARD_PAGE.TITLE'),
                    }}
                  />
                </Drawer>
              </GestureHandlerRootView>
            </ConnectivityProvider>
          </AuthProvider>
        </PersistGate>
      </Provider>
    </AppThemeProvider>
  );
};

export default _layout;

const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 16,
  },
  logoImg: {
    borderRadius: 35,
  },
  logoWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    // paddingVertical: 20,
    borderRadius: 40,
  },
  countyWrapper: {
    // marginTop: 25,
    marginLeft: 10,
  },
  countyName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  countySlogan: {
    textDecorationLine: 'underline',
    fontStyle: 'italic',
    fontSize: 16,
  },
  drawer_child: {
    marginLeft: 20,
  },
});
