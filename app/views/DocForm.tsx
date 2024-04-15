import { View, Text } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import UIGenerator from '@/app/ui/UIGenerator';
import { IDocFormProps } from '../ui/interfaces/ui';
import { APP } from '../utils/app';

const DocForm = (props: IDocFormProps, ref) => { 
  const {doctype, docname, doc, is_child_table, show_save_button=true, ...rest} = props;     
  console.log("Docform props: ", doctype, docname, doc);

  // Setting key for child table causes the form to render endlessly. So do not do it
  return (
    is_child_table ?
    <UIGenerator 
        //key={APP.generate_random_string()}
        doctype={doctype} 
        docname={docname} 
        doc={doc}
        is_child_table={is_child_table} 
        show_save_button={show_save_button} ref={ref}        
    />  :  
    <UIGenerator 
        key={APP.generate_random_string()}
        doctype={doctype} 
        docname={docname} 
        doc={doc}
        is_child_table={is_child_table} 
        show_save_button={show_save_button} ref={ref}        
    /> 
  )
}

export default forwardRef(DocForm);