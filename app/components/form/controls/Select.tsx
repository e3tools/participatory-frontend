import { View, Text, StyleSheet } from 'react-native'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
// import DropDownPicker from 'react-native-dropdown-picker';
import { Dropdown } from 'react-native-element-dropdown';
import { AntDesign } from '@expo/vector-icons'; 
import { APP } from '@/app/utils/app';
import { object } from 'yup';
import { ISelectProps } from '@/app/interfaces/inputs'; 
import { PaperSelect } from 'react-native-paper-select';
import { GlobalStyles } from '@/app/styles/global';
import { HelperText, useTheme } from 'react-native-paper';

export default function AppSelect(props: ISelectProps) {
  const [open, set_open] = useState(false);
  const [value, set_value] = useState(props.value || '');
  const [focus, set_focus] = useState(false);
  const { label_field = 'name', value_field = 'name', placeholder='', options = props.field.options, searchable=false } = props; 
  let place_holder = `---${APP._('GLOBAL.DROPDOWN_PLACEHOLDER')} ${placeholder.toLocaleLowerCase()}---`
  const theme = useTheme();
  const error_message = props.form_state?.errors?.[props.field.fieldname];
  const text_color = error_message ? theme.colors.error : theme.colors.surface;
  //let options = props.field.options;
  const opts = options ? (options instanceof Array ? options : options.split('\n')) : []; 
  const data = [];
  opts.map((el) => {  
    if(typeof el === 'string'){
      data.push({ 'name': el });
    } else {
      data.push(el);
    }
  });  

  /**
   * Are options objects or primitive strings 
   * @returns 
   */
  const is_options_an_object = () => { 
    if (options){
      return typeof options[0] == 'object';
    }
    return false;
  }

  useEffect(()=> { 
    // Trigger setting of values in the parent component
    if(is_options_an_object()){  
      props.on_change_value(value);  
    }
    else { 
      props.on_change_value(typeof value == 'string' ? value : value?.name) 
    }
  }, [value]);

  useEffect(() => {
    set_value(props.value)
  }, [props.value]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        text_input_style: {
          color: text_color,
        },
      }),
    [text_color],
  );
  
  return (
    <Fragment>
      <Dropdown
        style={GlobalStyles.select}
        data={data}
        search={searchable}
        labelField={label_field}
        valueField={value_field}
        value={value}
        //placeholder={!focus? 'Select item' : '...'}
        placeholder={!focus? place_holder : '...'}
        searchPlaceholder={searchable ? APP._('GLOBAL.SEARCH_PLACEHOLDER') : ''}
        onFocus={()=>set_focus(true)}
        onBlur={()=>set_focus(false)}
        onChange={item => {
          set_value(item);
          set_focus(false);
        }}
        // renderLeftIcon={() => {
        //   <AntDesign
        //     color={focus ? 'blue': 'black'}
        //     name='Safety'
        //     size={20}
        //   />
        // }}
      /> 
      {
        error_message && <HelperText type='error'>{error_message}</HelperText>
      }
    </Fragment>
  )
} 