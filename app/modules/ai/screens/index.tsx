import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import AppContainer from '@/app/components/base/AppContainer'
import { Card, Paragraph, Text } from 'react-native-paper'
import TopicModelSummaryImage from '@/app/assets/images/topic-model-summary.png';
import { Image } from 'react-native';
import { useNavigation } from 'expo-router';
import { APP } from '@/app/utils/app';

const AIDefault = () => {
  const navigation = useNavigation();
    // const image_uri = Image.resolveAssetSource(TopicModelSummaryImage).uri 
  useEffect(() => {
    navigation.setOptions({ title: APP._('AI_PAGE.TITLE') }); 
  }, []);
    
  return (
    <AppContainer>
      <Card>
        <Card.Cover source={{ uri: Image.resolveAssetSource(TopicModelSummaryImage).uri }} />
        <Card.Title title='Core Concepts of Topic Modeling' />  
        <Card.Content>
            <Paragraph style={{ textAlign: 'justify' }}>
                We’ve established topic modeling enables data professionals to rapidly analyze and identify clusters or groups of similar words within a body of text at scale.

                But what are topics, and how does topic modeling work?
                What are topics, and how do topic models work?

                Topics are the latent descriptions of a corpus (large group) of text. Intuitively, documents regarding a specific topic are more likely to produce certain words more frequently.

                For example, the words “dog” and “bone” are more likely to appear in documents concerning dogs, whereas “cat” and “meow” are more likely to be found in documents regarding cats. Consequently, the topic model would scan the documents and produce clusters of similar words.

                Essentially, topic models work by deducing words and grouping similar ones into topics to create topic clusters.
            </Paragraph>
        </Card.Content>
      </Card>
    </AppContainer>
  )
}

export default AIDefault

const styles = StyleSheet.create({})