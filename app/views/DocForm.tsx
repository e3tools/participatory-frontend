import { View, Text } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import UIGenerator from '@/app/ui/UIGenerator';
import { IDocFormProps } from '../ui/interfaces/ui';

const DocForm = (props: IDocFormProps, ref) => { 
  const {doctype, docname, doc, is_child_table, show_save_button=true, ...rest} = props;     
  return (
    <UIGenerator 
        doctype={doctype} 
        docname={docname} 
        doc={doc}
        is_child_table={is_child_table} 
        show_save_button={show_save_button} ref={ref}        
    />  
  )
}

export default forwardRef(DocForm);