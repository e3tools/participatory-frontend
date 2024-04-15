import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import Ionicons from '@expo/vector-icons/Ionicons'; 
import DrawerMenu from "./components/navigation/drawer_menu";
import { PaperProvider } from 'react-native-paper';
import LoginScreen from "./modules/auth/screens/login_screen";
import UserProfileScreen from "./modules/auth/screens/user_profile_screen";
import { AuthService } from "./modules/auth/services/auth";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { Dashboard } from './screens'
import { theme } from "./core/theme";
import { SafeAreaView } from "react-native";

export default function Layout() {
  const [authenticated, set_authenticated] = useState(false);
  useEffect(() => {
    const load = async () => {
      const res = await AuthService.is_authenticated();
      set_authenticated(res)
    }
    load();
    console.log("in layout")
  }, []);
  // const screens = [
  //   <Drawer.Screen name="Dashboard" component={Dashboard} />
  // ]

  return (
    <PaperProvider theme={theme}>
     
      <GestureHandlerRootView style={{ flex: 1 }}>
         <SafeAreaView style={{ flex: 1 }}>
          <Drawer
          screenOptions={{
            headerShown: true,// authenticated,
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
              fontSize: 40
            }, 
          }}
          drawerContent={DrawerMenu}        
          initialRouteName="modules/engage/screens/engage_index_screen"
        >  
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: 'Home',
              title: `Engage${String.fromCodePoint(8482)}`, // 'Engage&trade;',
              drawerIcon: ({size, color}) => (
                <Ionicons name="home" size={size} color={color} />
              )
            }}
          /> 
          {/* <Drawer.Screen
            name="map"
            options={{
              drawerLabel: 'Map',
              title: 'Map Diagnostics',
              drawerIcon: ({size, color}) => (
                <Ionicons name="information-circle" size={size} color={color} />
              )
            }}
          /> */}
        </Drawer> 
        { 
        // authenticated ? (
        //     <Drawer
        //       screenOptions={{
        //         drawerLabelStyle: {
        //           marginLeft: -20
        //         }
        //       }}
        //       drawerContent={DrawerMenu}          
        //     >
        //       <Drawer.Screen
        //         name="index"
        //         options={{
        //           drawerLabel: 'Home',
        //           title: 'Engage&trade;',
        //           drawerIcon: ({size, color}) => (
        //             <Ionicons name="home" size={size} color={color} />
        //           )
        //         }}
        //       /> 
        //       {/* <Drawer.Screen
        //         name="map"
        //         options={{
        //           drawerLabel: 'Map',
        //           title: 'Map Diagnostics',
        //           drawerIcon: ({size, color}) => (
        //             <Ionicons name="information-circle" size={size} color={color} />
        //           )
        //         }}
        //       /> */}
        //     </Drawer> 
        //   ) : (
        //     // <UserProfileScreen />
        //     <LoginScreen /> 
        //   )
        } 
        </SafeAreaView>
      </GestureHandlerRootView> 
    </PaperProvider>
  )
}