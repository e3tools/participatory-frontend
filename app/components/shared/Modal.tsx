import { Keyboard, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Caption, Headline, Modal, Portal, Text } from 'react-native-paper';
import { GlobalStyles } from '@/app/styles/global';
import { IModalProps } from '@/app/interfaces/common';
 
const AppModal = (props: IModalProps) => {
    const {children, visible, on_dismiss, title} = props;
    const [modal_open, set_modal_open] = useState(visible);
  return (
    <View style={GlobalStyles.container}>
      <Portal>
        <Modal visible={visible}  
              onDismiss={on_dismiss}  
              contentContainerStyle={styles.modal}
        >
          {title && <Text style={styles.modal_title} variant='titleMedium'>{title}</Text>}
          {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
             {/* <MaterialIcons
                        name='close'
                        size={24}
                        onPress={() => set_modal_open(false) }
                    /> */}
              <View>
                {children}
              </View>
          {/* </TouchableWithoutFeedback> */}
        </Modal>
      </Portal>
    </View>
  )
}

export default AppModal

const styles = StyleSheet.create({
    modal: {
      backgroundColor: 'white',
      padding: 5,
      margin: 20
    },
    modal_title: {
      fontWeight: 'bold'
    }
  })