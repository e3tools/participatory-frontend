import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import { AntDesign } from '@expo/vector-icons';
import { DocTypeService } from '@/app/services/doctype';
import { IDBReadParam } from '@/app/interfaces/database'; 
import { ISelectProps } from '@/app/interfaces/inputs';
import { GlobalStyles } from '@/app/styles/global';
import { SelectStyles } from './styles/select';
import FieldLabel from './field_label';
import { theme } from '@/app/core/theme';

export default function AppLink(props: ISelectProps) {
  const [open, set_open] = useState(false);
  const [value, set_value] = useState(props.value || '');
  const [focus, set_focus] = useState(false);
  // const options = props.field.options;
  // const data = options ? (options instanceof Array ? options : options.split('\n')) : []
  const { placeholder='' } = props;
  // const place_holder = `---${APP._('GLOBAL.DROPDOWN_PLACEHOLDER')} ${placeholder.toLocaleLowerCase()}---`
  const place_holder = `${placeholder}`; // `---${placeholder.toLocaleLowerCase()}---`
  const [data, set_data] = useState([]);
  const doctype = props.field.options;
  const db = new DocTypeService(doctype); 
  const get_all_docs = async (val = '') => {
    //loading.value = true
    let cfg = {} as IDBReadParam     
    cfg.doctype = doctype
    cfg.fields = ['name']
    // cfg.limit_page_length = 20
    cfg.filters = val === '' ? [] : [['name', 'like', val]]

    const docs = await db.get_list(cfg); 
    set_data(docs);  
  }

  useEffect(() => {
    const load = async () => {
      await get_all_docs('');
    }
    load();
  }, [])

  useEffect(()=> { 
    // Trigger setting of values in the parent component
    props.on_change_value(value); 
  }, [value]);

  useEffect(() => {
    set_value(props.value)
  }, [props.value]);

  
  return (
    <View>
      <FieldLabel label={props.label} reqd={props.reqd} hidden={props.hidden} />
      <Dropdown
        style={[GlobalStyles.form_field, GlobalStyles.select, props?.style, { borderColor: props.reqd && !value ? theme.colors.error : theme.colors.primary }]}
        placeholderStyle={SelectStyles.placeholderStyle}
        selectedTextStyle={SelectStyles.selectedTextStyle}
        inputSearchStyle={SelectStyles.inputSearchStyle}
        selectedStyle={SelectStyles.selectedStyle}
        iconStyle={SelectStyles.iconStyle}
        data={data}
        search
        labelField='name'
        valueField='name'
        value={value}
        disable={props.readonly}
        // placeholder={!focus? 'Select item' : '...'}
        placeholder2={!focus? place_holder : '...'}
        placeholder={''}
        searchPlaceholder='Search...'
        onFocus={()=>set_focus(true)}
        onBlur={()=>set_focus(false)}
        onChange={item => { 
          set_value(item.name);
          set_focus(false);
          props.on_blur?.();
        }}
        renderLeftIcon={() => {
          <AntDesign
            color={focus ? 'blue': 'black'}
            name='Safety'
            size={20}
          />
        }}
      /> 
    </View>
  )
}