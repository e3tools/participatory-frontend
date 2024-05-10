import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { string } from 'yup'

type Props = {
  loading_text?: string
}

export default function AppLoader(props: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} size={40} {...props} />
      {/* <Text style={{ flex: 1 }}>{loading_text}</Text> */}
    </View>
  )
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    flex: 1
  }
})