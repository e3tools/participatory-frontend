import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from 'expo-router'; 
import EngagementHeader from './engagement_header';
import EngagementBody from './engagement_body';
import EngagementFooter from './engagement_footer';
import { theme } from '@/app/core/theme';

const Engagement = ({ engagement }) => {
    const navigation = useNavigation();
  return (
    <View 
        key={engagement.name} 
        style={styles.card} 
        mode='contained'>
       <EngagementHeader engagement={engagement} />      
       <EngagementBody engagement={engagement} /> 
       <EngagementFooter engagement={engagement} /> 
    </View>
  )
}

export default Engagement

const styles = StyleSheet.create({
    card: {  
      borderRadius: 5,
      borderColor: theme.colors.error,  
      borderBottomWidth: 2
    },
})