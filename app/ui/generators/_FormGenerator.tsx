import React, { createRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from 'yup'; 
import { FIELD_TYPE, SPECIAL_TEXT_FIELD_TYPE } from "@/app/constants/enums";
import { Dimensions, Keyboard, ScrollView, StyleSheet, View } from "react-native";
import { Transformer } from "../transformer";
import { IDateProps, ISelectProps, INumericProps, ICheckBoxProps, IDataProps, ITableMultiSelectProps } from "@/app/interfaces/inputs";
import { APP } from "@/app/utils/app";
import { AppButton } from "@/app/components/shared/AppButton";
import { UIUtil } from "@/app/utils/ui";  
import { Card, SegmentedButtons, Text } from "react-native-paper"; 
import FileUploader from "../../components/shared/FileUploader"; 
import { IChildTableProps } from "@/app/interfaces/inputs";

import { 
    AppCurrency,
    AppData,
    AppDate,
    AppFloat,
    AppInt,
    AppLink,
    AppLongText,
    AppSelect, 
    AppCheckBox, 
    AppPassword, 
    AppSmallText,
    ChildTable,
    MultiSelectChildTable
} from '../../components/form/controls';
import { DocTypeService } from "../../services/doctype";
import { RuleBuilder } from "../rule_builder";
import { format_date, parse_date } from "../../utils/date"; 
import { form_store_exists, get_field_store_value, get_form_store, update_field_store_value, set_form_store } from "../utils/state";
import { FormStore } from "../store/form";  
import { IDocFormProps } from "../interfaces/ui";
import { GLOBALS } from "../../constants/defaults"; 
import withStore from "../../components/hoc/withStoreValue";
import KeyboardAvoidingWrapper from "../../components/shared/KeyboardAvoidingWrapper";
import { useNavigation } from "expo-router";
import AppLoader from "@/app/components/shared/AppLoader";

const NON_FORM_FIELDS = [
    'Tab Break',
    'Section Break',
    'Column Break'
]

// const FormGenerator = ( { form_config, initial_values, on_submit }) => {  
const FormGenerator = (form_props: IDocFormProps, ref) => {  
    // See advanced https://github.com/fateh999/react-native-paper-form-builder/blob/master/src/Inputs/InputSelect.tsx 
    // const { navigation } = form_props;
    const navigation = useNavigation();
    const { on_submit, show_save_button = true, fields=[], ...rest } = form_props; 
    const initial_doc = form_props.doc;
    const formik_ref = useRef(null);//ref;// useRef(null); 
    const [tabs, set_tabs] = useState([]);
    const [form_tabs, set_form_tabs] = useState({});
    const [active_tab, set_active_tab] = useState(null);
    //const [form_fields, set_form_fields] = useState([]); 
    const [doc, set_doc] = useState(form_props.doc || {}); 
    const db = new DocTypeService(form_props.doctype);
    const [initial_values, set_initial_values] = useState(form_props.initial_values) ;//({ name: '' });
    const [form_config, set_form_config] = useState({'fields': [], 'validation_schema': {}}); //form_props.form_config
    const [segment, set_segment] = useState('');// set segment for the navigation buttons 
    const [loading, set_loading] = useState(true);

    const forms = FormStore.useState(s=>s.forms);
    const { width, height } = Dimensions.get('window');


    useEffect(()=> {
      console.log("Values changed")
    }, [formik_ref.current?.values])
    /**
   * Get form record
   */
  const get_doc = async () => {
    let stored_doc = null;
    if(form_store_exists(form_props.doctype, forms)){ 
      stored_doc = get_form_store(form_props.doctype, forms); 
      if(stored_doc){
        set_doc(stored_doc);
      }
    }
    else {
      console.log("Form state does NOT exist")  
    }
    if(stored_doc == null) 
    {  
      const docname = form_props.docname;
      if (docname && docname !== undefined && !UIUtil.is_new_record(docname)){ 
        const fdoc = await db.get_doc(docname); 
        set_doc(fdoc); 
        set_form_store(form_props.doctype, fdoc);
      } else { 
        let fdoc = await db.new_doc(null);
        // update with initial values 
        fdoc = APP.update_dict(initial_values);
        set_doc(fdoc); 
        set_form_store(form_props.doctype, fdoc);
      } 
    }
  }

    /**
     * Get form fields to display including assessing runtime display or reqd options for the 
     * fields that depend on others. Ensure the field config supplied conforms to the IBaseFieldProps interface
     * @param formik_props 
     * @returns 
     */
    const get_form_fields = (formik_props: object) => {
        // const selected_value = null; 
        console.log("RE-rendering")
        // for fields in other tabs, set display: none
        const clone_fields = [...fields]; // make a copy to maintain the original state
        const tab_fields = form_tabs?.[active_tab] || [];  
        //const flds = clone_fields?.filter((df) => {
        const flds = tab_fields?.filter((df) => {            
            if(!df) return false; 
            let res = tab_fields?.filter((el) => el.fieldname == df.fieldname); 
            if(res.length == 0) {
                df['hidden'] = 1; // set hidden to 1  
            } else { 
                /*
                if field does not belong to the active tab, set display to none. this is because react does not have support for keep-alive like in VueJS
                See https://github.com/facebook/react/issues/12039 
                */ 
                if(NON_FORM_FIELDS.includes(df.fieldtype)){
                    return false;
                }
                if(df.depends_on && !evaluate_depends_on(df, df.depends_on, /*selected_value,*/ formik_props)){
                    df['style'] = {display: 'none'};
                    return false;
                    //instead of returning false, proceed but set display to none since react does not support keep-alive
                    //return false
                }
                if(df.mandatory_depends_on){
                    let res = evaluate_depends_on(df, df.mandatory_depends_on,  /*selected_value,*/ formik_props)
                    df.reqd = res
                } 
            }
            return !NON_FORM_FIELDS.includes(df.fieldtype)
        })
        //set_form_fields(flds);
        return flds;
    }

    /**
     * Evaluate depends on
     * Works well on initial render. However it does not work thereafter since it is dependent on
     * the values of the form
     * @param expression 
     * @param formik_props 
     * @returns 
     */
    const evaluate_depends_on = (field: object, expression:string, /*selected_field: object,*/ formik_props: object) => {     
      let exp_str;
      var vals = form_props.values;
      const _eval = (xpr) => { 
        console.log("Evaluating expression:", eval(xpr));
        return eval(xpr); 
      }

      let exp = '1=0';
      //check if visibility is based on another field
      console.log("Evaluating depends on 2: ", formik_props.values)
      if (expression) {
        console.log("Expression: ", expression, " for field: ", field.fieldname)
        let tmp = expression
        if(tmp.indexOf('doc.') === -1){
          //If we have an expression without doc. prefix
          tmp = 'formik_props.values.' + tmp
        }
        // exp = tmp.replace(/eval:/g, "").replace(/doc./g, "formik_props.values.");
        exp = tmp.replace(/eval:/g, "");

        // replace doc.[field] with actual values
        let keys = Object.keys(formik_props.values) || [];
        keys.forEach((key) => {
            let re = new RegExp(`doc.${key}`, "g")
            let val = formik_props.values?.[key];
            if (isNaN(parseFloat(val))){
              val = '"' + val + '"';  
            }
            exp = exp.replace(re, val);
        }) 
        console.log("Exp: ", exp);
        _eval(exp);
        // exp_str = 'var res = ' + exp;
        // console.log("Exp str: ", exp_str);

        // let zz = eval("formik_props.values.assignee_type=='System User'") 
        //let res = eval?.(exp)
        let res = _eval(exp);
        return res
      } 
      return true
    }

      /**
   * Get tab breaks defined in the form
   */
   const get_fields_by_type = (field_types: Array<string>) => { 
    if(typeof field_types == 'string') field_types = [field_types];
    return fields?.filter((itm)=>field_types.includes(itm.fieldtype)); 
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
 
    /**
     * Functions to be exposed to parent components
     */
    useImperativeHandle(ref, () => ({
        is_valid: () => formik_ref?.current?.isValid,
        validate: async () => { return await formik_ref?.current?.validateForm() },
        get_values: () => { 
            if(formik_ref.current){ 
                if(formik_ref.current.isValid){
                    let vals = formik_ref.current.values;
                    return sanitize_values(vals) 
                } 
            }
            return null;
        },
        get_doc_type: () => {  
            return form_props.doctype;
        }
    }), []);

    useEffect(() => {
        const load_initials = async() => {
            get_tabs();
            // if(!doc || Object.keys(doc).length == 0){
            /*if(!initial_doc || Object.keys(initial_doc).length == 0){
              // only retrieve if original doc was not provided 
              await get_doc();
            } else {
              set_doc(initial_doc);
            }*/
            await get_doc();
            set_loading(false)
            //make_form_config();
        } 
        load_initials();
    }, []);

    useEffect(() => {
        make_form_config(); 
    }, [doc])
    // // Grab values and submitForm from context
    // const { values, submitForm } = useFormikContext();
    // React.useEffect(() => {
    //     // Submit the form imperatively as an effect as soon as form values.token are 6 digits long
    //     if (values.token.length === 6) {
    //         submitForm();
    //     }
    // }, [values, submitForm]);

     /**
   * Get tab breaks defined in the form
   */
  const get_tabs = () => { 
    let tbs = fields?.filter((itm)=>itm.fieldtype == 'Tab Break'); 
    if(fields?.length > 0){ 
      let non_custom_fields = fields.filter((itm)=>itm.name.indexOf('-') == -1)
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
    if(tbs.length > 0){
        set_active_tab(tbs[0].fieldname);
    }
  }

    /**
   * Render a single tab panel
   */
  const generate_tab_content = (tab_name: string) => {
    const fields = get_tab_fields(tab_name);
    // const frm_cfg = make_form_config(fields);  
    return fields;
  }

  /**
   * Get fields within a tab panel
   */
  const get_tab_fields = ((tab_name: string) => {
    let tab_fields = []
    // If we are getting fields when there is no TabBreak specified at the start of the form defition, copy starting from first field
    let start_copy = tab_name == 'DEFAULT_TAB' ? true : false
    
    for(var i = 0; i < fields.length; i++){
      let element = fields[i];
      if(!start_copy){
        start_copy = element.fieldname == tab_name; //start copy when we finally locate the tab field we are interested in inside the array            
      }
      else {
        if(element.fieldtype == 'Tab Break'){
          break //If we encounter another tabbreak, we exit
        }
        if(start_copy){
          tab_fields.push(element);
        }
      }
    } 
    return tab_fields;
  })

  /**
   * Generate screens to be displayed as specified by Tab Breaks
   */
  const generate_form_screens = () => {
    if(!tabs) return;
    let screens = {};
    for(const tb of tabs) {  
      let content = generate_tab_content(tb.fieldname);
      screens[tb.fieldname] = content;
    } 
    set_form_tabs(screens);
  }

  useEffect(() => {
    generate_form_screens();
  }, [tabs])

  useEffect(() => {
  }, [initial_values]); 
  
  const parse_val = (val, fld) => {
    /*Get value from formStore. */
    let state_exists = form_store_exists(form_props.doctype, forms);
    let state_val = get_field_store_value(form_props.doctype, fld.fieldname, forms);

    if(state_exists){
      //if val is null, try retrieve from the formstore 
      if(form_props.is_child_table){
        //if child table, do not retrieve state as the state is stored for all rows not specific row field 
        if(doc){
          // If a Child table row is being edited
          val = doc[fld.fieldname];
        } else {
          val = initial_values[fld.fieldname];
        }
      } else {
        val = state_val; // set to state value to allow for preservation of state on form navigation
      }
    }
    // if(!val) {
    //     //if val is null, try retrieve from the formstore 
    //     if(form_props.is_child_table){
    //       //if child table, do not retrieve state as the state is stored for all rows not specific row field 
    //       val = initial_values[fld.fieldname];
    //     }
    //     else {
    //       val = get_field_store_value(form_props.doctype, fld.fieldname, forms); 
    //     }
    // }
    if(!val) return val;
    if(fld.fieldtype == FIELD_TYPE.DATE){
        return parse_date(val);
    }
    return val;
  }

  const make_form_config = (/*fields: Array<object> = []*/) => {
    // const _parse_val = (val, fld) => {
    //     if(!val) {
    //         //if val is null, try retrieve from the formstore 
    //         if(form_props.is_child_table){
    //           //if child table, do not retrieve state as the state is stored for all rows not specific row field 
    //           val = initial_values[fld.fieldname];
    //         }
    //         else {
    //           val = get_field_store_value(form_props.doctype, fld.fieldname, forms); 
    //         }
    //     }
    //     if(!val) return val;
    //     if(fld.fieldtype == FIELD_TYPE.DATE){
    //         return parse_date(val);
    //     }
    //     return val;
    // }
    
 
    let data_obj = { doctype: form_props.doctype, docname: form_props.docname };
    let form_cfg = {'fields': [], 'validation_schema': {}};
    let validation_rules = {};
    let frm_fields = fields;// fields?.length > 0 ? fields : form_fields;
 
    frm_fields?.map((field, idx) => { 
      let key = field.fieldname;   

      /* Transform into generic props*/
      let clone_field = Transformer.transform_field(field);
      form_cfg.fields.push(clone_field); 

      /* Get value of field from retrieved or created doc */ 
      // data_obj[key] = doc?.[key];// doc?.key ? doc.key : ( _parse_val(doc?.key || null, field)); //doc[key] == null || doc[key] == undefined ? null : _parse_val(doc[key], field);
      data_obj[key] = doc?.key ? (parse_val(doc?.key || null, field)) : doc.key; //doc[key] == null || doc[key] == undefined ? null : _parse_val(doc[key], field);
      // data_obj[key] = doc?.key;
      // data_obj[fld.fieldname] = doc[fld.fieldname];//  get_default_value(fld);

      /* Make validation schema */
      validation_rules[key] = RuleBuilder.build(clone_field);
    
    }); 

    const form_key = form_props.doctype;

    // get stored form values. IF they exist, use them, else use the normal initialized values
    const store_values = null;// FormStore.useState((s)=>{ return form_key in s ? s[form_key]: null})
    set_initial_values(vals => store_values == null ? data_obj : store_values); 
    form_cfg.validation_schema = validation_rules;
    set_form_config(cfg => form_cfg); 
    return form_cfg;
  } 

    const render_layout = (field: object, formik_props: object) => {

      const _transform = (fld: object) => {
        let prps = Transformer.transform_field(fld);
        //prps.value = initial_values[fld.fieldname];
        // doc?.key ? (parse_val(doc?.key || null, field)) : doc.key
        // prps.value = initial_values[fld.fieldname];
        prps.value = parse_val(initial_values[fld.fieldname], fld); // initial_values[fld.fieldname];
        prps.form_state = formik_props; 
        return prps;
      }

        if(!field) return null;
 
        const field_type = field.fieldtype;
        let el = null;
        let props = null;
        
        switch (field_type){
            /**
             * Input fields of normal text upto a max of 140 characters
             */
            case FIELD_TYPE.DATA:
            case FIELD_TYPE.PHONE:
                props = _transform(field) as IDataProps;  
                const EnhancedAppData = withStore(AppData)
                //props.on_change_value=formik_props.handleChange(field.fieldname);
                el = (
                    <AppData 
                        {...props} 
                        doctype={form_props.doctype}
                        docname={form_props.docname}
                        on_change_value={(val) => {
                            //formik_props.handleChange(props.field_name); 
                            formik_props.values[props.field_name] = val; 
                          }
                        }  
                    />
                );  
            break;

            case FIELD_TYPE.PASSWORD:
                props = _transform(field) as IDataProps;   
                el = (
                    <AppPassword 
                        {...props}  
                        on_change_value={val => {
                            // formik_props.handleChange(props.field_name);
                            formik_props.values[props.field_name] = val;  
                          }
                        }    
                    />
                );                
            break;

            case FIELD_TYPE.DATE:
                props = _transform(field) as IDateProps; 
                el = (
                    <AppDate 
                        {...props} 
                        on_change_value={val => { 
                            formik_props.values[props.field_name] = val;  
                          }
                        }  
                    />
                );                
            break;

            /**
             * Dropdown list
             */
            case FIELD_TYPE.SELECT:
                props = _transform(field) as ISelectProps;   
                el = (
                        <AppSelect 
                            {...props}  
                            on_change_value={val => {
                                formik_props.values[props.field_name] = val;  
                              }
                            }  
                        />
                    ); 
            break;

            case FIELD_TYPE.LINK:
                props = _transform(field) as ISelectProps;    
                el = (
                        <AppLink 
                            {...props} 
                            on_change_value={val => {
                                formik_props.values[props.field_name] = val;  
                              }
                            }  
                        />
                    ); 
            break;
            
            case FIELD_TYPE.INT:
                props = _transform(field) as INumericProps;   
                el = (
                        <AppInt 
                            {...props} 
                            on_change_value={val => {
                                formik_props.values[props.field_name] = val;  
                              }
                            }  
                        />
                    );
            break;

            case FIELD_TYPE.FLOAT:
                props = _transform(field) as INumericProps;   
                el = (
                        <AppFloat 
                            {...props} 
                            on_change_value={val => {
                                formik_props.values[props.field_name] = val;  
                              }
                            }  
                        />
                    );
            break;

            case FIELD_TYPE.CURRENCY: 
                props = _transform(field) as INumericProps;   
                el = (
                        <AppCurrency 
                            {...props} 
                            on_change_value={val => {
                                formik_props.values[props.field_name] = val;  
                              }
                            }  
                        />
                    );
            break;

            case FIELD_TYPE.CHECKBOX: 
                props = _transform(field) as ICheckBoxProps;   
                el = (
                        <AppCheckBox 
                            {...props} 
                            on_change_value={val => {
                                formik_props.values[props.field_name] = val;  
                              }
                            }  
                        />
                    );
                break;
            case FIELD_TYPE.SMALL_TEXT:
                props = _transform(field) as IDataProps;   
                el = (
                    <AppSmallText   
                        {...props}
                        on_change_value={val => {
                            formik_props.values[props.field_name] = val;  
                          }
                        }  
                    />
                );  
            break;
            case FIELD_TYPE.TEXT: case FIELD_TYPE.LONG_TEXT:
                props = _transform(field) as IDataProps;   
                el = (
                    <AppLongText  
                        {...props}
                        on_change_value={val => {
                            formik_props.values[props.field_name] = val;  
                          }
                        }  
                    />
                );  
            break;
            case FIELD_TYPE.ATTACH || FIELD_TYPE.ATTACH_IMAGE:
                props = _transform(field) as IDataProps;   
                el = (
                    <FileUploader 
                        {...props}
                        type={field_type == FIELD_TYPE.ATTACH ? ["*/*"] : ["image/*"]}
                        multiple={false}  
                        on_change_value={val => {
                            formik_props.values[props.field_name] = val;  
                          }
                        }  
                    />
                );  
            break;
            case FIELD_TYPE.TABLE:
                props = _transform(field) as IChildTableProps;   
                const table_ref = createRef(null);
                el = (
                    <ChildTable
                        {...props}  
                        //navigation={navigation}
                        ref={table_ref}
                        // doctype={props.doctype}
                        parent={form_props.docname}
                        parenttype={form_props.doctype}
                        parentfield={props.field_name}
                        // name={props.field_name}  
                        // field={props} 
                        // value={initial_values[props.field_name]} 
                        on_change={(rows) => {                            
                            // const rows = table_ref?.current?.get_rows();  
                            formik_props.values[props.field_name] = rows; 
                          }
                        }
                    />
                );  
            break;
            case FIELD_TYPE.MULTI_SELECT_TABLE:
                props = _transform(field) as ITableMultiSelectProps;   
                const multi_table_ref = createRef(null);
                el = (
                    <MultiSelectChildTable
                        {...props}  
                        parent={form_props.docname}
                        parenttype={form_props.doctype}
                        parentfield={props.field_name}
                        // name={props.field_name}  
                        // field={props} 
                        // value={initial_values[props.field_name]} 
                        on_change_value={(rows, link_field) => {                            
                            // const rows = table_ref?.current?.get_rows();   
                            // For multitable select, convert them into a Table format, so set doctype and the value of the link field
                            const docs = [];
                            rows?.map((row, idx) => {
                              const new_doc = {
                                'doctype': field.options,
                              }
                              if(link_field){
                                new_doc[link_field.fieldname] = row;
                              }
                              docs.push(new_doc)
                            })  
                            formik_props.values[props.field_name] = docs; 
                          }
                        }
                    />
                );  
            break;
            default: 
            break;
        }

        if(el) { 
            return (<View key={props.field_name}>
                        {el}
                        {/* <ErrorMessage name={field.fieldname}>{msg => <Text>{msg}</Text>}</ErrorMessage>  */}
                    </View>)
        }
        return <View key={field.fieldname}></View>
    }

    const render_tabs = (formik_props) => {
        return (
          <View>
            {
              tabs?.map((tab, idx) => { 
                const label = `${idx+1}.${tab.label}`;
                return (
                    <SegmentedButtons
                      key={tab.fieldname}
                      value={segment}
                      onValueChange={set_segment}  
                      style={{ alignItems: 'center', justifyContent: 'center'}}
                      buttons={[
                        {
                          value: tab.fieldname,
                          label: `${idx+1}.${tab.label}`,
                          showSelectedCheck: true,
                          onPress: ()=>{ 
                            //persist the values in the store before switching tabs
                            get_form_fields(formik_props)?.map((field, idx) => { 
                              // only update store if the active tab is about to change
                              update_field_store_value(form_props.doctype, field.fieldname, formik_props.values[field.fieldname]);
                            });
                            set_active_tab(tab.fieldname);                           
                          },
                          style: { flex: 1, alignSelf:'center', flexGrow: 1, borderRadius: 0, borderColor: 'white', display: tabs.length > 1 ? 'flex': 'none' }
                        }, 
                      ]}
                  />
                )
              })
            }
        </View>
        )
      }
    
    /**
     * Get title to show on the form
     * @returns 
     */
    const get_form_title = () => { 
      return UIUtil.is_new_record(form_props.docname) ? `${GLOBALS.NEW_RECORD_ID} ${form_props.doctype}` : `${form_props.docname}`;
    }
      return ( 
          loading ? <AppLoader /> : 
          <KeyboardAvoidingWrapper> 
              <Formik 
                  innerRef={formik_ref /*ref*//*(f) => (ref.current = f)*/}
                  initialValues={initial_values}
                  validationSchema={Yup.object().shape(form_config.validation_schema)} 
                  onSubmit={(values, actions) => { 
                      on_submit(values); 
                      //actions.resetForm();
                  }}
              >
                  { 
                      (formik_props) => ( 
                          <Card style={styles.form_container}> 
                              {
                                  show_save_button && !form_props.is_child_table 
                                  && <Card.Actions style={styles.actions}>
                                      <Text variant='titleSmall' style={styles.title_text}>{get_form_title()}</Text>
                                      <AppButton 
                                          icon='content-save' 
                                          mode='contained'
                                          style={{ width: 100 }}
                                          compact
                                          label={APP._("BUTTON.SAVE")} 
                                          on_press={()=> {    
                                              formik_props.validateForm().then((res) => { 
                                              })
                                              formik_props.handleSubmit();
                                            } 
                                          }
                                      />  
                                  </Card.Actions>
                              } 
                              <Card.Content>
                                  <ScrollView style={{ flexGrow: 1, maxHeight: height * 0.70 }}>
                                      {
                                          tabs?.length > 0 && render_tabs(formik_props)
                                      }
                                      <View>
                                        {/* Doc specific fields */}                                
                                        <AppData visible={false} name='doctype' field={{ name:'doctype', fieldtype:'Data', fieldname:'doctype', hidden: 1 }} style={{ display: 'none'}} value={form_props.doctype} />
                                        <AppData visible={false} name='docname' field={{ name:'doctype', fieldtype:'Data', fieldname:'doctype', hidden: 1 }} style={{ display: 'none'}} value={form_props.docname} />
                                        {       
                                            get_form_fields(formik_props)?.map((field, idx) => { 
                                                return render_layout(field, formik_props);
                                            })                            
                                            // form_config.fields.map((field, idx) => { 
                                            //     return render_layout(field, formik_props);
                                            // })
                                        }        
                                      </View>     
                                  </ScrollView>
                              </Card.Content>    
                          </Card>
                      )
                  }
              </Formik> 
          </KeyboardAvoidingWrapper>   
    )
}

export default forwardRef(FormGenerator)

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        //flexDirection: 'column',
        // justifyContent: 'flex-end'
    },
    containerStyle: {
        // flex: 1,
    },
    scrollViewStyle: {
        // flex: 1,
        // padding: 15,
        // justifyContent: 'center',
        //flexGrow: 1
    },
    headingStyle: {
        // fontSize: 30,
        // textAlign: 'center',
        // marginBottom: 40,
    },
    form_container: { marginTop: -5 },
    actions: { display: 'flex', justifyContent: 'space-between'},
    title_text: { fontWeight: 'bold', flex: 10 }
})