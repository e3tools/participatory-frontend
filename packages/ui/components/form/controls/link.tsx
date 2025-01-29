import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import { AntDesign } from '@expo/vector-icons';
import { DocTypeService } from 'data-layer/services/doctype';
import { IDBReadParam } from 'data-layer/interfaces/database'; 
import { ILinkProps } from '../../../interfaces/inputs';
import { GlobalStyles } from '../../styles/global'; 
import { SelectStyles } from './styles/select';
import FieldLabel from './field-label';
import { theme } from '../../theme/theme';

export default function AppLink(props: ILinkProps) {
  const [open, set_open] = useState(false);
  const [value, set_value] = useState(props.value || '');
  const [focus, set_focus] = useState(false);
  const [titleField, setTitleField] = useState('name');
  const [currentFilters, setCurrentFilters] = useState(props.filters);

  // const options = props.field.options;
  // const data = options ? (options instanceof Array ? options : options.split('\n')) : []
  const { placeholder='' } = props;
  // const place_holder = `---${APP._('GLOBAL.DROPDOWN_PLACEHOLDER')} ${placeholder.toLocaleLowerCase()}---`
  const place_holder = `${placeholder}`; // `---${placeholder.toLocaleLowerCase()}---`
  const [data, set_data] = useState([]);
  const doctype = props.field.options;
  const db = new DocTypeService(doctype);  

  /**
   * Get doctype definition
   */
  const getDocTypeTitleField = async() => {
    const formDef = await new DocTypeService('DocType').get_doc(doctype); 
    setTitleField(formDef.title_field || 'name');
    return formDef.title_field;
  }

  const get_all_docs = useCallback(async (val = '') => {
    const title_field = await getDocTypeTitleField() || 'name';
    let cfg = {} as IDBReadParam     
    cfg.doctype = doctype
    cfg.fields = [...new Set(["name", title_field])];
    // cfg.limit_page_length = 20
    cfg.or_filters =
      val === ""
        ? []
        : [
            ["name", "like", val],
            [title_field, "like", val],
          ]; 
          
    const filters = new Array<[[]]>(); 
    /*
    Object.keys(props.filters ? props.filters : {}).map((filter) => {
      //filters may be specified as literal values e.g 'parent': ['=', 'KE'] or values for a doctype e.g 'parent': ['=', doc.country]. 
      //Another example is [['male', '=', 10], ['gender', '=', 'Male']]
      console.log(
        "To filtered 2:  ",
        filter, 
        Object.keys(props.filters || {})
      );
      filters.push(parseFilter(filter, props.doc))
    });*/
    currentFilters?.map((filter: any[]) => {
      //filters may be specified as literal values e.g 'parent': ['=', 'KE'] or values for a doctype e.g 'parent': ['=', doc.country].
      //Another example is [['male', '=', 10], ['gender', '=', 'Male']] 
      filters.push(parseFilter(filter, props.doc)); 
    });
    if(filters){
      cfg.filters = [...filters];
    } 
    const docs = await db.get_list(cfg);
    set_data(docs);
  }, []);

  /**
   * Extract filter field, operator and field value. Filters come in the form of [field, operator, value]
   * @param filter 
   */
  const parseFilter = (filter: Array<any>, doc: object) : Array<[]> => {
    const parsedFilter = new Array<[]>(); 
    if (!Array.isArray(filter)){
      throw('Invalid filter');
    }
    if(filter.length != 3){
      throw('Invalid filter');
    }
    const filterValue = filter[2];
    const re = /doc./g
    if(typeof filterValue === 'string') {
      // check if there is an entry of `doc.`
      if(filterValue.toString().match(re)) {
        const field = filterValue.replace(re, '')
        const value = doc[field];
        return [filter[0], filter[1], value];
      } else {
        return filter;
      }
    }
    return parsedFilter;
  }

  useEffect(() => {
    const load = async () => {
      await get_all_docs('');
    }
    load();
  }, [])

  useEffect(()=> { 
    // Trigger setting of values in the parent component
    props.on_change(value); 
  }, [value]);

  useEffect(() => {
    set_value(props.value)
  }, [props.value]);

  useEffect(() => {
    get_all_docs() 
  }, [currentFilters]);

    useEffect(() => {
    setCurrentFilters(props.filters)
  }, [props.filters])

  return (
    <View>
      <FieldLabel label={props.label} reqd={props.reqd} hidden={props.hidden} />
      <Dropdown
        style={[
          GlobalStyles.form_field,
          GlobalStyles.select,
          props?.style,
          {
            borderColor:
              props.reqd && !value ? theme.colors.error : theme.colors.primary,
          },
        ]}
        placeholderStyle={SelectStyles.placeholderStyle}
        selectedTextStyle={SelectStyles.selectedTextStyle}
        inputSearchStyle={SelectStyles.inputSearchStyle}
        selectedStyle={SelectStyles.selectedStyle}
        iconStyle={SelectStyles.iconStyle}
        data={data}
        search
        labelField={titleField}
        valueField="name"
        value={value}
        disable={props.readonly}
        // placeholder={!focus? 'Select item' : '...'}
        placeholder2={!focus ? place_holder : "..."}
        placeholder={""}
        searchPlaceholder="Search..."
        onFocus={() => set_focus(true)}
        onBlur={() => set_focus(false)}
        onChange={(item) => {
          set_value(item.name);
          set_focus(false);
          props.on_blur?.();
        }}
        renderLeftIcon={() => {
          <AntDesign
            color={focus ? "blue" : "black"}
            name="Safety"
            size={20}
          />;
        }}
      />
    </View>
  );
}