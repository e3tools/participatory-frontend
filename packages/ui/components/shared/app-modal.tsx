import { Keyboard, StyleSheet, View } from 'react-native'
import React, { useState } from 'react' 
import { Caption, Headline, Modal, Portal, Text } from 'react-native-paper';
import { GlobalStyles } from '../styles/global'; 

export interface IModalProps {
  children: React.ReactNode,
  visible: boolean,
  onDismiss: () => void,
  title?: string
}

const AppModal = (props: IModalProps) => {
    const {children, visible, onDismiss, title} = props;
    const [modal_open, set_modal_open] = useState(visible);
  return (
    <View style={GlobalStyles.container}>
      <Portal>
        <Modal visible={visible}  
              onDismiss={onDismiss}  
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