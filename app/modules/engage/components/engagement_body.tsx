import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Card, Paragraph } from 'react-native-paper'
import { APP } from '@/app/utils/app'

const CAPTION_LEN = 100;

const EngagementBody = ({ engagement }) => {
  return (
    <Card.Content>
        <Paragraph style={styles.content}>
        {APP.clip_text(engagement.description, CAPTION_LEN)} 
        </Paragraph>   
    </Card.Content>
  )
}

export default EngagementBody 

const styles = StyleSheet.create({
    content: {
        textAlign: 'justify', 
        // margin: -10
    },
})