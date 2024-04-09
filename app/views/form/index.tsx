import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'; 
import DocForm from '../DocForm';

export default function FormView() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const { doctype, docname } = params;
    
  useEffect(() => {
    navigation.setOptions({ title: doctype });
   }, []);

  return (
    <DocForm doctype={doctype} docname={docname} doc={null} />
  )
}