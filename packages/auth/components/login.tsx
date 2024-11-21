import { StyleSheet, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'  
import { AppButton } from 'ui/components/shared/app_button';
import { APP } from 'common';
import { Avatar, Card, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from "yup"; 
import { SafeAreaView } from 'react-native-safe-area-context';  
import AppData from 'ui/components/form/controls/data';
import AppPassword from 'ui/components/form/controls/password'; 
import KeyboardAvoidingWrapper from 'ui/components/shared/keyboard_avoiding_wrapper';
import { useNavigation } from 'expo-router' 
import { UserStore } from '../stores/user_store'
import { useAuth } from 'auth/contexts/auth'
import { useAuthDispatch, useAuthSelector } from '../state/hooks'; 
import { getUsers, logIn } from '../state/user/actions/user.action';
//import { Sync } from 'data-layer/utils/sync' 
// import { Provider } from "react-redux";
import BaseComponent from './baseComponent'; 
import { LoginCredentials } from '../state/state.types';
import { Provider } from 'react-redux';
import { store } from '../state/store';

type LoginProps = {
  on_login_success: () => void;
};
 
const Login = (props: LoginProps) => { 
  const navigation = useNavigation();
  const auth = useAuth();
  const dispatch = useAuthDispatch(); 
  // const [username, set_username] = useState({ value: 'Administrator', error: '' });
  // const [password, set_password] = useState({ value: '123', error: '' });
  const [username, set_username] = useState({ value: '', error: '' });
  const [password, set_password] = useState({ value: '', error: '' });
  const loading = useAuthSelector((state) => state.user.loading);
  // const [loading, set_loading] = useState(false);
  const [is_syncing, set_is_syncing] = useState(true);

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

  const on_login = async (username: string, password: string) => {
    // dispatch(clearUser());
    //const [res, user] = await auth.login(username, password);
    const data: LoginCredentials = {
      username, password
    }
    const res = await dispatch(logIn(data)).unwrap(); 
    if (res.loggedIn === true){ 
      props.on_login_success();
    } else {
      APP.show_message(APP._("LOGIN_PAGE.LOGIN_FAILURE_MESSAGE"));
    }
  }  
 
  useLayoutEffect(() => { 
    navigation.setOptions({ title: APP._('APP_NAME') });
  }, []); 

  return (
    <SafeAreaView>
      {/* <BaseComponent> */}
      <KeyboardAvoidingWrapper>
        <Provider store={store}>
          <View style={styles.container}>
            <View>
              <Text style={styles.app_name}>{APP._("APP_NAME")}</Text>
              <Formik
                initialValues={initial_values}
                validationSchema={validation_schema}
                onSubmit={async (values, actions) => { 
                  on_login(values.username, values.password);
                  //actions.resetForm();
                }}
              >
                {(formik_props) => (
                  <Card>
                    {/* <Card.Cover source={{ uri: 'https://as2.ftcdn.net/v2/jpg/03/28/17/19/1000_F_328171945_cMFEZy3PEXC9pnNvBifFVr0IrouZMqkp.jpg'}} /> */}
                    <Card.Title
                      title={""}
                      left={(props) => (
                        <Avatar.Icon
                          {...props}
                          size={80}
                          icon="account-key"
                          style={{ display: "none" }}
                        />
                      )}
                    />
                    <View style={{ alignItems: "center" }}>
                      <Avatar.Icon size={80} icon="account-key" />
                    </View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "700",
                        padding: 10,
                      }}
                      variant="bodyLarge"
                    >
                      {APP._("LOGIN_PAGE.TITLE")}
                    </Text>
                    <Card.Content>
                      <AppData
                        style={styles.input}
                        field_type="Data"
                        field_name="username"
                        label={APP._("LOGIN_PAGE.USERNAME")}
                        form_state={formik_props}
                        on_change_value={(text) => {
                          set_username({ value: text, error: "" });
                          formik_props.values["username"] = text;
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
                        field_type="Password"
                        field_name="password"
                        label={APP._("LOGIN_PAGE.PASSWORD")}
                        form_state={formik_props}
                        returnKeyType="done"
                        value={password.value}
                        on_change_value={(text) => {
                          set_password({ value: text, error: "" });
                          formik_props.values["password"] = text;
                        }}
                        error={!!password.error}
                        // errorText={password.error}
                        secureTextEntry
                      />
                      <AppButton
                        icon="login"
                        mode="contained"
                        compact
                        loading={loading}
                        disabled={loading}
                        label={APP._("LOGIN_PAGE.BUTTONS.LOGIN")}
                        on_press={() => { 
                            formik_props.validateForm().then((res) => { 
                            })
                            formik_props.handleSubmit();
                        }}
                      />
                    </Card.Content>
                  </Card>
                )}
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
        </Provider>
      </KeyboardAvoidingWrapper>
      {/* </BaseComponent> */}
    </SafeAreaView>
  );
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