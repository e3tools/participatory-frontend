import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LoginScreen  from 'auth/screens/login_screen';
import { down_sync, full_sync } from '../../../utils/data_sync';
import { APP } from 'common';

const Login_Screen = () => {
    const sync_down = async () => {
        APP.notify("GLOBAL.SYNC_IN_PROGRESS")
        // down_sync(); 
        full_sync();
        APP.notify("GLOBAL.SYNC_COMPLETED")
        APP.route_to_path('/modules/engage/screens/engage_index_screen');
    }
  return <LoginScreen on_login_success={sync_down} />;
}

export default Login_Screen

const styles = StyleSheet.create({})