import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

type ILegendItem = {
    label: string,
    color: string,
    expression: string
}

type ILegendItemProps = {
    item: ILegendItem
}

type ILegendProps = {
    items: Array<ILegendItem>
}

const MapLegendItem = (props: ILegendItemProps) => { 
  return (
    <View style={styles.item_container}>
        <View style={[styles.color, { backgroundColor: props.item?.color }]}></View>
        <View style={styles.label}><Text>{props.item?.label}</Text></View>      
    </View>
  )
}
  
const MapLegend = (props: ILegendProps) => { 
  return (
    <ScrollView style2={{backgroundColor: 'red'}} contentContainerStyle={styles.dummy_parent}>
      {/* <View style={{backgroundColor: 'blue', width: 200, height: 60}}><Text>1.</Text></View>
      <View style={{backgroundColor: 'yellow', width: 200, height: 60}}><Text>2</Text></View>
      <View style={{backgroundColor: 'green', width: 200, height: 60}}><Text>3</Text></View>
      <View style={{backgroundColor: 'orange', width: 200, height: 60}}><Text>4</Text></View>
      <View style={{backgroundColor: 'yellow', width: 200, height: 60}}><Text>5</Text></View>
      <View style={{backgroundColor: 'green', width: 200, height: 60}}><Text>6</Text></View>
      <View style={{backgroundColor: 'orange', width: 200, height: 60}}><Text>7</Text></View> */}
      {
        props?.items?.map((el, idx) => {
            // return <MapLegendItem item={el} />
            return <View key={idx}><Text>{el.label}</Text></View>
        })
      }
    </ScrollView>
  )
}

export default MapLegend

const styles = StyleSheet.create({
    legend_container: {
        // display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        height: 200,
        flex: 1,
        flexGrow: 1,
        overflow: 'visible'
        // alignContent: 'flex-start',
        // justifyContent: 'flex-start'
    },
    dummy_parent:{
      display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'flex-start', 
        flexGrow: 1, 
        height: 200,
        width: 300,
        overflow: 'visible'
    },
    item_container: {
        // display: 'flex',
        // flexDirection: 'row',
        width: 300
    },
    color: {
        flexBasis: 100
    },
    label: {
        flex: 1
    },
    dummy: {

    }
})