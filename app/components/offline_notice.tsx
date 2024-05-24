import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNetInfo } from '@react-native-community/netinfo';

const OfflineNotice = () => {
  const netinfo = useNetInfo();
  if(netinfo.type !== 'unknown' && netinfo.isInternetReachable === false){   
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../assets/images/stats.png')}
        />
        <Text style={styles.text}>No internet connection</Text>
      </View>
    )
  }
}

export default OfflineNotice

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    zIndex: 1
  },
  image: {
    height: 500,
    width: 500
  },
  text: {
    fontSize: 25
  }
})