import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalStyles } from '@/app/styles/global';
import { Card } from 'react-native-paper';
import { APP } from '@/app/utils/app';
import { AppData, AppPassword } from '@/app/components/form/controls';
import { useNavigation } from 'expo-router';
import { DocTypeService } from '@/app/services/doctype';
import { AuthService } from '../services/auth';
import * as Yup from 'yup';
import { AppButton } from '@/app/components/shared/AppButton';
import KeyboardAvoidingWrapper from '@/app/components/shared/KeyboardAvoidingWrapper';

const ChangePassword = () => {
    const navigation = useNavigation();
    const [initial_values, set_initial_values] = useState({ current_password: '', new_password: '', confirm_password: ''});
    const [doc, set_doc] = useState();
    const validation_schema = Yup.object().shape({
      current_password: Yup.string().required(APP._('VALIDATION.REQUIRED')),
      new_password: Yup.string()
           .required(APP._('VALIDATION.REQUIRED')),
      //   .min(8, "Pasword must be 8 or more characters")
      //   .matches(/(?=.*[a-z])(?=.*[A-Z])\w+/, "Password ahould contain at least one uppercase and lowercase character")
      //   .matches(/\d/, "Password should contain at least one number")
      //   .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "Password should contain at least one special character"),,
      confirm_password: Yup.string().when("new_password", (new_password, field) => {
        if (new_password) {
          return field.required(APP._('VALIDATION.REQUIRED')).oneOf([Yup.ref("new_password")], APP._('USER_PROFILE_PAGE.MESSAGES.PASSWORD_MISMATCH'));
        }
      }),
    }) 

    const db = new DocTypeService('User');

    const on_change_password = async (values) => {
      let obj = {...doc};
      const login_as = doc.name || doc.username || doc.mobile_no || doc.email; 
      // check new password by logging in
      const [logged_in, usr] = await AuthService.login(login_as, values.current_password);
      if(logged_in){
        // check if new passwords match even if Yup had checked
        const res = await AuthService.change_password(doc.name, values.new_password);
        if(res) {
          // If password changed successfully, relogin since Frappe will destroy all sessions on password change
          APP.notify(APP._('GLOBAL.SAVE_SUCCESS_MESSAGE'));
          const [sc, us] = await AuthService.login(login_as, values.new_password);
          if(!sc){
            await AuthService.logout();
            APP.navigate_to_path(navigation, '/modules/auth/screens/login_screen', {}, {});
          }
        } else {
          APP.notify_error(APP._('GLOBAL.SAVE_ERROR_MESSAGE'));
        }
      } 
      else {
        APP.notify_error(APP._('USER_PROFILE_PAGE.MESSAGES.PASSWORD_INCORRECT'))
      } 
    }
    useEffect(()=> {
      const load = async() => {
        const usr = await AuthService.get_current_user();
        if(usr){
          const usr_doc = await db.get_doc(usr.name);
          set_doc(usr_doc);
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
                    on_change_password(values);
                    //actions.resetForm();
                }}
              >
                { 
                    (formik_props) => (       
                        <Card>
                          {/* <Card.Cover source={{ uri: 'https://as2.ftcdn.net/v2/jpg/03/28/17/19/1000_F_328171945_cMFEZy3PEXC9pnNvBifFVr0IrouZMqkp.jpg'}} /> */}
                          <Card.Title style={{ alignItems: 'center'}} title={APP._('USER_PROFILE_PAGE.TITLES.CHANGE_PASSWORD')} />  
                            <Card.Content> 
                            <AppPassword
                              field_name='current_password'
                              label={APP._('USER_PROFILE_PAGE.LABELS.CURRENT_PASSWORD')}
                              form_state={formik_props} 
                              on_change_value={(text)=> { 
                                formik_props.values['current_password'] = text;  
                              }} 
                              returnKeyType="next" 
                            />

                            <AppPassword
                              field_name='new_password'
                              label={APP._('USER_PROFILE_PAGE.LABELS.NEW_PASSWORD')}
                              form_state={formik_props} 
                              on_change_value={(text)=> { 
                                formik_props.values['new_password'] = text;  
                              }} 
                              returnKeyType="next" 
                            />

                            <AppPassword
                              field_name='confirm_password'
                              label={APP._('USER_PROFILE_PAGE.LABELS.CONFIRM_NEW_PASSWORD')}
                              form_state={formik_props} 
                              on_change_value={(text)=> { 
                                formik_props.values['confirm_password'] = text;  
                              }} 
                              returnKeyType="done" 
                            />
                              <View style={styles.update_button_container}>
                                <AppButton 
                                    icon='content-save' 
                                    mode='contained'
                                    compact
                                    label={APP._("USER_PROFILE_PAGE.BUTTONS.CHANGE_PASSWORD")} 
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

export default ChangePassword

const styles = StyleSheet.create({
  update_button_container: {
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    justifyContent: 'flex-end'
  }
})