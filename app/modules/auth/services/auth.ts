import { APP } from '@/app/utils/app';
import { UserStore } from '../stores/user_store';
import { Frappe } from '@/app/backends/frappe'; 
import { URLS } from '@/app/constants/enums';
import { Alert } from 'react-native'; 

type AuthData = {
  token: string;
  email: string;
  name: string;
};

const AuthService = class AuthService {

  static backend = new Frappe(APP.backendURL);

  static login = async (username: string, password: string) => {
    // const { proxy } = getGlobalVariables()//get global variables
    const auth = {
      usr: username,
      pwd: password,
    };  
    const [success, user] = await new Frappe(URLS.BACKEND).login(auth);   
    if(success){
      await this._on_login_success(user);  
      return [success, user];
    } else {
      await this._on_login_failure(user); 
    }
    return [success, user];
  }

  /**
   * Called when login is successful
   * @param res User object
   */
  static _on_login_success = async (user: object) => {  
    await UserStore.set_user(user); 
  }

  /**
   * Called when login failed
   */
  static _on_login_failure = async(user: object) => { 
    await UserStore.remove_user();
    return false;
  }

  /**
   * Retrieve current user data without token
   */
  static get_current_user = async () => {
    const user_val = await UserStore.get_user();  
    return user_val ? user_val : null;
  }

  /**
   * Check if user is authenticated
   * @TODO include logic to check expiration of token
   * @returns 
   */
  static is_authenticated = async () => {
    const usr = await this.get_current_user();
    return usr != null;
  }

  /**
   * Retrieve current user data without token
   */
  static get_loggedIn_user_token = async () => {
    const user_val = await UserStore.get_user(); 
    return user_val ? user_val?.token : {};
  }

  /**
 * Retrieve current user data without token
 */
  static get_csrf_token = async() => { 
    const user_val = await UserStore.get_user();
    return user_val ? user_val?.token : {};
  }

  /**
   * Get initials for the currently logged in user
  */
  static get_current_user_initials = async () => {
    const user = await this.get_current_user();
    if (!user) {
      return '';
    }
    const allNames = user.full_name.trim().split(' ');
    const initials = allNames.reduce((acc, curr, index) => {
      if (index === 0 || index === allNames.length - 1) {
        acc = `${acc}${curr.charAt(0).toUpperCase()}`;
      }
      return acc;
    }, '');
    return initials;
    // name.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase() //to get first and last name initials
    // name.match(/(\b\S)?/g).join("").toUpperCase() //to get all initials
  };

  /**
   * Change user password
   * @param user 
   * @param password 
   */
  static change_password = async(user: string, password: string) => {
    return await this.backend.call_api_endpoint("change_password", {user, password});
  }
  /**
   * Logout.
   * @TODO Log the logout action to the db
   */
  static logout = async () => {
    const res = await UserStore.remove_user();
    return res;
  }
}

export { AuthService };
