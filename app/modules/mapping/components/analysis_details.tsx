import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Dialog, Headline, Paragraph, Portal, Subheading } from 'react-native-paper'

type Analysis = {
    analysis: object
}

const AnalysisDetails = (props: Analysis) => { 
  return (
        <ScrollView style={styles.container}>
            <Headline>
                {props.analysis.name}
            </Headline>
            <Paragraph style={styles.paragraph}>
                {props.analysis.description}
            </Paragraph>
        </ScrollView> 
  )
}

export default AnalysisDetails

const styles = StyleSheet.create({
    subheading: {
        fontWeight: 'bold',
        textAlign: 'justify'
    },
    paragraph: {
        textAlign: 'justify'
    },
    container: {
        padding: 10
    }
})