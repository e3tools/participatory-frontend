import { Alert, View } from 'react-native'
import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react'
import { DocTypeService } from '@/app/services/doctype';
import { APP } from '@/app/utils/app'; 
import FormGenerator from './_FormGenerator'; 
import { RuleBuilder } from '../rule_builder'; 
import { format_date } from '@/app/utils/date';
import { FIELD_TYPE } from '@/app/constants/enums'; 
import { IDocFormProps } from '../interfaces/ui';
import { UIUtil } from '@/app/utils/ui';
import { GLOBALS } from '@/app/constants/defaults';
import { reset_form_store, update_field_store_value } from '../utils/state';
import { useNavigation } from 'expo-router';
import { Transformer } from '../transformer';
import AppLoader from '@/app/components/shared/AppLoader';

const non_form_fields = ['Tab Break',
                        'Section Break',
                        'Column Break'
]
/**
 * Generates form UI from Frappe form definitions
*/

/**
 * 
 * @param doctype_name: Name of doctype
 * @param docname: id of an existing instance of doctype
 * @returns 
 */
const FrappeUIGenerator = (props: IDocFormProps, ref) => { 
  // const { navigation } = props;
  const navigation = useNavigation();
  const { docname, show_save_button = true, ...rest} = props; 
  const [selected_tab, set_selected_tab] = useState(null);
  const [doc, set_doc] = useState(props.doc || {});
  const [doctype, set_doctype] = useState({});
  const [tabs, set_tabs] = useState([]);
  const [selected_field, set_selected_field] = useState(null);
  const [selected_field_value, set_selected_field_value] = useState(null);
  const [form_fields, set_form_fields] = useState([]);
  const [initial_values, set_initial_values] = useState(props.initial_values || { name: '' });
  const [form_config, set_form_config] = useState({'fields': [], 'validation_schema': {}});
  const [loading, set_loading] = useState(true);
  const [form_tabs, set_form_tabs] = useState({});
  const [active_tab, set_active_tab] = useState(null);
  // const form_ref = useRef(null);

  const doctype_name = props.doctype;
  const db = new DocTypeService(doctype_name);
 
  // useImperativeHandle(ref, () => ({
  //   get_values: () => {
  //     return get_values();
  //   },
  // }), []);

  /**
   * Return form values
  */
  // const get_values = () => { 
  //   return form_ref.current.get_values();
  // }
  
  /**
   * Get tab breaks defined in the form
   */
  const get_tabs = () => { 
    let tbs = doctype?.fields?.filter((itm)=>itm.fieldtype == 'Tab Break');
    if(doctype?.fields?.length > 0){ 
      let non_custom_fields = doctype.fields.filter((itm)=>itm.name.indexOf('-') == -1)
      //check if the first field is a Tab Break, if not, insert a new Tab Break
      let first_field = non_custom_fields.length > 0 ? non_custom_fields[0] : null;
      if(first_field && first_field.fieldtype != 'Tab Break'){
        if(first_field.name.indexOf('-') == -1){
          //custom fields have names of the form DocType-field_name
          tbs.splice(0, 0, {
            'fieldtype': 'Tab Break',
            'fieldname': 'DEFAULT_TAB',
            'label': APP._('FORM_VIEW_PAGE.DETAILS_TAB_TITLE')
          })
        }
      }
    }  
    set_tabs(tbs); 
  }

  /**
   * Get form definition
   * @param doctype 
   */
  const get_doctype = async () => {
    const doc_definition = await db.get_doctype(); 
    set_doctype(form_def => doc_definition);
    get_tabs();
    const tbname = tabs?.length > 0 ? tabs[0].fieldname : '' 
    set_selected_tab(tbname);
  }

  /**
   * Get form record
   */
  const get_doc = async () => {    
    if (docname && docname != undefined && !UIUtil.is_new_record(docname)){
      const fdoc = await db.get_doc(docname); 
      set_doc(fdoc);
    } else { 
      const fdoc = await db.new_doc(initial_values)
      set_doc(fdoc);
    }
    // if(doc && doc !== undefined){ 
    //   set_doc(doc); 
    // } else {
    //   if (docname && docname !== undefined && docname !== GLOBALS.NEW_RECORD_ID){
    //     const fdoc = await db.get_doc(docname);
    //     set_doc(fdoc); 
    //   } else {
    //     const fdoc = await db.new_doc(null)
    //     set_doc(fdoc); 
    //   }
    // } 
  }

  /**
   * Get forms to display on the form
   * @returns 
   */
  const get_form_fields = () => {
    const fields = doctype?.fields?.filter((df: object) => { 
      if(non_form_fields.includes(df.fieldtype)){
        return false
      }
      if(df.depends_on
        && !evaluate_depends_on(df.depends_on, selected_field_value)){
        return false
      }
      if(df.mandatory_depends_on){
        let res = evaluate_depends_on(df.mandatory_depends_on, selected_field_value)
        df.reqd = res
      } 
      return !non_form_fields.includes(df.fieldtype);
    }); 
    set_form_fields(visible_fields => fields);
  }

  const get_default_value = (field: object) => {
    if(field.default) return field.default; 
    if(Transformer.is_numeric_field(field)) return 0
    return ''
  }

  const on_update_value = (field: string, value: object) => {  
    let curr_state = doc;
    curr_state[field] = value;
    set_doc(curr_state) 
  }

  const on_change_value = (value: object) => {   
    set_selected_field_value(value);
  }

  const evaluate_depends_on = (expression:string, selected_field: object) => {      
    console.log("Evaluating depends on 3")
    //check if visibility is based on another field
    if(expression){
      let tmp = expression
      if(tmp.indexOf('doc.') === -1){
        //If we have an expression without doc. prefix
        tmp = 'doc.' + tmp
      }
      let exp = tmp.replace(/eval:/g, "").replace(/doc./g, "doc.")
      
      console.log("Expression: ", exp);
      let res = eval(exp)
      return res
    } 
    return true
  }
 
  useEffect(() => { 
    get_doctype(); 
  }, []); 
  
  useEffect(() => { 
    /*const do_load = async () => {
      get_tabs();
      get_form_fields();
      if(!doc){ // only fetch if initial_doc was not provided
        await get_doc();
      } 
      set_loading(false);
    }
    do_load();*/
  }, [doctype]);

  useEffect(() => {
    /*let data_obj = {};    
    form_fields?.map((fld, idx) => { 
      data_obj[fld.fieldname] = doc[fld.fieldname];//  get_default_value(fld);
    }); 
    set_initial_values(vals => data_obj); 
    */
     make_form_config();
  }, [doc, form_fields]);
 
  useEffect(() => {  
  }, [initial_values])

  const make_form_config = (fields: Array<object> = []) => {
    let data_obj = { doctype: doctype_name, docname: docname };
    let form_cfg = {'fields': [], 'validation_schema': {}};
    let validation_rules = {};
    let frm_fields = fields?.length > 0 ? fields : form_fields;
    frm_fields?.map((field, idx) => { 
      let key = field.fieldname;  

      /* Transform into generic props*/
      let clone_field = Transformer.transform_field(field);
      form_cfg.fields.push(clone_field);

      /* Get value of field from retrieved or created doc */ 
      data_obj[key] = doc?.[key] || null;
      // data_obj[fld.fieldname] = doc[fld.fieldname];//  get_default_value(fld);

      /* Make validation schema */
      validation_rules[key] = RuleBuilder.build(clone_field);
      // 
    }); 
    set_initial_values(vals => data_obj);   
    form_cfg.validation_schema = validation_rules;// Yup.object().shape(validation_rules); 
    set_form_config(cfg => form_cfg); 
    return form_cfg;
  } 
 
   /**
   * Get tab breaks defined in the form
   */
   const get_fields_by_type = (field_types: Array<string>) => { 
    if(typeof field_types == 'string') field_types = [field_types];
    return doctype?.fields?.filter((itm)=>field_types.includes(itm.fieldtype)); 
  }

  /**
   * Sanitize values that go into Frappe backend
   * For each backend, have its own method to sanitize its values
   * @param values 
   */
  const sanitize_values = async(values) => {
    const _parse_dates = () => {  
      let date_fields = get_fields_by_type([FIELD_TYPE.DATE]);
      for(const fld of date_fields){
        let dt = values[fld.fieldname];
        if(dt){
          values[fld.fieldname] = format_date(dt);
        }
      }
    }    
    _parse_dates()//sanitize dates
    return values;
  }

  const handle_submit = async (values) => {
    /**
     * If props.on_insert_child_row is specified, run it ignoring the form submit routine
     */
    values = await sanitize_values(values);
    if(props.on_insert_child_row) {      
      props.on_insert_child_row(values);
      reset_form_store(values.doctype);
      return
    }
    // Handle form submission (e.g., send data to the server) 
      values.name = docname === undefined || docname == GLOBALS.NEW_RECORD_ID ? null : docname;
 
      const res = await db.upsert_doc(values) 
      if (res){
        //reset form state
        reset_form_store(doctype_name);
        APP.navigate_to_path(navigation, 'views/list/[doctype]', {
          doctype: doctype_name
        }); 
      } else {
        //throw error
      } 
  }; 

  useEffect(() => {
    // Re-initialize form state
    reset_form_store(doctype_name);
  }, []);

  return (
    <View> 
      {
        /* Create segmented buttons (equivalent to vertical tabs). Use segmented because there is no supported
           button group element in reactnativepaper lib.
        */
        // Where there is more than 1 Tab break
        // tabs?.length > 0 && render_tabs() 
      }
      { 
        (doctype && doctype.fields?.length > 0) ? <FormGenerator 
          doctype={doctype_name}
          docname={docname}
          doc={doc}
          fields={doctype.fields}
          form_config={form_config} 
          initial_values={initial_values} 
          on_submit={handle_submit}
          is_child_table={doctype.istable}
          show_save_button={show_save_button}
          ref={ref}
          navigation={navigation}
        /> : <AppLoader />
        // (loading === false && initial_values 
        //   && doctype && form_config 
        //   && form_config.fields.length > 0) ? <FormGenerator 
        //   doctype={doctype_name}
        //   docname={docname}
        //   doc={doc}
        //   fields={doctype.fields}
        //   form_config={form_config} 
        //   initial_values={initial_values} 
        //   on_submit={handle_submit}
        //   show_save_button={show_save_button}
        //   ref={ref}
        // /> : <AppLoader />
      }  
      {        
        // (loading === false && initial_values) ? form_tabs[active_tab] : <AppLoader />
      } 
    </View> 
  )
}

export default forwardRef(FrappeUIGenerator)