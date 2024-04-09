import { View, Text, ViewStyle, StyleProp } from 'react-native';
import { Button } from 'react-native-paper';
import React from 'react'

type AppButtonProps = {
  icon?: string,
  mode?: string,
  label: string,
  on_press: (e)=>void,
  style?: StyleProp<ViewStyle>,
}

const AppButton = (props: AppButtonProps) => {// ({ label, icon, mode='contained', on_press }) => {
  const { label, icon, mode='contained', on_press, ...rest } = props;
  return (
    <Button 
      {...rest}
      icon={icon} 
      mode={mode}  
      onPress={on_press}
      contentStyle={{ height: 32 }}
      labelStyle={{ height: 18 }}
    >
      {label}
    </Button>
  )
}

export { AppButton }