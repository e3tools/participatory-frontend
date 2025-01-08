import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import DrawerMenu from './components/navigation/drawer-menu';
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';
import { /*SafeAreaView*/ useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { AuthProvider, useAuth } from 'auth/contexts/auth';
import { ping } from 'data-layer/utils/db';

import AppHeader from './components/navigation/app-header';
// import { APP } from 'common';
import ConnectivityProvider from './providers/connectivity-provider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store, persistor } from './state/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useCustomTheme } from './hooks/useCustomTheme';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
} from '@react-navigation/native';
import Colors from './constants/Colors';
import { APP } from 'common';

// // First, create the adapter to the underlying database:
// const adapter = new SQLiteAdapter({
//   schema,
//   // (You might want to comment it out for development purposes -- see Migrations documentation)
//   migrations,
//   // (optional database name or file system path)
//   // dbName: 'myapp',
//   // (recommended option, should work flawlessly out of the box on iOS. On Android,
//   // additional installation steps have to be taken - disable if you run into issues...)
//   jsi: false, // true, /* Platform.OS === 'ios' */
//   // (optional, but you should implement this method)
//   onSetUpError: error => {
//     // Database failed to load -- offer the user to reload the app or log out
//     console.warn(error)
//   }
// })

// // Then, make a Watermelon database from it!
// const database = new Database({
//   adapter,
//   modelClasses: [
//     // Post, // ⬅️ You'll add Models to Watermelon here
//   ],
// })

// const customLightTheme = { ...MD3LightTheme, colors: Colors.light };
// const customDarkThene = { ...MD3DarkTheme, colors: Colors.dark };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationLightTheme,
  reactNavigationDark: NavigationDarkTheme,
});

// const CombinedLightTheme = merge(LightTheme, customLightTheme);
//const CombinedDarkTheme = merge(DarkTheme, customDarkThene);

const CombinedLightTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    ...Colors.light,
  },
};

const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    ...Colors.dark,
  },
};

export default function Layout() {
  const auth = useAuth();
  const [header_shown, set_header_shown] = useState(false);
  const [root_key, set_root_key] = useState(APP.generate_random_string());
  const { colorScheme } = useCustomTheme();

  const paperTheme =
    colorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;

  // const isAuthenticated = useAuthSelector(
  //   (state) => state.user.isAuthenticated,
  // );

  useEffect(() => {
    set_header_shown(auth.is_authenticated);
  }, [auth.is_authenticated]);

  useEffect(() => {
    ping();
  }, []);

  /**
   * This will reset the root component key to force a re-render of all components
   * when the language has been switched
   */
  const reset_root_key = () => {
    const key = APP.generate_random_string();
    set_root_key(key);
  };

  // return (
  //   <SafeAreaProvider>
  //      <ConnectivityProvider>
  //       <Text>Sample test</Text>
  //      </ConnectivityProvider>
  // </SafeAreaProvider>
  // )LNE191657
  return (
    <PaperProvider theme={paperTheme /*theme*/}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
              <ConnectivityProvider>
                <AuthProvider>
                  <Drawer
                    key={root_key}
                    screenOptions={{
                      headerShown: header_shown, // authenticated,
                      headerStyle: {
                        // backgroundColor: theme.colors.primary,
                        // height: 60
                      },
                      headerTitleStyle: {
                        fontSize: 20,
                        // color: '#fff',
                        fontWeight: '700',
                        alignContent: 'center',
                        textAlign: 'center',
                      },
                      drawerLabelStyle: {
                        marginLeft: -50,
                        textAlign: 'center',
                        fontSize: 40,
                      },
                      // headerRight: () => <IconButton icon='camera' />
                      headerRight: () => (
                        <Provider store={store}>
                          <AppHeader
                            reset_root_key_func={reset_root_key}
                          ></AppHeader>
                        </Provider>
                      ),
                    }}
                    drawerContent={(props) => <DrawerMenu {...props} />}
                    initialRouteName="modules/engage/screens/EngageIndexScreen"
                  >
                    <Drawer.Screen
                      name="index"
                      options={{
                        drawerLabel: 'Home',
                        title: `Engage${String.fromCodePoint(8482)}`, // 'Engage&trade;',
                        drawerIcon: ({ size, color }) => (
                          <Ionicons name="home" size={size} color={color} />
                        ),
                      }}
                    />
                  </Drawer>
                </AuthProvider>
              </ConnectivityProvider>
            </SafeAreaView>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    </PaperProvider>
  );
}
