import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';
import Colors from './constants/Colors';
import { useCustomTheme } from './hooks/useCustomTheme';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './state/store';
// import AppStack from './navigation/AppStack';
// import AuthStack from './navigation/AuthStack';
import ConnectivityProvider from './providers/connectivity-provider';
import AuthProvider from './providers/auth-provider';
import AppThemeProvider from './providers/app-theme-provider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// import our colors
// overwrite it on the current theme
const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark.colors };
const customLightTheme = { ...MD3LightTheme, colors: Colors.light.colors };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
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

export default function RootLayout() {
  //   const colorScheme = useColorScheme();
  const { colorScheme } = useCustomTheme();
  const paperTheme =
    colorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    console.log('Colorscheme:', colorScheme);
  }, [colorScheme]);

  if (!loaded) {
    return null;
  }

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <AppThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            {/* <ConnectivityProvider> */}
            {/* <AppStack /> */}
            {/* <AuthStack />  */}
            {/* <Stack
            screenOptions={
              {
                // headerStyle: {
                //   backgroundColor: 'red',
                // },
                // headerTintColor: 'white',
              }
            }
          >
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
                title: 'Home',
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack> */}
            <Stack
              screenOptions={{
                headerStyle: {
                  // backgroundColor: 'red',
                },
                headerTintColor: 'white',
                headerShown: true,
              }}
            >
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                  title: 'Engage Home',
                }}
              />
              <Stack.Screen
                name="(drawer)"
                options={{
                  headerShown: false,
                  title: 'Drawer Home',
                }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            {/* </ConnectivityProvider> */}
          </AuthProvider>
        </PersistGate>
      </Provider>
    </AppThemeProvider>
    // </ThemeProvider>
  );
}
