import { View, Text } from 'react-native'
import React from 'react'
import { Portal, Modal } from 'react-native-paper'
import AppLoader from './AppLoader'

export default function AppMask({ mask_text }) {
    const mask_tyle = { padding: 50 };
    return (
        <Portal>
            <Modal
                visible={true} 
                dismissable={true}
                contentContainerStyle={mask_tyle}>
                <AppLoader loading_text={mask_text} /> 
            </Modal>
        </Portal>
    )
}