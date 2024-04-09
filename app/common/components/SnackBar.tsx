import { View, Text } from 'react-native'
import React from 'react'
import { Snackbar } from 'react-native-paper'
import { ISnackbarProps } from '../interfaces'

export default function AppSnackBar(props: ISnackbarProps) {
    const { message, duration = 3000 } = props;
  return (
    <View>
      <Snackbar 
        visible={true}
        duration={duration}
        onDismiss={()=> {}}
        >
            {message}
        </Snackbar> 
    </View>
  )
}