import React from 'react'; 
import { IDataProps } from '../../../interfaces/inputs';
import BaseTextInput from './base_text_input'; 

export default function AppSmallText(props: IDataProps) {  
    return (    
      <BaseTextInput
          {...props}
          multiline 
      /> 
    )
  } 