import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '@/app/core/theme'

type FieldLabelProps = {
  label: string,
  reqd: boolean,
  hidden: boolean
}
const FieldLabel = (props: FieldLabelProps) => {
  return (
      props.label && 
      <Text style={[styles.label, { display: props.hidden ? 'none': 'flex' }]}>
        {props.label}
        { 
          props.reqd ? <Text style={[styles.reqd, { display: props.reqd ? 'flex': 'none' }]}> *</Text> : null
        }        
      </Text>
  )
}

export default FieldLabel

const styles = StyleSheet.create({
  label: {
    // fontSize: 14,
    marginTop: 5,
    marginLeft: 5
  },
  reqd: {
    color: theme.colors.error
  }
})