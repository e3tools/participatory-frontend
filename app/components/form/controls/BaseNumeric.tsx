import { View, Text } from 'react-native'
import React from 'react' 
import BaseTextInput from './BaseTextInput';

export default function BaseNumeric(props) {
  const { value, ...rest } = props;
  const converted_val = value !== undefined && value !== null ? value.toString() : value;
  return (
    <BaseTextInput 
        // style={GlobalStyles.Numeric}
        {...rest} 
        value={converted_val} 
    /> 
  )
}