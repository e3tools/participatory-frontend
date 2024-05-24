import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context' 
import { useNavigation, useRouter } from 'expo-router'
import { APP } from '../utils/app'
import { AuthService } from '../modules/auth/services/auth'
import { useAuth } from '../contexts/auth'
import { Button } from 'react-native'
import WebView from 'react-native-webview'
import MediaHandler from '../components/media/media_handler'
import { upload_audio, upload_image } from '../utils/media'

const HomeScreen = () => {
    const navigation = useNavigation(); 
    const router = useRouter();
    const auth = useAuth();
    const [show_media_handler, set_show_media_handler] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }} key={APP.generate_random_string()}>
        <ScrollView>
            {/* <Button title="Attach file" onPress={() => set_show_media_handler(true)} />   */}
            <MediaHandler send_image_handler={upload_image} 
                          send_audio_handler={upload_audio}
                          visible={show_media_handler}
                          on_dismiss={()=>{
                            set_show_media_handler(false)
                          }} />
            <View style={styles.logo_container}>
                <Image 
                    source={require('../assets/images/pp4.jpg')}
                    style={styles.logo}
                    resizeMode='cover'
                />
            </View>

            {/* <WebView source={{ uri: 'https://whe.acaciadata.com/query/?lon=38.935546875&lat=2.8113711933311403' }} style={{ display: 'flex', backgroundColor: theme.colors.error , height: 50}} /> */}

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.app_name_container}>
                        <Text style={styles.app_name}>Engage{String.fromCodePoint(8482)}</Text>
                    </View>
                    <Text style={styles.title}>
                        {/* Enhance citizen engagement {'\n'} */}
                        Enhance citizen engagement
                        {/* <View style={styles.app_name_container}>
                            <Text style={styles.app_name}>Engage{String.fromCodePoint(8482)}</Text>
                        </View> */}
                    </Text>
                    <Text style={styles.message}>
                        Under key tenets of inform, consult, involve, Collaborate & Empower
                    </Text>
                </View>
                
                {/* <View>
                    <View><Text>{`Counter: ${auth.counter}`}</Text></View> 
                    <Button title='Increment' onPress={auth.increment} />
                </View> */}
    
                <TouchableOpacity style={styles.button} onPress={async () => {
                    if(auth.is_authenticated){ 
                        APP.route_to_path('modules/engage/screens/engage_index_screen', {}, {});
                    } else { 
                        APP.route_to_path('modules/auth/screens/login_screen', {}, {});
                    }
                }}>
                    <Text style={styles.button_text}>Let's go</Text>
                </TouchableOpacity>

                <Text style={styles.powered_by}>
                    {String.fromCodePoint(169)}World Bank 2024
                </Text>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    content: {
        padding: 24,
        justifyContent: 'space-between',
        flex: 1
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
        fontWeight: '500'
    },
    logo_container: {
        backgroundColor: '#d8dffe',
        padding: 16,
        borderRadius: 16,
        margin: 12,
        height: 300
    },
    logo: {
        width: '100%',
        height: '100%'
    },
    app_name_container: {
        backgroundColor: '#fff2dd',
        paddingHorizontal: 6,
        width: 140,
        alignSelf: 'center',
        paddingVertical: 10,
        transform: [
            {
                rotate: '-5deg'
            }
        ]
    },
    app_name: {
        fontSize: 28,
        fontWeight: '700'
    },
    button: {
        backgroundColor: '#56409e',
        paddingVertical: 12,
        paddingHorizontal: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12
    },
    button_text: {
        fontSize: 15,
        fontWeight: '500',
        color: '#fff'
    },
    powered_by: {
        textAlign: 'center',
        color: 'gray',
        fontWeight: '500'
    }
})