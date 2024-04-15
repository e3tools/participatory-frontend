import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import { Icon, MD3Colors } from 'react-native-paper';

type Props = {
    on_press: () => void
}

const BackButton = ({ on_press }) => {
  return (
    <TouchableOpacity onPress={on_press} style={styles.container}>
      <Icon source='arrow-left' size={20}></Icon> 
    </TouchableOpacity> 
  )
}

export default BackButton

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: Constants.statusBarHeight,
        left: 10
    }
})