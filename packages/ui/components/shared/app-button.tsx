import { ViewStyle, StyleProp } from 'react-native';
import { Button } from 'react-native-paper';
import React from 'react'

type AppButtonProps = {
  icon?: string,
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal',
  label: string,
  onPress: (e)=>void,
  style?: StyleProp<ViewStyle>,
  disabled: boolean,
  loading?: boolean,
  compact?: boolean
}

const AppButton = (props: AppButtonProps) => {// ({ label, icon, mode='contained', onPress }) => {
  const { label, disabled, mode='contained', loading=false, compact=false, onPress, ...rest } = props; 
  return (
    <Button 
      {...rest}
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      compact={compact}
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
  //     onPress={onPress}
  //     contentStyle={{ height: 30 }}
  //     // labelStyle={{ height: 18 }}
  //   >
  //     {label}
  //   </Button>
  // )
}

export { AppButton }