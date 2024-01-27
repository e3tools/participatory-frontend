import { useUserStore } from 'src/stores/user-store';
import { AppUtil } from '../utils/app';
import { LocalStorage } from 'quasar';

class AuthenticationService {
  // constructor() {
  // }

  static store = useUserStore();

  static async login(username, password) {
    // const { proxy } = getGlobalVariables()//get global variables
    const auth = {
      usr: username,
      pwd: password,
    };
    const user = await AppUtil.getDB().login(auth);
    if (user && !user.status_code) {
      this._onLoginSuccess(user);
      return user;
    } else {
      this._onLoginFailure(user);
    }
    return null;
  }

  /**
   * Called when login is successful
   * @param res User object
   */
  static async _onLoginSuccess(user: object) {
    const store = useUserStore();
    store.setUser(user);
    // localStorage.setItem('frappeUser', JSON.stringify({
    //     token: user.token,
    //     userData: user.data
    // }))
  }

  /**
   * Called when login failed
   */
  static async _onLoginFailure(user: object) {
    const store = useUserStore();
    store.removeUser();
    const title = AppUtil.translate('LOGIN_PAGE.LOGIN_FAIL_TITLE');
    AppUtil.showError(user.text, title);
  }

  /**
   * Retrieve current user data without token
   */
  static getLoggedInUser() {
    const user_val = this.store.getUser();
    return user_val ? user_val?.data : {};
  }

  /**
   * Retrieve current user data without token
   */
  static getLoggedInUserToken() {
    const user_val = this.store.getUser();
    return user_val ? user_val?.token : {};
  }

   /**
   * Retrieve current user data without token
   */
   static getCSRFToken() { 
    const user_val = this.store.getUser();
    return user_val ? user_val?.token : {};
  }

  /**
   * Logout
   */
  static logout() {
    return this.store.removeUser();
  }
}

export { AuthenticationService };
