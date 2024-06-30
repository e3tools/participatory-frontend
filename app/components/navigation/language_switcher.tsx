import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SegmentedButtons } from 'react-native-paper'
import { change_language, get_language } from '../../utils/translate' 

type LanguageSwitcherProps = {
     /**
   * This will reset the root component key to force a re-render of all components
   * when the language has been switched
   */
    reset_root_key_func?: ()=>void
}

const LanguageSwitcher = (props: LanguageSwitcherProps) => {
    const [value, set_value] = useState('en')
    useEffect(()=>{
        const load = async () => {
            const val = await get_language();
            set_value(val);
        }
        load();
    }, []);
 
  return (
    <View style={{width: 200}}>
      <SegmentedButtons
        value={value}
        onValueChange={(val) => {
            set_value(val);
            change_language(val);
            if(props.reset_root_key_func) {
                props.reset_root_key_func();
            }
        }}
        buttons={[
          {
            value: 'en',
            label: 'English',
            showSelectedCheck: true
          },
          {
            value: 'sw',
            label: 'Swahili',
            showSelectedCheck: true
          }
        ]}
        />
    </View>
  )
}

export default LanguageSwitcher

const styles = StyleSheet.create({})