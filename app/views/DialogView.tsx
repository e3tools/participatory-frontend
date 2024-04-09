import { View, Text, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { GlobalStyles } from '../styles/global'; 
import DocForm from './DocForm';

export default function DialogView({ navigation}) {
  const [modal_open, set_modal_open] = useState(true);
  const [reviews, set_reviews] = useState([]);

  const add_review = (review) => {
    set_reviews((current_reviews) => {
        return [review, ...current_reviews];
    });
    set_modal_open(false);
  }
  return ( 
    <View style={GlobalStyles.container}>
      <Modal visible={modal_open} animationType='slide'>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={GlobalStyles.modal_container}>
                <MaterialIcons
                name='close'
                size={24}
                onPress={() => set_modal_open(false) }
                />
                {/* <FormView add_review={add_review} /> */}
                <DocForm doctype="Gender" docname={null} doc={null} />
            </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}