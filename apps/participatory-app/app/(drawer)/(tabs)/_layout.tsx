import React from 'react';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { APP } from 'common';
import AppThemeProvider from '../../providers/app-theme-provider';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ConnectivityProvider from '../../providers/connectivity-provider'; 
import { persistor, store } from '../../state/store'; 

const TabLayout = () => {
  return (
    <AppThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConnectivityProvider>
            <Tabs
              screenOptions={{
                headerShown: true,
                headerLeft: () => <DrawerToggleButton />,
              }}
            >
              <Tabs.Screen
                name="engage"
                options={{
                  headerTitle: APP._('MAIN_LAYOUT.NAVIGATOR.ENGAGEMENTS'),
                  title: APP._('MAIN_LAYOUT.NAVIGATOR.ENGAGEMENTS'),
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons
                      name="account-voice"
                      size={24}
                      color={color}
                    />
                  ),
                }}
              />
              <Tabs.Screen
                name="diagnostics"
                options={{
                  headerTitle: APP._('MAIN_LAYOUT.NAVIGATOR.DIAGNOSTICS_TITLE'),
                  title: APP._('MAIN_LAYOUT.NAVIGATOR.DIAGNOSTICS_TITLE'),
                  tabBarIcon: ({ color }) => (
                    <MaterialIcons
                      name="troubleshoot"
                      size={24}
                      color={color}
                    />
                  ),
                }}
              />
              <Tabs.Screen
                name="settings"
                options={{
                  headerTitle: APP._('MAIN_LAYOUT.NAVIGATOR.SETTINGS_TITLE'),
                  title: APP._('MAIN_LAYOUT.NAVIGATOR.SETTINGS_TITLE'),
                  tabBarIcon: ({ color }) => (
                    <Feather name="settings" size={24} color={color} />
                  ),
                }}
              />
            </Tabs>
          </ConnectivityProvider>
        </PersistGate>
      </Provider>
    </AppThemeProvider>
  );
};

export default TabLayout;
