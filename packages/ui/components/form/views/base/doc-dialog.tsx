import { Alert, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import React, { createRef, useState } from 'react';
import { Button, Card, Headline, Modal, Portal, Text } from 'react-native-paper'; 
import DocForm from './doc-form';
import { GlobalStyles } from '../../../styles/global'; 
import { AppButton } from '../../../shared/app-button';  
import AppModal from '../../../shared/app-modal';
import { IDocDialogProps } from '../../../../interfaces/ui';
import { APP } from 'common';
import KeyboardAvoidingWrapper from '../../../shared/keyboard-avoiding-wrapper';  
 
const DocDialog = (props: IDocDialogProps) => { 
    const [modal_open, set_modal_open] = useState(props.visible || false);
    const { title } = props;
    const ref = createRef(null);     
  return (
    <View style={GlobalStyles.container}>
      <AppModal
        visible={modal_open}
        onDismiss={() => {
          set_modal_open(false);
          props.onDismiss();
        }}
        // animationType='slide'
        // contentContainerStyle={styles.modal}
      >
        <KeyboardAvoidingWrapper>
          <Card style={styles.button_panel}>
            <Card.Actions>
              <View style={styles.title_container}>
                <Text style={styles.title}>{title}</Text>
              </View>
              <AppButton
                icon="plus"
                label={APP._("CHILD_TABLE.INSERT")}
                mode="text"
                onPress={async () => {
                  const frmRef = ref.current;
                  const res = await frmRef.validate();
                  if (frmRef.is_valid()) {
                    const values = await frmRef.get_values();
                    if (props.isChildTable) {
                      if(props?.onInsertChildRow){
                        props?.onInsertChildRow(values);
                      }
                    }
                  } else {
                    console.log("Invalid values: ", frmRef);
                  }
                }}
              />
            </Card.Actions>
          </Card>
          <DocForm
            doctype={props.doctype}
            docname={props.docname}
            doc={props.doc}
            isChildTable={props.isChildTable}
            ref={ref}
          />
        </KeyboardAvoidingWrapper>
      </AppModal>
    </View>
  ); 
}

export default DocDialog 

const styles = StyleSheet.create({
  button_panel: {
    marginBottom: 5, 
    // padding: 0
  },
  title_container: { 
    flex: 1, 
    justifyContent: 'space-between' 
  },
  title: { 
    fontWeight: 'bold'
  }
})