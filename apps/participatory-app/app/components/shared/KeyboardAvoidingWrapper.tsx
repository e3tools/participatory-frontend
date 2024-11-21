import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native'

const KeyboardAvoidingWrapper = ({ children }) => {
  return (
   <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View>
                {children}
              </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default KeyboardAvoidingWrapper 

const styles = StyleSheet.create({
  container: { 
    display: 'flex', 
    // backgroundColor: 'purple'
  }
})