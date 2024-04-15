import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router'; 
import DocForm from '../DocForm';
import { useIsFocused } from '@react-navigation/native';
import { APP } from '@/app/utils/app';

export default function FormView() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const [key, set_key] = useState(null);
    const { doctype, docname } = params;

  useFocusEffect(
    React.useCallback(() => {
      console.log("Focused form")
      set_key(APP.generate_random_string())

      return () => {
        console.log("Blurred now")
        set_key(null)
      }
    }, []) 
  );
    
  useEffect(() => {
    navigation.setOptions({ title: doctype });
    console.log("Setting title....")
   }, []);

  return (
    <DocForm doctype={doctype} docname={docname} doc={null} key={key}  />
  )
}