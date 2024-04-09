import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Button } from 'react-native-paper'
import { DatePickerInput } from 'react-native-paper-dates';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GlobalStyles } from '@/app/styles/global';
import { en, registerTranslation } from 'react-native-paper-dates';
import { IDateProps } from '@/app/interfaces/inputs';
import { parse_date } from '@/app/utils/date';
registerTranslation('en', en)

export default function AppDate(props: IDateProps) { 
  const [input_date, set_input_date] = React.useState(undefined); //new Date() 

  useEffect(() => {
    let parsed_date = props.value ? parse_date(props.value) : undefined;
    set_input_date(parsed_date);
  }, [props.value]);

  return (
    //<View style={[GlobalStyles.form_field, GlobalStyles.date_picker]}>
    <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
      <DatePickerInput
        style={[GlobalStyles.form_field, GlobalStyles.date_picker]}
        locale='en'
        mode='outlined'
        label={props.field.label}
        value={input_date}
        inputMode='start'
        onChange={(d) => {
          set_input_date(d);
          props.on_change_value(d);
        }}
      /> 
    </View>
    //</View>
    // <SafeAreaProvider>
    //   <Text>{date ? date.toString(): ''}</Text>
    //     <View style={styles.container}>
          
    //        <DatePickerInput
    //          locale='en'
    //          label={props.field.label}
    //          value={date}
    //          inputMode='start'
    //          onChange={(d) => {
    //             set_date(d);
    //             //props.on_change_value(d);
    //          }}
    //        /> 
    //     </View>
    // </SafeAreaProvider> 
  )
}

// const styles = StyleSheet.create({
//     container: {
//         justifyContent: 'center',
//         flex: 1, 
//         alignItems: 'center',
//         padding: 20
//     },
//     picker: {
//       // padding: 30
//     }
// });