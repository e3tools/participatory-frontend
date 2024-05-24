import { View, Text, TextInput as RInput } from 'react-native';
import { TextInput } from 'react-native-paper';
import React, { useState } from 'react'; 
import { GlobalStyles } from '@/app/styles/global';
import { Field } from 'formik';
import BaseTextInput from './base_text_input';
import { IDataProps } from '@/app/interfaces/inputs';

export default function AppData(props: IDataProps){
  const {style, ...rest} = props;
  return (    
    <BaseTextInput 
        {...rest}
        style={[style ? style : null ]}
    />
  )
} 