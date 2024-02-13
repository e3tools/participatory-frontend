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
    const user = await AppUtil.get_db().login(auth);
    if (user && !user.status_code) {
      this._on_login_success(user);
      return user;
    } else {
      this._on_login_failure(user);
    }
    return null;
  }

  /**
   * Called when login is successful
   * @param res User object
   */
  static async _on_login_success(user: object) {
    const store = useUserStore();
    store.set_user(user);
    // localStorage.setItem('frappeUser', JSON.stringify({
    //     token: user.token,
    //     userData: user.data
    // }))
  }

  /**
   * Called when login failed
   */
  static async _on_login_failure(user: object) {
    const store = useUserStore();
    store.removeUser();
    const title = AppUtil.translate('LOGIN_PAGE.LOGIN_FAIL_TITLE');
    AppUtil.show_error(user.text, title);
  }

  /**
   * Retrieve current user data without token
   */
  static get_current_user() {
    const user_val = this.store.getUser();
    return user_val ? user_val?.data : {};
  }

  /**
   * Retrieve current user data without token
   */
  static get_loggedIn_user_token() {
    const user_val = this.store.getUser();
    return user_val ? user_val?.token : {};
  }

   /**
   * Retrieve current user data without token
   */
   static get_csrf_token() { 
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
