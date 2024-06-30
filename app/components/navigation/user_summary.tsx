import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { APP } from '@/app/utils/app'
import { useAuth } from '@/app/contexts/auth'
import { AuthService } from '@/app/modules/auth/services/auth'
import { List } from 'react-native-paper'

const UserSummary = () => {
  const [initials, set_initials] = useState();
  const [user, set_user] = useState();

  useEffect(()=>{
    const load = async() => {
      let initials = await AuthService.get_current_user_initials();
      set_initials(initials);
      let usr = await AuthService.get_current_user();
      set_user(usr);
    }
    load();
  }, []);
  return (
    <View>
      <List.Item
        titleStyle={styles.name}
        title={user?.full_name}
        left={props => <List.Icon {...props} icon="account-box" />}
        onPress={()=>APP.route_to_path('modules/auth/screens/user_profile_screen', {}, {})}
      />
    </View>
  )
}

export default UserSummary

const styles = StyleSheet.create({
  name: { 
    fontWeight: 'normal',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline'
  }
})