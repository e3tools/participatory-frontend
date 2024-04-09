import { View, Text } from 'react-native'
import React from 'react'
// import { useField } from 'formik'
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AppDate(props) {
//   const [field, meta, helpers] = useField(props.field.fieldname);
//   const { value } = meta;
//   const { setValue } = helpers;
  const [date, set_date] = React.useState(new Date(1598051730000));

  const on_change = (event, selected_date) => {
    const current_date = selected_date; 
    set_date(current_date);
  };

  return (
    //<SafeAreaProvider>
    <View>
      <Text>selected: {date.toLocaleString()}</Text>     
      <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'date'}
            is24Hour={true}
            onChange={on_change}
      />
    </View>
    //</SafeAreaProvider> 
  )
}