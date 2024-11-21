import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { APP } from 'common'
import { useAuth } from 'auth/contexts/auth'
import { AuthService } from 'auth/services/auth';
import { List } from 'react-native-paper' 
import BaseComponent from './baseComponent';

const UserSummary = ({userFullName}: {userFullName: string | undefined}) => {
  // const [initials, set_initials] = useState();
  // const [user, set_user] = useState(); 
  useEffect(()=>{
    // const load = async() => {
    //   let initials = await AuthService.get_current_user_initials();
    //   set_initials(initials);
    //   let usr = await AuthService.get_current_user();
    //   set_user(usr);
    // }
    // load();
  }, []);
  return (
    <BaseComponent>
      <List.Item
        titleStyle={styles.name}
        title={userFullName}
        left={(props) => <List.Icon {...props} icon="account-box" />}
        onPress={() =>
          APP.route_to_path("modules/auth/screens/user_profile_screen", {}, {})
        }
      />
    </BaseComponent>
  );
}

export default UserSummary

const styles = StyleSheet.create({
  name: { 
    fontWeight: 'normal',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline'
  }
})