import { StyleSheet } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import { Icon } from 'react-native-paper';

const BackButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Icon source="arrow-left" size={20}></Icon>
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Constants.statusBarHeight,
    left: 10,
  },
});
