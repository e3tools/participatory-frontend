import React from 'react'
import BaseNumeric from './BaseNumeric';
import { INumericProps } from '@/app/interfaces/inputs';

export default function AppCurrency(props: INumericProps) {
  return (
    <BaseNumeric 
      {...props}
    />
  )
}