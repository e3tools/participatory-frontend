import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP } from 'common'; 

const NoInternetBanner = () => {
  return (
    <View style={{ backgroundColor: 'blue', borderWidth: 2 }}>
      <Animated.View style={{ backgroundColor: 'red' }}>
        <Text style={styles.text}>{APP._('GLOBAL.OFFLINE_STATUS')}</Text>
        <StatusBar />
      </Animated.View>
    </View>
  );
};

export default NoInternetBanner;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    backgroundColor: 'red',
    padding: 5,
    paddingLeft: 10,
    position: 'absolute',
    top: 0,
    zIndex: 100,
  },
  text: {
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
  },
});
