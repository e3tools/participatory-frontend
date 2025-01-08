import { Dimensions, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type APPContainerProps = {
    children: React.ReactNode
}

const {width, height} = Dimensions.get("window");

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const AppContainer = (props: APPContainerProps) => {
  return ( 
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView>
      {/* <ScrollView style={{ flex:1, flexGrow: 1, maxHeight: height * 0.70 }} >  */}
        <ScrollView style={{ height: windowHeight - 150 }}> 
          {props.children} 
        </ScrollView>
      {/* </ScrollView> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default AppContainer

const styles = StyleSheet.create({})