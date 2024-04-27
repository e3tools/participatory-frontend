import { View, Text } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router'; 
import DocForm from '../DocForm';
import { useIsFocused } from '@react-navigation/native';
import { APP } from '@/app/utils/app';

export default function FormView() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const [key, set_key] = useState(null);
    const { doctype, docname } = params;

  // useFocusEffect(
  //   React.useCallback(() => { 
  //     set_key(APP.generate_random_string())

  //     return () => { 
  //       set_key(null)
  //     }
  //   }, []) 
  // );
    
  useLayoutEffect(() => {
    navigation.setOptions({ title: doctype }); 
  }, []);

   useEffect(()=> {
    /**Do this to ensure forms are reloaded and redrawn */
    navigation.addListener('focus', () => {
      console.log('Reloaded single step form')
    })
  }, [navigation])

  return (
    <DocForm doctype={doctype} docname={docname} doc={null} key={key}  />
  )
}