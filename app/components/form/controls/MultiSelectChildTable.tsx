import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
// import DropDownPicker from 'react-native-dropdown-picker';
import { MultiSelect } from 'react-native-element-dropdown';
import { AntDesign } from '@expo/vector-icons';
import { DocTypeService } from '@/app/services/doctype';
import { IDBReadParam } from '@/app/interfaces/database';  
import { ITableMultiSelectProps, ISelectProps } from '@/app/interfaces/inputs';
import { GlobalStyles } from '@/app/styles/global';
import { APP } from '@/app/utils/app';
import { DATA_TYPE } from '@/app/modules/mapping/enums';
import { FIELD_TYPE } from '@/app/constants/enums';
import { theme } from '@/app/core/theme';
import { SelectStyles } from './styles/select';

export default function AppMultiSelectChildTable(props: ITableMultiSelectProps) {
  const [open, set_open] = useState(false);
  const [value, set_value] = useState([]);
  const [focus, set_focus] = useState(false);
  // const options = props.field.options;
  // const data = options ? (options instanceof Array ? options : options.split('\n')) : []
  const { placeholder='' } = props;
  // const place_holder = `---${APP._('GLOBAL.DROPDOWN_PLACEHOLDER')} ${placeholder.toLocaleLowerCase()}---`
  const place_holder = `${placeholder}`;// `---${placeholder.toLocaleLowerCase()}---`
  const [data, set_data] = useState([]);
  const child_table_doctype = props.field.options; 
  const [link_field, set_link_field] = useState(null); 

  const get_link_doctype_from_child_table = async () => {
    // For the child table doctype, get the link field within the child table doctype
    const table_def = await new DocTypeService(child_table_doctype).get_doctype();
    const link_field = table_def.fields.filter(el => el.fieldtype == FIELD_TYPE.LINK);
    if(link_field.length > 0) { 
      set_link_field(link_field[0]);     
     return link_field[0]; // get the first link field
    }
    return null;
  }

  const get_all_docs = async (val = '') => {

    // const _transform_into_doctype = (rec) => {
    //   const new_doc = {
    //     'doctype': child_table_doctype,
    //   }
    //   new_doc[field.fieldname] = rec.name;
    //   return new_doc;
    // }
    //loading.value = true
    const field = await get_link_doctype_from_child_table();
    const doctype = field?.options;
    const db = new DocTypeService(doctype); 
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
    props.on_change_value(value, link_field); 
  }, [value]);
 
  useEffect(() => {
    let vals = [];
    if(link_field) {
      props.value?.map((el, idx) => {
        vals.push(el[link_field.fieldname]);
      })
    }
    set_value(vals);
  }, [link_field]);

  const render_label = () => {
    if(value || focus){
      return (
        <Text style={[styles.label, focus && { color: theme.colors.secondary}]}>
          {props.label}
        </Text>
      )
    }
    return null;
  }
  
  return (
    <View>
      {/* {render_label()} */}
      <MultiSelect
        style={[GlobalStyles.select, styles.dropdown]} 
        placeholderStyle={SelectStyles.placeholderStyle}
        selectedTextStyle={SelectStyles.selectedTextStyle}
        inputSearchStyle={SelectStyles.inputSearchStyle}
        selectedStyle={SelectStyles.selectedStyle}
        iconStyle={SelectStyles.iconStyle}
        data={data}
        disable={props.readonly}
        search
        labelField='name'
        valueField='name'
        value={value}
        // placeholder={!focus? 'Select item' : '...'}
        placeholder={!focus? place_holder : '...'}
        searchPlaceholder='Search...'
        onFocus={()=>set_focus(true)}
        onBlur={()=>set_focus(false)}
        onChange={item => { 
          set_value(item);
          set_focus(false);
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

const styles = StyleSheet.create({
  container: { padding: 16 },
    dropdown: {
      height: 50,
      backgroundColor: 'transparent',
      borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
    },
    placeholderStyle: {
      fontSize: 16,
      paddingLeft: 15,
    },
    selectedTextStyle: {
      fontSize: 14,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    icon: {
      marginRight: 5,
    },
    selectedStyle: {
      borderRadius: 12,
    },
})