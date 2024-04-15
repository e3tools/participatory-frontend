import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import React from 'react'; 
import { IDataProps } from '@/app/interfaces/inputs';
import BaseTextInput from './BaseTextInput';
import { GlobalStyles } from '@/app/styles/global';

export default function AppSmallText(props: IDataProps) {  
    return (    
      <BaseTextInput
          {...props}
          multiline 
      /> 
    )
  } 