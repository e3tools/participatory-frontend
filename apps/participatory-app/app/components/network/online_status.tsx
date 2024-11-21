import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { APP } from 'common';

const OnlineStatus = ({ isOnline }: { isOnline: boolean }) => {
  const [is_online, set_is_online] = useState(isOnline);
  
  useEffect(()=>{
    set_is_online(isOnline);
  }, [isOnline]);

  if(!is_online){
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../../assets/images/offline.png')}
        />
        <Text style={styles.text}>{APP._("GLOBAL.OFFLINE_STATUS")}</Text>
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../../assets/images/online.png')}
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