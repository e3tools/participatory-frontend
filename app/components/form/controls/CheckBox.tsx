import React from 'react'
import { Checkbox } from 'react-native-paper'; 
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { ICheckBoxProps } from '@/app/interfaces/inputs';

export default function AppCheckBox(props: ICheckBoxProps) {
  const[checked, set_checked] = React.useState(props.value || false);
  React.useEffect(() => { 
    // Trigger setting of values in the parent component
    props.on_change_value(checked);
  }, [checked]);

  React.useEffect(() => {
    set_checked(props.value);
 }, [props.value]);

  return ( 
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, props.style]}>
      <Checkbox 
          // style={[GlobalStyles.form_field/*, GlobalStyles.CheckBox*/]} 
          status={checked ? 'checked' : 'unchecked'}
          onPress={(chk) => {
            set_checked(!checked); 
                // set_checked(chk); 
            }
          }
      />
      <Text>{props.field.label}</Text>
    </View>
    // <View style={{ /*transform: [{scaleX: 0.5}],*/ }}>
    //   <Checkbox.Item  {...props}
    //       style={[GlobalStyles.form_field/*, GlobalStyles.CheckBox*/]}
    //       labelStyle={{ marginLeft: -100 }}
    //       // status={checked && (checked === true || checked === 1) ? 'checked' : 'unchecked'}
    //       status={checked ? 'checked' : 'unchecked'}
    //       position='leading'
    //       dense 
    //       label={props.field.label}
    //       value={checked}
    //       mode='flat'  
    //       onPress={(chk) => {
    //           set_checked(!checked); 
    //           // set_checked(chk); 
    //       }}
    //   />
    // </View>
  )
}

// export default function BaseTextInput(props) { 
//     const[value, set_value] = React.useState(props.value || '');
//     const keyboard_type = UIUtil.get_keyboard_type(props.field);
//   return (
//       <TextInput {...props}
//         keyboardType={keyboard_type}
//         style={[GlobalStyles.form_field, GlobalStyles.Data]}
//         label={props.field.label}
//         value={value}
//         mode='flat'
//         dense
//         onChangeText={text => {set_value(text); props.on_change_value(text);}}
//       /> 
//   )
// }