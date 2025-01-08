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
import { AppButton } from 'ui/components/shared/app-button';
import KeyboardAvoidingWrapper from 'ui/components/shared/keyboard-avoiding-wrapper';
import * as CONFIG from '../config';
import { useAuthDispatch, useAuthSelector } from '../state/hooks';
import { User } from '../state/state.types';
import { updateUser } from '../state/user/actions/user.action';

const GlobalStyles = CONFIG.GlobalStyles;

interface IUserProfile {
  firstName?: string;
  middleName?: string;
  lastName?: string;
}

const UserProfile = () => {
  const dispatch = useAuthDispatch();
  const navigation = useNavigation();
  const [initialValues, setInitialValues] = useState<
    IUserProfile | undefined
  >(undefined);
  const user = useAuthSelector((state) => state.user.loggedInUser);
  const loading = useAuthSelector((state) => state.user.loading); 
  const validation_schema = Yup.object().shape({
    firstName: Yup.string().required(APP._("VALIDATION.REQUIRED")),
    middleName: Yup.string().nullable(),
    lastName: Yup.string().nullable(),
  });

  const db = new DocTypeService("User");

  const onUpdateProfile = async (
    firstName: string = "",
    middleName: string = "",
    lastName: string = ""
  ) => {
    let usr: User = { ...user, first_name: firstName, middle_name: middleName, last_name: lastName };
    console.log("USer: ", usr)
    
    // const res = await db.update_doc(obj, obj.name);
    const res = await dispatch(updateUser(usr));
    if (res) {
      APP.notify(APP._("GLOBAL.SAVE_SUCCESS_MESSAGE"));
      // set_doc(res); //reset doc to saved record other wise a TimeStampMismatchError may occur if user clicks update again
    } else {
      APP.notify_error(APP._("GLOBAL.SAVE_ERROR_MESSAGE"));
    }
  };

  useEffect(() => {
    // const load = async() => {
    //   const usr = await AuthService.get_current_user();
    //   if(usr){
    //     const usr_doc = await db.get_doc(usr.name);
    //     set_doc(usr_doc);
    //     if(usr_doc){
    //       setInitialValues({ 'first_name': usr_doc.first_name, 'middle_name': usr_doc?.middle_name, 'last_name': usr_doc?.last_name });
    //     }
    //   }
    // }
    // load();
    setInitialValues({
      firstName: user?.first_name,
      middleName: user?.middle_name,
      lastName: user?.last_name,
    });
  }, []);

  useEffect(() => {}, [initialValues]);

  return (
    <KeyboardAvoidingWrapper>
      <View style={GlobalStyles?.container}>
        <View>
          {initialValues && (
            <Formik
              initialValues={initialValues}
              validationSchema={validation_schema}
              onSubmit={(values, actions) => {
                console.log("Validated");
                onUpdateProfile(
                  values.firstName,
                  values.middleName,
                  values.lastName
                );
                //actions.resetForm();
              }}
            >
              {(formik_props) => (
                <Card>
                  {/* <Card.Cover source={{ uri: 'https://as2.ftcdn.net/v2/jpg/03/28/17/19/1000_F_328171945_cMFEZy3PEXC9pnNvBifFVr0IrouZMqkp.jpg'}} /> */}
                  <Card.Title
                    style={{ alignItems: "center" }}
                    title={APP._("USER_PROFILE_PAGE.TITLES.PAGE")}
                    subtitle={APP._("USER_PROFILE_PAGE.TITLES.USER_DETAILS")}
                  />
                  <Card.Content>
                    <AppData
                      field_name="firstName"
                      name="firstName"
                      label={APP._("USER_PROFILE_PAGE.LABELS.FIRST_NAME")}
                      form_state={formik_props}
                      value={initialValues.firstName}
                      on_change={(text) => {
                        formik_props.values["firstName"] = text;
                      }}
                      returnKeyType="next"
                    />
                    <AppData
                      field_name="middleName"
                      name="middleName"
                      label={APP._("USER_PROFILE_PAGE.LABELS.MIDDLE_NAME")}
                      form_state={formik_props}
                      value={initialValues.middleName}
                      on_change={(text) => {
                        formik_props.values["middleName"] = text;
                      }}
                      returnKeyType="next"
                    />

                    <AppData
                      field_name="lastName"
                      name="lastName"
                      label={APP._("USER_PROFILE_PAGE.LABELS.LAST_NAME")}
                      form_state={formik_props}
                      value={initialValues.lastName}
                      on_change={(text) => {
                        formik_props.values["lastName"] = text;
                      }} 
                      returnKeyType="done"
                    />
                    <View style={styles.update_button_container}>
                      <AppButton
                        icon="content-save"
                        mode="contained"
                        loading={loading}
                        disabled={loading}
                        compact
                        label={APP._(
                          "USER_PROFILE_PAGE.BUTTONS.UPDATE_USER_INFO"
                        )}
                        onPress={() => {
                          formik_props.validateForm().then((res) => { 
                              formik_props.handleSubmit();
                          });  
                        }}
                      />
                    </View>
                  </Card.Content>
                </Card>
              )}
            </Formik>
          )}
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

export default UserProfile

const styles = StyleSheet.create({
  update_button_container: {
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    justifyContent: 'flex-end'
  }
})