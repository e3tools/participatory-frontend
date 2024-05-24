import { View, Text, StyleSheet } from 'react-native'
import React from 'react' 
import { TimePicker } from 'react-native-paper-dates'; 
import { en, registerTranslation } from 'react-native-paper-dates';
import FieldLabel from './field_label';
registerTranslation('en', en)

export default function AppTime(props) {
  const [input_time, set_input_time] = React.useState(undefined); //new Date() 
  return (
    //<View style={[GlobalStyles.form_field, GlobalStyles.date_picker]}>
    <View>
      <FieldLabel label={props.label} reqd={props.reqd} hidden={props.hidden} />
      <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
        <TimePicker
          // style={[GlobalStyles.form_field, GlobalStyles.date_picker]}
          style={props?.style}
          locale='en-GB'
          // label={props.field.label}
          disabled={props.readonly}
          value={input_time}
          inputMode='start'
          onChange={(d) => {
            set_input_time(d); 
            //props.on_change_value(d);
            props.on_blur?.();
          }} 
          
        /> 
      </View>
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