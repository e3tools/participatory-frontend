import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

export default function AppLoader({ loading_text }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} style={{ flex: 1 }} size={40} />
      {/* <Text style={{ flex: 1 }}>{loading_text}</Text> */}
    </View>
  )
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center', 
  }
})