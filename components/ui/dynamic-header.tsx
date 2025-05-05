import { Animated, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function DynamicHeader() {
  return (
    <Animated.View style={[
        styles.header, {
            height: 
        }
    ]}>
      <Text>Dynamic Header</Text>
    </Animated.View>
  )
} 

const styles = StyleSheet.create({
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        right: 0,
        paddingTop: 10
    }
})