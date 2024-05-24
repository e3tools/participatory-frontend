import { View, Text, ViewStyle, StyleProp } from 'react-native';
import { Button } from 'react-native-paper';
import React from 'react'

type AppButtonProps = {
  icon?: string,
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal',
  label: string,
  on_press: (e)=>void,
  style?: StyleProp<ViewStyle>,
}

const AppButton = (props: AppButtonProps) => {// ({ label, icon, mode='contained', on_press }) => {
  const { label, mode='contained', on_press, ...rest } = props; 
  return (
    <Button 
      {...rest}
      mode={mode}
      onPress={on_press}
      // contentStyle={{ height: 35, /*flexDirection: 'row-reverse'*/ }}
    >
    {label}
  </Button>
  )
  // return (
  //   <Button 
  //     {...rest}
  //     icon={icon} 
  //     mode={mode}  
  //     onPress={on_press}
  //     contentStyle={{ height: 30 }}
  //     // labelStyle={{ height: 18 }}
  //   >
  //     {label}
  //   </Button>
  // )
}

export { AppButton }