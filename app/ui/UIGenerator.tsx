import { View, Text } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import FrappeUIGenerator from './generators/FrappeUIGenerator';
import { IDocFormProps } from './interfaces/ui';

function UIGenerator(props: IDocFormProps, ref) { 
  const { doctype, docname, doc, show_save_button, is_child_table, navigation, ...rest } = props;   
  console.log("ui gen", doctype, docname)
  return (
      <FrappeUIGenerator 
        doctype={doctype}
        docname={docname}
        doc={doc}
        is_child_table={is_child_table}
        show_save_button={show_save_button}
        ref={ref}
        navigation={navigation}
      />
  )
}

export default forwardRef(UIGenerator)