import { View, Text } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import FrappeUIGenerator from './generators/FrappeUIGenerator';
import { IDocFormProps } from './interfaces/ui';

function UIGenerator(props: IDocFormProps, ref) { 
  const {
    doctype,
    docname,
    doc,
    showSaveButton,
    isChildTable,
    navigation,
    ...rest
  } = props;    
  return (
    <FrappeUIGenerator
      doctype={doctype}
      docname={docname}
      doc={doc}
      isChildTable={isChildTable}
      showSaveButton={showSaveButton}
      ref={ref}
      navigation={navigation}
      {...rest}
    />
  );
}

export default forwardRef(UIGenerator)