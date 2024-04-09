import React from 'react' 
import { INumericProps } from '@/app/interfaces/inputs';
import BaseNumeric from './BaseNumeric';

export default function AppInt(props: INumericProps) {
  return (
    <BaseNumeric {...props}/>
  )
}