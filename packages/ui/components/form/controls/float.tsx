import React from 'react'
import BaseNumeric from './base-numeric';
import { INumericProps } from '../../../interfaces/inputs'; 

export default function AppFloat(props: INumericProps) {
  return (
    <BaseNumeric {...props}/>
  )
}