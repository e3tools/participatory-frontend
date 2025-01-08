import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { Icon, MD3Colors } from 'react-native-paper';

type Props = {
    onPress: () => void
}

const BackButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
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