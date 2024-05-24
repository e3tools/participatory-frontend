import { View, Text } from 'react-native'
import React from 'react'
import BaseTextInput from './base_text_input';
import { GlobalStyles } from '@/app/styles/global';
import { TextInput } from 'react-native-paper'; 
import { IPasswordProps } from '@/app/interfaces/inputs';

export default function AppPassword(props: IPasswordProps) {
  const { visible = false, ...rest } = props;
  const [secure, set_secure] = React.useState(!visible);
  return (
    <BaseTextInput 
        {...rest}
        is_password={secure}
        right={ !secure ? <TextInput.Icon icon='eye' onPress={()=>set_secure(!secure)}/> : null }
    /> 
  )
}