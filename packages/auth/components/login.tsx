import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'  
import { AppButton } from 'ui/components/shared/app-button';
import { APP } from 'common';
import { Avatar, Card, Text, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from "yup"; 
import { SafeAreaView } from 'react-native-safe-area-context';  
import AppData from 'ui/components/form/controls/data';
import AppPassword from 'ui/components/form/controls/password'; 
import KeyboardAvoidingWrapper from 'ui/components/shared/keyboard-avoiding-wrapper';
import { useNavigation } from 'expo-router' 
import { UserStore } from '../stores/user-store'
import { useAuth } from 'auth/contexts/auth'
import { useAuthDispatch, useAuthSelector } from '../state/hooks'; 
import { getUsers, logIn } from '../state/user/actions/user.action';
//import { Sync } from 'data-layer/utils/sync' 
// import { Provider } from "react-redux";
import BaseComponent from './base-component'; 
import { LoginCredentials } from '../state/state.types';
import { Provider } from 'react-redux';
import { store } from '../state/store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type LoginProps = {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
  appName: string;
  bannerLogo: React.ReactNode;
  clientLogo: React.ReactNode;
};
 
const Login = (props: LoginProps) => { 
  const navigation = useNavigation();
  const auth = useAuth();
  const dispatch = useAuthDispatch(); 
  // const [username, setUsername] = useState({ value: 'Administrator', error: '' });
  // const [password, setPassword] = useState({ value: '123', error: '' });
  const [username, setUsername] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const loading = useAuthSelector((state) => state.user.loading); 
  // const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);

  const initialValues = {'username': '', password: ''};
  const validationSchema = Yup.object().shape({
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

  const onLogin = async (username: string, password: string) => {
    // dispatch(clearUser());
    const data: LoginCredentials = {
      username, password
    }
    const res = await dispatch(logIn(data)).unwrap(); 
    if (res.loggedIn === true){ 
      props.onLoginSuccess();
    } else {
      APP.show_message(APP._("LOGIN_PAGE.LOGIN_FAILURE_MESSAGE"));
    }
  }  
 
  useLayoutEffect(() => { 
    navigation.setOptions({ title: '' /*APP._('APP_NAME')*/ });
  }, []); 

  useEffect(()=> {
    console.log("USer loading: ", loading)
  }, [loading])

  return (
    <SafeAreaView>
      <KeyboardAvoidingWrapper>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: "90%",
              paddingHorizontal: 20,
              backgroundColor: "#F8F8FF",
              borderRadius: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            {props.clientLogo}
            <Text
              style={{
                backgroundColor: "#fff2dd",
                paddingHorizontal: 6,
                // width: 140,
                alignSelf: "center",
                paddingVertical: 10,
                fontWeight: "bold",
                fontSize: 30,
                transform: [
                  {
                    rotate: "-5deg",
                  },
                ],
              }}
            >
              {props.appName}
            </Text>
          </View>

          <View>
            {/* Logo */}
            <View style={{ alignItems: "center" }}>{props.bannerLogo}</View>

            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                margin: 20,
              }}
            >
              {APP._("LOGIN_PAGE.TITLE")}
            </Text>
          </View>
          <View style={{ width: "80%" }}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, actions) => {
                onLogin(values.username, values.password);
                //actions.resetForm();
              }}
            >
              {(formik_props) => (
                <Card>
                  {/* <Card.Cover source={{ uri: 'https://as2.ftcdn.net/v2/jpg/03/28/17/19/1000_F_328171945_cMFEZy3PEXC9pnNvBifFVr0IrouZMqkp.jpg'}} /> */}
                  {/* <Card.Title
                title={""}
                left={(props) => (
                  <Avatar.Icon
                    {...props}
                    size={80}
                    icon="account-key"
                    style={{ display: "none" }}
                  />
                )}
              /> */}
                  {/* <View style={{ alignItems: "center" }}>
                <Avatar.Icon size={80} icon="account-key" />
              </View> */}
                  {/* <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  padding: 10,
                }}
                variant="bodyLarge"
              >
                {APP._("LOGIN_PAGE.TITLE")}
              </Text> */}
                  <Card.Content>
                    <AppData
                      style={styles.input}
                      field_type="Data"
                      field_name="username"
                      // label={APP._("LOGIN_PAGE.USERNAME")}
                      placeholder={APP._("LOGIN_PAGE.USERNAME")}
                      form_state={formik_props}
                      on_change={(text) => {
                        setUsername({ value: text, error: "" });
                        formik_props.values["username"] = text;
                      }}
                      returnKeyType="next"
                      value={username.value}
                      left={<TextInput.Icon size={20} icon="eye-outline" />}
                    />

                    <AppPassword
                      style={[styles.input]}
                      field_type="Password"
                      field_name="password"
                      placeholder={APP._("LOGIN_PAGE.PASSWORD")}
                      form_state={formik_props}
                      returnKeyType="done"
                      value={password.value}
                      on_change={(text) => {
                        setPassword({ value: text, error: "" });
                        formik_props.values["password"] = text;
                      }}
                      error={!!password.error}
                      secureTextEntry
                      left={
                        <TextInput.Icon
                          size={20}
                          icon="lock-outline"
                          style={{ marginLeft: 0 }}
                        />
                      }
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => props.onForgotPassword()}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            marginBottom: 10,
                            color: "#318CE7",
                            paddingRight: 10,
                          }}
                        >
                          {APP._("LOGIN_PAGE.FORGOT_PASSWORD")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <AppButton
                      icon="login"
                      mode="contained"
                      compact
                      loading={loading}
                      disabled={loading}
                      label={APP._("LOGIN_PAGE.BUTTONS.LOGIN")}
                      onPress={() => {
                        formik_props.validateForm().then((res) => {});
                        formik_props.handleSubmit();
                      }}
                    />

                    <View
                      style={{
                        // flex: 1,
                        marginTop: 10,
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                        }}
                      >
                        Don’t have an account?
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          props.onRegister();
                        }}
                      >
                        <Text style={{ color: "red" }}>Sign up</Text>
                      </TouchableOpacity>
                    </View>
                  </Card.Content>
                </Card>
              )}
            </Formik>
          </View>
        </View>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );

  return (
    <SafeAreaView>
      <KeyboardAvoidingWrapper>
        <Provider store={store}>
          <View style={styles.container}>
            <View style={{ backgroundColor: "red" }}>
              <Text style={styles.appName}>APP {props.appName}</Text>
              <View style={{ backgroundColor: "blue" }}>
                <Image
                  src={props.logo_path}
                  style={{
                    height: 100,
                    width: 100,
                    transform: [
                      {
                        rotate: "-5deg",
                      },
                    ],
                  }}
                  resizeMode="cover"
                />
              </View>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, actions) => {
                  onLogin(values.username, values.password);
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
                        // label={APP._("LOGIN_PAGE.USERNAME")}
                        placeholder={APP._("LOGIN_PAGE.USERNAME")}
                        form_state={formik_props}
                        on_change={(text) => {
                          setUsername({ value: text, error: "" });
                          formik_props.values["username"] = text;
                        }}
                        returnKeyType="next"
                        value={username.value}
                        left={<TextInput.Icon icon="eye-outline" />}
                      />

                      <AppPassword
                        style={styles.input}
                        field_type="Password"
                        field_name="password"
                        placeholder={APP._("LOGIN_PAGE.PASSWORD")}
                        form_state={formik_props}
                        returnKeyType="done"
                        value={password.value}
                        on_change={(text) => {
                          setPassword({ value: text, error: "" });
                          formik_props.values["password"] = text;
                        }}
                        error={!!password.error}
                        secureTextEntry
                        left={<TextInput.Icon icon="lock-outline" />}
                      />
                      <AppButton
                        icon="login"
                        mode="contained"
                        compact
                        loading={loading}
                        disabled={loading}
                        label={APP._("LOGIN_PAGE.BUTTONS.LOGIN")}
                        onPress={() => {
                          formik_props.validateForm().then((res) => {});
                          formik_props.handleSubmit();
                        }}
                      />
                    </Card.Content>
                  </Card>
                )}
              </Formik>
            </View>
            <View>
              <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPasswordScreen")}
                >
                  <Text>Forgot {APP._("LOGIN_PAGE.FORGOT_PASSWORD")}</Text>
                </TouchableOpacity>
              </View>

              {/* <AppButton mode="contained" label={APP._('LOGIN_PAGE.BUTTONS.LOGIN')} onPress={()=> {}} />  */}

              <View style={styles.row}>
                <Text style={styles.label}>Don’t have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("RegisterScreen")}
                >
                  <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Provider>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
}

export default Login

const styles = StyleSheet.create({
  container: {
    padding: 20, 
    // height: '100%', 
    // display: 'flex', 
    flex: 1, 
    // alignContent: 'center', 
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    margin: 10
  },
  appName: {
    fontWeight: '700',
    fontSize: 26,
    textAlign: 'center',
    marginTop: 50
    // top: 400,
    // position:'absolute'
  }
})