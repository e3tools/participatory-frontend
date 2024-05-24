import React from 'react' 
import { INumericProps } from '@/app/interfaces/inputs';
import BaseNumeric from './base_numeric';

export default function AppInt(props: INumericProps) {
  return (
    <BaseNumeric {...props}/>
  )
}