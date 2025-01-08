import { StyleSheet, Text, View } from 'react-native'
import React, { createRef, forwardRef, useEffect, useImperativeHandle } from 'react' 
import DocGrid from '../views/base/doc-grid';
import { IChildTableProps } from '../../../interfaces/inputs';
import FieldLabel from './field-label';

const ChildTable = (props: IChildTableProps, ref) => { 
  // const ref = createRef(null);
  useImperativeHandle(ref, ()=> {
    get_rows: () => ref?.current?.get_rows()
  }, []); 
  return (
    <View>
      <FieldLabel {...props} />
      <DocGrid
        field_name={props.field_name}
        ref={ref}
        label={props.label}
        doctype={props.doctype}
        isChildTable={true}
        parent={props.parent}
        parenttype={props.parenttype}
        parentfield={props.parentfield}
        parentdoc={props.parentdoc}
        on_change={props.on_change}
        style={props.style}
        value={props.value}
        navigation={props.navigation}
      />
    </View>
  );
}

export default forwardRef(ChildTable)

const styles = StyleSheet.create({})