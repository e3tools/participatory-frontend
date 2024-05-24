import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ISectionBreakProps } from '@/app/interfaces/inputs'
import FieldLabel from './field_label'
import { Divider } from 'react-native-paper'
 
const SectionBreak = (props: ISectionBreakProps) => { 
  return ( 
    <View>
        <Divider bold />
        <FieldLabel {...props} /> 
    </View>
      
  )
}

export default SectionBreak

const styles = StyleSheet.create({})