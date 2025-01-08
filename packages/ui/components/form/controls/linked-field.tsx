import React from 'react';  
import BaseTextInput from './base-text-input';
import { ILinkedFieldProps } from '../../../interfaces/inputs';

export default function AppLinkedField(props: ILinkedFieldProps){
  const {style, ...rest} = props;
  return (    
    <BaseTextInput 
        {...rest}
        readonly
        style={[style ? style : null ]}
    />
  )
} 