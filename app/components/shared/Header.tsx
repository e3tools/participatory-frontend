import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '@/app/core/theme'
import { GlobalStyles } from '@/app/styles/global'

const Header = ({ children } : React.ReactNode) => {
  return (
    <Text style={GlobalStyles.header}>
        {children}
    </Text> 
  )
}

export default Header 