import React from 'react'; 
import { IDataProps } from '../../../interfaces/inputs';
import BaseTextInput from './base-text-input'; 

export default function AppSmallText(props: IDataProps) {  
    return (    
      <BaseTextInput
          {...props}
          multiline 
      /> 
    )
  } 