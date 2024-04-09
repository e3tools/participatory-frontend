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
  on_press: (e)=>void, //on_
}

const AppIconButton = (props: IconButtonProps) => {// ({ label, icon, mode='contained', on_press }) => {
    const { label, icon, size=24, mode='contained-tonal', tooltip, on_press, ...rest } = props;
    if(tooltip) {
        return (
            <Tooltip title={tooltip}>
                <IconButton 
                    {...rest}
                    icon={icon} 
                    mode={mode}  
                    size={size}
                    onPress={on_press}>
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
        onPress={on_press}>
          {label}
      </IconButton>
    )
  }
export { AppIconButton }