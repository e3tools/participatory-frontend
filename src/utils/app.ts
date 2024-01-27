// import { getCurrentInstance } from "vue"
import { useQuasar } from 'quasar';
import { Dialog } from 'quasar';
import { stringify } from 'querystring';
import { AuthenticationService } from 'src/services/AuthenticationService';
import { useCurrentInstanceStore } from 'src/stores/current-instance-store';
import { useUserStore } from 'src/stores/user-store';
import {
  getDefaultLibFilePath,
  sortAndDeduplicateDiagnostics,
} from 'typescript';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { APPS } from 'src/enums';

String.prototype.format = function (...args) {
  // Storing arguments into an array
  //const args = arguments;
    
  // Using replace for iterating over the string
  // Select the match and check whether related arguments are present. 
  // If yes, then replace the match with the argument.
    
  return this.replace(/{([0-9]+)}/g, function (match, index) {      
    // checking whether the argument is present
    return typeof args[index] == 'undefined' ? match : args[index];
  });
};

// /**
//  * Get global variables
//  * @returns a proxy object. the objects needs to be destructured before using it
//  */
// const getGlobalVariables = () => {
//     const { proxy } = getCurrentInstance()
//     return proxy
// }

// export {
//     getGlobalVariables
// }

const AppUtil = class AppUtil {
  // constructor() {
  // }

  static backendURL = 'http://127.0.0.1:8000';

  /**
   * Get app instance from which we can access globar variables
   * @returns
   */
  static getCurrentInstance() {
    const store = useCurrentInstanceStore();
    const { proxy } = store.getCurrentInstance();
    return proxy;
  }

  /**
   * Get Backend database instance
   * @returns
   */
  static getDB() {
    const proxy = this.getCurrentInstance();
    return proxy ? proxy.$db : null;
  }

  /**
   * Get translator library
   * @returns
   */
  static getTranslator() {
    const proxy = this.getCurrentInstance();
    return proxy ? proxy.$t : null;
  }

  /**
   * Translate text
   */
  static translate(text: string, params: object={}) {
    const $t = this.getTranslator();   
    const res = $t(text);
    if(params) {
      res.format(params)
    }
    return res
  }

  static __(text: string, params: object={}) {
    return this.translate(text, params)
  }

  /**
   * Show message to user
   * @param title
   * @param message
   * @param onOK
   * @param onCancel
   * @param onDismiss
   */
  static showMessage(
    message: string,
    title: '',
    onOK = null,
    onCancel = null,
    onDismiss = null
  ) {
    if (!title) {
      title = this.translate('GLOBAL.DEFAULT_INFO_MESSAGE_TITLE');
    }
    this._showDialog(title, message, onOK, onCancel, onDismiss, false, false);
  }

  /**
   * Show error message
   * @param title
   * @param message
   * @param onOK
   * @param onCancel
   * @param onDismiss
   */
  static showError(
    message: string,
    title = '',
    onOK = null,
    onCancel = null,
    onDismiss = null
  ) {
    if (title === '' || !title) {
      title = this.translate('GLOBAL.DEFAULT_ERROR_MESSAGE_TITLE');
    }
    this._showDialog(title, message, onOK, onCancel, onDismiss, true, false);
  }

  static confirm(message: string, title: '', onOK = null, onCancel = null) {
    if (title === '' || !title) {
      title = this.translate('GLOBAL.DEFAULT_ERROR_MESSAGE_TITLE');
    }
    this._showDialog(title, message, onOK, onCancel, null, false, true);
  }
  /**
   * Display message. Attempt to make use of Quasar dialog
   * @param title
   * @param message
   * @param onOK
   * @param onCancel
   * @param onDismiss
   * @param isError
   */
  static _showDialog(
    title: string,
    message: string,
    onOK = null,
    onCancel = null,
    onDismiss = null,
    isError = false,
    isConfirm = false
  ) {
    // const $t = AppUtil.translate

    // See https://snyk.io/advisor/npm-package/quasar/functions/quasar.Dialog.create

    const dlg = Dialog.create({
      title: title,
      message: message,
      color: isError ? 'negative' : 'primary',
      //class: 'bg-negative',
      html: true,
      ok: this.translate('BUTTON.OK'),
      cancel: isConfirm ? AppUtil.translate('BUTTON.CANCEL') : null,
    })
      .onOk(() => {
        if (onOK) {
          onOK();
        }
      })
      .onCancel(() => {
        if (onCancel) {
          onCancel();
        }
      })
      .onDismiss(() => {
        if (onDismiss) {
          onDismiss();
        }
      });
  }

  /**
   * Show a notification popup
   * @param message 
   * @param position 
   * @param timeout 
   */

  static notify = (message: string, is_error: boolean = false, position: | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "center" = 'top', timeout=3000) => {

    // Notify.create({
    //   message: 'Danger, Will Robinson! Danger!'
    // })

    Notify.create({
      color: is_error ? 'negative' : 'secondary',
      //textColor: 'white',
      icon: 'info',
      message,
      position,
      avatar: 'info',
      multiLine: false,
      // actions: twoActions
      //   ? [
      //       { label: 'Reply', color: buttonColor, handler: () => { /* console.log('wooow') */ } },
      //       { label: 'Dismiss', color: 'yellow', handler: () => { /* console.log('wooow') */ } }
      //     ]
      //   : (random > 40
      //       ? [{ label: 'Reply', color: buttonColor, handler: () => { /* console.log('wooow') */ } }]
      //       : null
      //     ),
      timeout: timeout, // Math.random() * 5000 + 3000
    })
  }
  /**
   * Retrieve current user details
   */
  static getCurrentUser = () => {
    return AuthenticationService.getLoggedInUser();
  };

  /**
   * Retrieve current CSRF Token
   */
  static getCSRFToken = () => {
    return AuthenticationService.getCSRFToken();
  };

  /**
   * Get initials for the currently logged in user
   */
  static getCurrentUserInitials = () => {
    const user = this.getCurrentUser();
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
   * Transform an object into a new object with new properties or a list of objects into a list of new objects
   * @param src_object Object from whom the new object will be derived
   * @param src_dest_field_map src_field:dest_field dictionary
   */
  static transform = (src_object: object, src_dest_field_map: object) => {
    let src_array = src_object;
    const is_src_array = src_object instanceof Array;
    if (is_src_array === false) {
      src_array = [src_object];
    }
    const dst_array = [];
    src_array.forEach((itm) => {
      const dst = {};
      for (const [key, value] of Object.entries(src_dest_field_map)) {
        dst[value] = itm[key];
      }
      dst_array.push(dst);
    });
    return is_src_array ? dst_array : dst_array[0];
  };

  static routeToPath = (
    path: string,
    params: object = {},
    query = ''
  ) => {
    const router = AppUtil.getCurrentInstance().$router;

    router.push({ path, params, query })
          .then(() => {
            router.go(0)
          });
    //router.push({path: path, params: params, query: queryString })
  };

  static routeToName = (
    name: string,
    params: object = {},
    queryString = ''
  ) => {
    const router = AppUtil.getCurrentInstance().$router;
    router.push({ name: name, params: params, query: queryString })
      .then(() => {
        router.go(0)
      });
  };

  /**
   * Construct db parameters based on query string values
   * @param queryString
   */
  static makeFilters = (queryString: object) => {
    const filters = [];
    for (const key in queryString) {
      filters.push([key, '=', queryString[key]]);
    }
    return filters;
  };

  /**
   * Construct a backend url
   * @param url
   */
  static makeBackendURL = (url: string) => {
    return `${this.backendURL}/${url}`;
  };

  static makeFrappeAppAPIEndpoint = (endpoint: string, include_custom_app: boolean = true) => {
    if(include_custom_app){
      return `${this.makeBackendURL('')}api/method/${APPS.FRAPPE_CUSTOM_APP}.api.${endpoint}`; 
    }
    return `${this.makeBackendURL('')}api/method/${endpoint}`; 
  }

  /**
   * Convert File to base64
   * @param file_obj 
   * @returns 
   */
  static file_to_base64 = (file_obj: Blob) => {
    return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = function () {
				resolve(reader.result);
			};
			reader.readAsDataURL(file_obj);
		});
  }
};
export { AppUtil };
