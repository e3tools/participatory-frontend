import { Dimensions, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { Children } from 'react'
import { ScrollView } from 'react-native'

type APPContainerProps = {
    children: React.ReactNode
}

const {width, height} = Dimensions.get("window");
const AppContainer = (props: APPContainerProps) => {
  return (
    // <SafeAreaView>
    //    {props.children} 
    // </SafeAreaView>
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView>
      {/* <ScrollView style={{ flex:1, flexGrow: 1, maxHeight: height * 0.70 }} >  */}
          {props.children} 
      {/* </ScrollView> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default AppContainer

const styles = StyleSheet.create({})