import { View, Text, StyleSheet } from 'react-native'
import React, { Fragment, useEffect, useMemo } from 'react'
import { TextInput, useTheme, HelperText } from 'react-native-paper'
import { GlobalStyles } from '@/app/styles/global'
import { UIUtil } from '@/app/utils/ui';
import { IDataProps } from '@/app/interfaces/inputs';
import withStoreValue from '../../hoc/withStoreValue';
import { get_field_store_value } from '@/app/ui/utils/state';
import { theme } from '@/app/core/theme';

const BaseTextInput = (props: IDataProps) => { 
    const[value, set_value] = React.useState(props.value || '');
    const keyboard_type = UIUtil.get_keyboard_type(props.field?.field_type || props.field_type, props.field?.options || props.options);
    const theme = useTheme();
    const error_message = props.form_state?.errors?.[props.field?.fieldname || props.field_name];
    const text_color = error_message ? theme.colors.error : theme.colors.surface; 
    const styles = useMemo(
      () =>
        StyleSheet.create({
          text_input_style: {
            color: text_color,
          },
        }),
      [text_color],
    );

    const set_store_value = (val) => {
      
    }
    
    useEffect(() => {
      props?.on_change_value?.(value); 
    }, [value])
    useEffect(() => {
       set_value(props.value);
    }, [props.value]);

  return (
    <Fragment>
      <TextInput 
        {...props}
        keyboardType={keyboard_type}
        style={[GlobalStyles.form_field, GlobalStyles.Data, styles.text_input_style, props?.style ]}
        label={props.reqd ? `${props.label} *` : props.label} 
        // label={<Text style={{fontSize: 20}}><Text style={{color: 'red' }}>*</Text>{props.label}</Text>} 
        // placeholder={props.label}
        value={value}
        disabled={props.readonly}
        mode='outlined'
        numberOfLines={props.multiline ? 6: 1}
        dense
        textAlignVertical=''
        secureTextEntry={props.is_password}
        onChangeText={text => {
            set_value(text);
            props.on_change_value(text); 
          }
        }
        outlineStyle={{ borderColor: props.reqd ? 'red' : theme.colors.primary }}
        error={error_message ? true : false}
      /> 
      {
        error_message && <HelperText type='error'>{error_message}</HelperText>
      }
    </Fragment>
  )
}

// export default withStoreValue(BaseTextInput)
export default BaseTextInput