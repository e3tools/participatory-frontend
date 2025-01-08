import { View, Text, ViewStyle, StyleProp } from 'react-native'
import React from 'react'
import { IconButton, Tooltip } from 'react-native-paper';

type IconButtonProps = {
  label?: string,
  tooltip?: string,
  style?: StyleProp<ViewStyle>,
  icon: string,
  size?: number,
  mode?: string, 
  onPress: (e)=>void, //on_
  disabled?: boolean
}

const AppIconButton = (props: IconButtonProps) => {// ({ label, icon, mode='contained', onPress }) => {
    const { label, icon, size=18, mode='contained-tonal', tooltip, disabled=false, onPress, ...rest } = props; 
    if(tooltip) {
        return (
            <Tooltip title={tooltip}>
                <IconButton 
                    {...rest}
                    icon={icon} 
                    mode={mode}  
                    size={size}
                    disabled={true}
                    onPress={onPress}>
                    {label}
                </IconButton>
            </Tooltip>
          )
    }
    return (
      <IconButton 
        {...rest}
        icon={icon} 
        mode={mode}  
        onPress={onPress}>
          {label}
      </IconButton>
    )
  }
export { AppIconButton }