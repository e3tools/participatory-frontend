import React from 'react';  
import BaseTextInput from './base_text_input';
import { IDataProps } from '../../../interfaces/inputs';

export default function AppData(props: IDataProps){
  const {style, ...rest} = props;
  return (    
    <BaseTextInput 
        {...rest}
        style={[style ? style : null ]}
    />
  )
} 