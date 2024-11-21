import { View, Text } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import UIGenerator from '../../../../UIGenerator';
import { IDocFormProps } from '../../../../interfaces/ui';
import { APP } from 'common';

const DocForm = (props: IDocFormProps, ref) => { 
  const {doctype, docname, doc, is_child_table, show_save_button=true, ...rest} = props;      

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