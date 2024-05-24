import React from 'react'
import BaseNumeric from './base_numeric';
import { INumericProps } from '@/app/interfaces/inputs';

export default function AppFloat(props: INumericProps) {
  return (
    <BaseNumeric {...props}/>
  )
}