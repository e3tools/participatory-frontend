import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNetInfo } from '@react-native-community/netinfo';
import { APP } from '../utils/app';
import { DB } from '../utils/db';

const OnlineStatus = () => {
  const [is_online, set_is_online] = useState(false);
  useEffect(()=>{
    const load = async()=> {
      const res = await DB.is_online();
      set_is_online(res);
    }
    load();
  }, [])
  const netinfo = useNetInfo();
  // if(netinfo.type !== 'unknown' && netinfo.isInternetReachable === false){   
  if(!is_online){
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../assets/images/offline.png')}
        />
        <Text style={styles.text}>{APP._("GLOBAL.OFFLINE_STATUS")}</Text>
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../assets/images/online.png')}
        />
        <Text>{APP._("GLOBAL.ONLINE_STATUS")}</Text>
      </View>
    )
  }
}

export default OnlineStatus

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    zIndex: 1
  },
  image: {
    height: 100,
    width: 100
  },
  text: {
    fontSize: 15, 
  }
})