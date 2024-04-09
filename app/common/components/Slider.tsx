import { View, Text } from 'react-native'
import React from 'react'
import { ISliderProps } from '../interfaces';
import Slider from '@react-native-community/slider';

export default function AppSlider(props: ISliderProps) {
    const {value, minimum_value, maximum_value, on_value_change, step, style, ...rest } = props;
  return (
    <Slider 
        {...rest}
        style={style}
        minimumValue={minimum_value}
        maximumValue={maximum_value}
        value={value}
        step={step} 
        renderStepNumber={true}
        onValueChange={(val) => {
            on_value_change(val);
        }}
    />
  )
}