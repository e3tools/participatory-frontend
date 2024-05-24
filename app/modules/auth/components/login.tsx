import { StyleSheet, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Navigation } from '@/app/core/types'
import KeyboardAvoidingWrapper from '@/app/components/shared/KeyboardAvoidingWrapper'
import { AppButton } from '@/app/components/shared/AppButton' 
import Header from '@/app/components/shared/Header'
import { APP } from '@/app/utils/app'
import { Avatar, Card, IconButton, TextInput } from 'react-native-paper'
import BaseTextInput from '@/app/components/form/controls/base_text_input'
import { Formik } from 'formik';
import * as Yup from "yup"; 
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { AppData, AppPassword } from '@/app/components/form/controls'
import { AuthService } from '../services/auth'
import { useNavigation } from 'expo-router'
import { Text } from 'react-native-paper'
import { UserStore } from '../stores/user_store'
import { useAuth } from '@/app/contexts/auth'
 
const Login = () => { 
  const navigation = useNavigation();
  const auth = useAuth();
  
  const [username, set_username] = useState({ value: 'Administrator', error: '' });
  const [password, set_password] = useState({ value: '123', error: '' });
  // const [username, set_username] = useState({ value: '', error: '' });
  // const [password, set_password] = useState({ value: '', error: '' });
  const [loading, set_loading] = useState(false);

  const initial_values = {'username': '', password: ''};
  const validation_schema = Yup.object().shape({
    username: Yup.string().required(APP._('VALIDATION.REQUIRED')),
    password: Yup.string().required(APP._('VALIDATION.REQUIRED')),
    // password: Yup.string()
    //   .required("This field is required")
    //   .min(8, "Pasword must be 8 or more characters")
    //   .matches(/(?=.*[a-z])(?=.*[A-Z])\w+/, "Password ahould contain at least one uppercase and lowercase character")
    //   .matches(/\d/, "Password should contain at least one number")
    //   .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "Password should contain at least one special character"),
    // confirmPassword: Yup.string().when("password", (password, field) => {
    //   if (password) {
    //     return field.required("The passwords do not match").oneOf([Yup.ref("password")], "The passwords do not match");
    //   }
    // }),
  }) 

  const on_login = async (values: object) => {
    APP.toggle_loading(true);
    await UserStore.remove_user();
    set_loading(true); 
    // const [res, user] = await AuthService.login(values.username, values.password);
    const [res, user] = await auth.login(values.username, values.password); 
    if(res) {
      APP.toggle_loading(false);
      set_loading(false);
      // APP.notify(APP._('LOGIN_PAGE.LOGIN_SUCCESS_MESSAGE')); 
      // APP.navigate_to_path(navigation, 'index');
      // APP.navigate_to_path(navigation, '/modules/engage/screens/engage_index_screen');
      APP.route_to_path('/modules/engage/screens/engage_index_screen');
    } else {
      APP.show_message(APP._('LOGIN_PAGE.LOGIN_FAILURE_MESSAGE'));
      APP.toggle_loading(false);
      set_loading(false);
    }
  } 
 
  useLayoutEffect(() => { 
    navigation.setOptions({ title: APP._('APP_NAME') });
  }, []);

  return (    
      <SafeAreaView>
        <KeyboardAvoidingWrapper> 
          <View style={styles.container}> 
          
            <View>
              <Text style={styles.app_name}>{APP._('APP_NAME')}</Text>
              <Formik          
                initialValues={initial_values}
                validationSchema={validation_schema}
                onSubmit={async (values, actions) => { 
                    const res = on_login(values);
                    if(!res){
                      set_loading(false);
                    }
                    //actions.resetForm();
                }}
              >
                { 
                    (formik_props) => (       
                        <Card>
                          {/* <Card.Cover source={{ uri: 'https://as2.ftcdn.net/v2/jpg/03/28/17/19/1000_F_328171945_cMFEZy3PEXC9pnNvBifFVr0IrouZMqkp.jpg'}} /> */}
                          <Card.Title  
                            left={(props) => <Avatar.Icon {...props} size={80} icon="account-key" style={{ display: 'none'}}/>} 
                            />     
                            <View style={{ alignItems: 'center'}}>
                              <Avatar.Icon size={80} icon="account-key" />
                            </View>                    
                            <Text style={{ textAlign: 'center', fontWeight: '700', padding: 10 }} variant='bodyLarge'>{APP._('LOGIN_PAGE.TITLE')}</Text>
                            <Card.Content> 
                            <AppData
                              style={styles.input}
                              field_type='Data'
                              field_name='username'
                              label={APP._('LOGIN_PAGE.USERNAME')}
                              form_state={formik_props}
                              on_change_value={(text)=> { 
                                set_username({ value: text, error: '' })
                                formik_props.values['username'] = text;  
                              }} 
                              returnKeyType="next"
                              value={username.value}
                              // onChangeText={text => set_email({ value: text, error: '' })}
                              // error={!!username.error}
                              // // errorText={username.error}
                              // autoCapitalize="none"
                              // //autoCompleteType="email"
                              // textContentType="emailAddress"
                              // keyboardType="email-address"
                            />

                            <AppPassword
                              style={styles.input}
                              field_type='Password'
                              field_name='password'
                              label={APP._('LOGIN_PAGE.PASSWORD')}
                              form_state={formik_props}
                              returnKeyType="done"
                              value={password.value} 
                              on_change_value={(text)=> { 
                                set_password({ value: text, error: '' })
                                formik_props.values['password'] = text;  
                              }}
                              error={!!password.error}
                              // errorText={password.error}
                              secureTextEntry
                            /> 
                              <AppButton 
                                  icon='login' 
                                  mode='contained' 
                                  compact
                                  loading={loading}
                                  label={APP._("LOGIN_PAGE.BUTTONS.LOGIN")} 
                                  on_press={()=> {   
                                      formik_props.validateForm().then((res) => { 
                                      })
                                      formik_props.handleSubmit();
                                    } 
                                  }
                                />   
                            </Card.Content>    
                        </Card>
                    )
                }
              </Formik> 
            </View>
            <View>
            {/* <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPasswordScreen')}
                >
                  <Text>{APP._('LOGIN_PAGE.FORGOT_PASSWORD')}</Text>
                </TouchableOpacity>
              </View> */}

              {/* <AppButton mode="contained" label={APP._('LOGIN_PAGE.BUTTONS.LOGIN')} on_press={()=> {}} />  */}

              {/* <View style={styles.row}>
                <Text style={styles.label}>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                  <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
              </View> */}
            </View>
          </View> 
        </KeyboardAvoidingWrapper> 
    </SafeAreaView>   
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    padding: 20, 
    height: '100%', 
    display: 'flex', 
    alignContent: 'center', 
  },
  input: {
    margin: 10
  },
  app_name: {
    fontWeight: '700',
    fontSize: 26,
    textAlign: 'center',
    marginTop: 50
    // top: 400,
    // position:'absolute'
  }
})