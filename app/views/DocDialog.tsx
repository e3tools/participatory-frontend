import { Alert, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import React, { createRef, useState } from 'react';
import { Button, Card, Headline, Modal, Portal, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import DocForm from './DocForm';
import { GlobalStyles } from '../styles/global'; 
import { AppButton } from '../components/shared/AppButton';  
import AppModal from '../components/shared/Modal';
import { IDocDialogProps } from '../ui/interfaces/ui';
import { APP } from '../utils/app';
import KeyboardAvoidingWrapper from '../components/shared/KeyboardAvoidingWrapper';
 
const DocDialog = (props: IDocDialogProps) => { 
    const [modal_open, set_modal_open] = useState(props.visible || false);
    const { title } = props;
    const ref = createRef(null);     
  return ( 
    <View style={GlobalStyles.container}> 
        <AppModal             
            visible={modal_open}  
            on_dismiss={()=>{
                set_modal_open(false);
                props.on_dismiss();
              }
            } 
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
                    label={APP._('CHILD_TABLE.INSERT')}
                    mode='text' 
                    on_press={async () => {
                      const frm_ref = ref.current;
                      const res = await frm_ref.validate();  
                      if(frm_ref.is_valid()){
                        const values = await frm_ref.get_values(); 
                        if(props.is_child_table){
                          props.insert_child_row(values);
                        }
                      } else {
                        console.log("Invalid values: ", frm_ref)
                      }
                    }}
                  />
                </Card.Actions>
              </Card> 
              <DocForm 
                doctype={props.doctype} 
                docname={props.docname} 
                doc={props.doc} 
                is_child_table={props.is_child_table} 
                ref={ref} 
              />  
          </KeyboardAvoidingWrapper>
        </AppModal> 
    </View>
  ) 
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