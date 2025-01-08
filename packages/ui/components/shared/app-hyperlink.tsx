import { View, StyleSheet } from 'react-native'
import React from 'react' 
import { Button, Text } from 'react-native-paper';

export function AppHyperLink({ label, onPress, href, style=null}) { 
  return (
      <Button mode='text' onPress={onPress} style={style}>
        <Text style={styles.link_text}>{label}</Text>        
      </Button>
  )
}

const styles = StyleSheet.create({
  link: {
    // color: 'blue',
    flexWrap: 'nowrap',
    textDecorationLine: 'underline', 
  },
  link_text: {
    textDecorationLine: 'underline',
    paddingRight: 10,
    marginLeft: 0
  }
})