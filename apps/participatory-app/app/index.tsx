import React from 'react';
// // import { AuthService } from './modules/auth/services/auth';
// import App from './App';
// import LoginScreen from './modules/auth/screens/login_screen';
// import HomeScreen from './screens/home_screen';
// import EngagementIndexScreen from './modules/engage/screens/EngageIndexScreen';
// // import { AuthProvider } from './contexts/auth';
// // import Settings from './(tabs)/settings';
// import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './modules/auth/screens/LoginScreen';
import SuccessScreen from './modules/engage/screens/SuccessScreen';
import AuthProvider from './providers/auth-provider';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './state/store';
import { Text } from 'react-native';
import { View } from './components/Themed';
import AppThemeProvider from './providers/app-theme-provider';
import App from './App';
// import AppStack from './navigation/AppStack';

const index = () => {
  // const [authenticated, set_authenticated] = useState(false);
  // useEffect(() => {
  //   const load = async () => {
  //     const res = await AuthService.is_authenticated();
  //     set_authenticated(res)
  //   }
  //   load();
  // }, []);

  // console.log('Inside index');
  // return (
  //   <SafeAreaView
  //     style={{
  //       flex: 1,
  //       // height: 200
  //     }}
  //   >
  //     <Text style={{ backgroundColor: 'red' }}>SSSSS TESTE</Text>
  //   </SafeAreaView>
  // );

  return (
    // <SafeAreaView style={{ flex: 1 }}>
    //   <AppThemeProvider>
    //     <Provider store={store}>
    //       <PersistGate loading={null} persistor={persistor}>
            <OnboardingScreen />
    //       </PersistGate>
    //     </Provider>
    //   </AppThemeProvider>
    // </SafeAreaView>
  );

  return (
    <SafeAreaView /*style={{ flex: 1 }}*/>
      <PaperProvider /*theme={paperTheme}*/>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {/* <ConnectivityProvider> */}
            {/* <OnboardingScreen /> */}
            <Text>The lod</Text>
            {/* </ConnectivityProvider> */}
          </PersistGate>
        </Provider>
      </PaperProvider>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <HomeScreen /> */}
      <OnboardingScreen />
      {/* <LoginScreen /> */}
      {/* <SuccessScreen /> */}
      {/* <AuthStack /> */}
    </SafeAreaView>
    // authenticated ? <App /> : <LoginScreen />
    // <View style={{ flex: 1 }}>
    //   <Text>Index home</Text>
    //   {/* <App />
    //    */}
    //   <Suspense fallback={<div>Loading...</div>}>
    //     <App />
    //   </Suspense>
    //   <Text>Index home 2</Text>
    // </View>

    // <View>
    //   {/* <Text>Landing page3</Text> */}
    //   {/* <HomeScreen /> */}
    //   <AuthStack />
    // </View>
    // <PaperProvider>
    //   <Provider store={store}>
    //     <PersistGate loading={null} persistor={persistor}>
    //       {/* <HomeScreen />  */}
    //       <Text>Home screen loaded</Text>
    //       {/* <AppStack /> */}
    //     </PersistGate>
    //   </Provider>
    // </PaperProvider>
  );
};

export default index;
