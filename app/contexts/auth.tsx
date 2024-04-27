import { View, Text } from 'react-native'
import React, { createContext, useContext, useEffect, useState } from 'react' 
import { AuthService } from '../modules/auth/services/auth';
import { UserData } from '../modules/auth/stores/user_store';

type AuthContextData = {
  auth_data?: UserData;
  is_authenticated: boolean;
  is_loading: boolean;
  login(usr: string, pwd: string): Promise<[boolean, unknown]>;
  logout(): Promise<unknown>;
  counter: number;
  increment(): void;
}

//Create the Auth Context with the data type specified and a empty object
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = (props) => {
  const [is_authenticated, set_is_authenticated] = useState(false);
  const [is_loading, set_is_loading] = useState(true); //start with loading is true until data is loaded
  const [auth_data, set_auth_data] = useState<UserData>();
  const [counter, set_counter] = useState(0)

  useEffect(()=> {
    check_authentication_status();
  }, [])

  const get_user_token = async () => {
    return await AuthService.get_loggedIn_user_token();
  }

  const check_authentication_status = async () => { 
    const user: UserData = await AuthService.get_current_user(); 
    set_is_authenticated(user != null);
    set_is_loading(false);
  }

  const login = async (username: string, password: string) : Promise<[boolean, unknown]> => {
    const [success, usr] = await AuthService.login(username, password); 
    set_is_authenticated(success);    
    set_auth_data(usr)
    return [success, usr];
  }

  const logout = async () : Promise<unknown> => {
    const res = await AuthService.logout();
    set_is_authenticated(false);
    set_auth_data({} as UserData); 
    return res;
  }

  const increment = () => {
    set_counter(counter+1);
  }

  return (
    <AuthContext.Provider 
      value={{
        login,
        logout,
        is_authenticated,
        is_loading,
        counter,
        increment
      }}
    >
      { props.children }
    </AuthContext.Provider>
  )
}

//A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthContext, AuthProvider, useAuth }