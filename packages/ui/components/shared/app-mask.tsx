import { View, Text } from 'react-native'
import React from 'react'
import { Portal, Modal } from 'react-native-paper'
import AppLoader from './app-loader'

export default function AppMask({ maskText }: { maskText: string }) {
    const mask_tyle = { padding: 50 };
    return (
      <Portal>
        <Modal
          visible={true}
          dismissable={true}
          contentContainerStyle={mask_tyle}
        >
          <AppLoader loadingText={maskText} />
        </Modal>
      </Portal>
    );
}