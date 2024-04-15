import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { Children } from 'react'
import { ScrollView } from 'react-native-gesture-handler'

type APPContainerProps = {
    children: React.ReactNode
}

const {width, height} = Dimensions.get("window");
const AppContainer = (props: APPContainerProps) => {
  return (
    <ScrollView style={{ flexGrow: 1, maxHeight: height * 0.70 }} > 
        {props.children} 
    </ScrollView>
  )
}

export default AppContainer

const styles = StyleSheet.create({})