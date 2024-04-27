import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalStyles } from '@/app/styles/global';
import { Card } from 'react-native-paper';
import { APP } from '@/app/utils/app';
import { AppData } from '@/app/components/form/controls';
import { useNavigation } from 'expo-router';
import { DocTypeService } from '@/app/services/doctype';
import { AuthService } from '../services/auth';
import * as Yup from 'yup';
import { AppButton } from '@/app/components/shared/AppButton';
import KeyboardAvoidingWrapper from '@/app/components/shared/KeyboardAvoidingWrapper';

const UpdateUserDetails = () => {
    const navigation = useNavigation();
    const [initial_values, set_initial_values] = useState({ first_name: '', middle_name: '', last_name: ''});
    const [doc, set_doc] = useState();
    const validation_schema = Yup.object().shape({
      first_name: Yup.string().required(APP._('VALIDATION.REQUIRED')),
      middle_name: Yup.string().nullable(),
      last_name: Yup.string().nullable()
    })

    const db = new DocTypeService('User');

    const on_update_profile = async (values) => { 
      let obj = {...doc};
      obj.first_name = values.first_name;
      obj.middle_name = values.middle_name;
      obj.last_name = values.last_name;
      const res = await db.update_doc(obj, obj.name);
      if(res) {
        APP.notify(APP._('GLOBAL.SAVE_SUCCESS_MESSAGE'))
      } else {
        APP.notify_error(APP._('GLOBAL.SAVE_ERROR_MESSAGE'));
      }
    }
    useEffect(()=> {
      const load = async() => {
        const usr = await AuthService.get_current_user(); 
        if(usr){
          const usr_doc = await db.get_doc(usr.name);
          set_doc(usr_doc); 
          if(usr_doc){
            set_initial_values({first_name: usr_doc.first_name, middle_name: usr_doc?.middle_name, last_name: usr_doc?.last_name });
          }
        }
      }
      load();
    }, []);

  return ( 
        <KeyboardAvoidingWrapper>
          <View style={GlobalStyles.container}> 
            <View>
              <Formik         
                initialValues={initial_values}
                validationSchema={validation_schema}
                onSubmit={(values, actions) => { 
                    on_update_profile(values);
                    //actions.resetForm();
                }}
              >
                { 
                    (formik_props) => (       
                        <Card>
                          {/* <Card.Cover source={{ uri: 'https://as2.ftcdn.net/v2/jpg/03/28/17/19/1000_F_328171945_cMFEZy3PEXC9pnNvBifFVr0IrouZMqkp.jpg'}} /> */}
                          <Card.Title style={{ alignItems: 'center'}} title={APP._('USER_PROFILE_PAGE.TITLES.PAGE')} subtitle={APP._('USER_PROFILE_PAGE.TITLES.USER_DETAILS')} />  
                            <Card.Content> 
                            <AppData
                              field_name='first_name'
                              label={APP._('USER_PROFILE_PAGE.LABELS.FIRST_NAME')}
                              form_state={formik_props} 
                              on_change_value={(text)=> { 
                                formik_props.values['first_name'] = text;  
                              }} 
                              returnKeyType="next" 
                            />

                            <AppData
                              field_name='middle_name'
                              label={APP._('USER_PROFILE_PAGE.LABELS.MIDDLE_NAME')}
                              form_state={formik_props} 
                              on_change_value={(text)=> { 
                                formik_props.values['middle_name'] = text;  
                              }} 
                              returnKeyType="next" 
                            />

                            <AppData
                              field_name='last_name'
                              label={APP._('USER_PROFILE_PAGE.LABELS.LAST_NAME')}
                              form_state={formik_props} 
                              on_change_value={(text)=> { 
                                formik_props.values['last_name'] = text;  
                              }} 
                              returnKeyType="done" 
                            />
                              <View style={styles.update_button_container}>
                                <AppButton 
                                    icon='content-save' 
                                    mode='contained'
                                    compact
                                    label={APP._("USER_PROFILE_PAGE.BUTTONS.UPDATE_USER_INFO")} 
                                    on_press={()=> {   
                                        formik_props.validateForm().then((res) => { 
                                        })
                                        formik_props.handleSubmit();
                                      } 
                                    }
                                  /> 
                              </View>  
                            </Card.Content>    
                        </Card>
                    )
                }
              </Formik> 
            </View> 
          </View> 
        </KeyboardAvoidingWrapper> 
  )
}

export default UpdateUserDetails

const styles = StyleSheet.create({
  update_button_container: {
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    justifyContent: 'flex-end'
  }
})