import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import Ionicons from '@expo/vector-icons/Ionicons'; 
import DrawerMenu from "./components/navigation/drawer_menu";
import { PaperProvider } from 'react-native-paper'; 
import { useContext, useEffect, useLayoutEffect, useState } from "react"; 
import { theme } from "./core/theme";
import { Image, SafeAreaView, Text, TouchableOpacity } from "react-native";  
import { useNavigation } from 'expo-router'; 
import { AuthProvider, useAuth } from "./contexts/auth"; 
import { ping } from "./utils/db";

import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from "./model/schema";
import migrations from "./model/migrations";

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

export default function Layout() {
  const auth = useAuth(); 
  const [header_shown, set_header_shown] = useState(false); 
  const navigation = useNavigation();
 
  useEffect(()=> {
    set_header_shown(auth.is_authenticated); 
  }, [auth.is_authenticated])

  useEffect(()=> {
    console.log("Pinging....")
    ping();
  }, [])
 
  return (
    <PaperProvider theme={theme}>     
      <GestureHandlerRootView style={{ flex: 1 }}>
         <SafeAreaView style={{ flex: 1 }}>
            <AuthProvider>  
               <Drawer
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
                      fontSize: 40
                    }, 
                  }}
                  drawerContent={(props) => <DrawerMenu {...props} />}        
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
                </Drawer> 
            </AuthProvider>
        </SafeAreaView>
      </GestureHandlerRootView> 
    </PaperProvider>
  )
}