import React from 'react'
import BaseNumeric from './base_numeric';
import { INumericProps } from '../../../interfaces/inputs';

export default function AppCurrency(props: INumericProps) {
  return (
    <BaseNumeric 
      {...props}
    />
  )
}