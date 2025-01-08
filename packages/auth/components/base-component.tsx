import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { store } from '../state/store'
import { Provider } from 'react-redux';

const BaseComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <View>
        <Provider store={store}>
            {children}
        </Provider>
    </View>
  )
}

export default BaseComponent

const styles = StyleSheet.create({})