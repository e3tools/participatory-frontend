import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik';
import { SafeAreaView } from 'react-native-safe-area-context';
//import { GlobalStyles } from '@/app/styles/global';
import { Card } from 'react-native-paper';
import { APP } from 'common';
import { AppData } from 'ui/components/form/controls';
import { useNavigation } from 'expo-router';
import { DocTypeService } from 'data-layer/services/doctype';
import { AuthService } from '../services/auth';
import * as Yup from 'yup';
import { AppButton } from 'ui/components/shared/app_button';
import KeyboardAvoidingWrapper from 'ui/components/shared/keyboard_avoiding_wrapper';
import * as CONFIG from '../config';
import { useAuthDispatch, useAuthSelector } from '../state/hooks';
import { User } from '../state/state.types';
import { updateUser } from '../state/user/actions/user.action';

const GlobalStyles = CONFIG.GlobalStyles;

interface UserProfile {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
}

const UpdateUserDetails = () => {
  const dispatch = useAuthDispatch();
    const navigation = useNavigation();
    const [initial_values, set_initial_values] =
      useState <UserProfile | undefined>(undefined);//{ first_name: '', middle_name: '', last_name: ''});
    // const [doc, set_doc] = useState(); 
    const user = useAuthSelector((state) => state.user.loggedInUser);
    const validation_schema = Yup.object().shape({
      first_name: Yup.string().required(APP._('VALIDATION.REQUIRED')),
      middle_name: Yup.string().nullable(),
      last_name: Yup.string().nullable()
    })

    const db = new DocTypeService('User');

    const on_update_profile = async (
      first_name: string = '',
      middle_name: string = '',
      last_name: string = ''
    ) => {
      let usr: User = { ...user, first_name, middle_name, last_name }; 
      // const res = await db.update_doc(obj, obj.name);
      const res = await dispatch(updateUser(usr));
      if (res) {
        APP.notify(APP._("GLOBAL.SAVE_SUCCESS_MESSAGE"));
        // set_doc(res); //reset doc to saved record other wise a TimeStampMismatchError may occur if user clicks update again
      } else {
        APP.notify_error(APP._("GLOBAL.SAVE_ERROR_MESSAGE"));
      }
    }; 

    useEffect(()=> {
      // const load = async() => {
      //   const usr = await AuthService.get_current_user();  
      //   if(usr){
      //     const usr_doc = await db.get_doc(usr.name);
      //     set_doc(usr_doc); 
      //     if(usr_doc){ 
      //       set_initial_values({ 'first_name': usr_doc.first_name, 'middle_name': usr_doc?.middle_name, 'last_name': usr_doc?.last_name });
      //     }
      //   }
      // }
      // load();  
      set_initial_values({
        first_name: user?.first_name,
        middle_name: user?.middle_name,
        last_name: user?.last_name,
      });
    }, []);
 
    useEffect(()=> { 
    }, [initial_values])

  return ( 
        <KeyboardAvoidingWrapper>
          <View style={GlobalStyles?.container}> 
            <View>
              {
                  initial_values && <Formik         
                    initialValues={initial_values}
                    validationSchema={validation_schema}
                    onSubmit={(values, actions) => { 
                        on_update_profile(values.first_name, values.middle_name, values.last_name);
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
                                  name='first_name'
                                  label={APP._('USER_PROFILE_PAGE.LABELS.FIRST_NAME')}
                                  form_state={formik_props} 
                                  value={initial_values.first_name}
                                  on_change_value={(text)=> { 
                                    formik_props.values['first_name'] = text;  
                                  }} 
                                  returnKeyType="next" 
                                />
                                <AppData
                                  field_name='middle_name'
                                  name='middle_name'
                                  label={APP._('USER_PROFILE_PAGE.LABELS.MIDDLE_NAME')}
                                  form_state={formik_props} 
                                  value={initial_values.middle_name}
                                  on_change_value={(text)=> { 
                                    formik_props.values['middle_name'] = text;  
                                  }} 
                                  returnKeyType="next" 
                                />

                                <AppData
                                  field_name='last_name'
                                  name='last_name'
                                  label={APP._('USER_PROFILE_PAGE.LABELS.LAST_NAME')}
                                  form_state={formik_props} 
                                  value={initial_values.last_name}
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
              }              
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