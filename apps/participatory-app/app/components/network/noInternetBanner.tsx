import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NoInternetBanner = () => {
  return (
    <Animated.View style={[styles.container]}>
        <StatusBar />
        <Text style={styles.text}>
        No internet connection
        </Text>
    </Animated.View>
  )
}

export default NoInternetBanner

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 40,
        backgroundColor: 'red',
        padding: 5,
        paddingLeft: 10,
        position: 'absolute',
        top: 0,
        zIndex: 100
    },
    text: {
        fontSize: 17,
        color: '#fff',
        textAlign: 'center'
    }
})