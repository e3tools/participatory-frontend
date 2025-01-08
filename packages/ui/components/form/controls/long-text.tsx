import React from 'react';
import { IDataProps } from '../../../interfaces/inputs';
import BaseTextInput from './base-text-input';

export default function AppLongText(props: IDataProps) {    
    return (    
      <BaseTextInput
          multiline 
          {...props}
      /> 
    )
  } 