import { APPS, URLS } from '../constants/enums';
import { _ as t } from '../utils/translate';
import { router } from 'expo-router'; 
import { Notify, Confirm } from '../components/shared/Dialog';

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

const APP = class AppUtil {

  static backendURL = URLS.BACKEND;

  // static DB = DB;

  /**
   * Get app instance from which we can access globar variables
   * @returns
   */
  static get_current_instance() { 
    // const store = InstanceStore();
    // const { proxy } = store.get_current_instance();
    // return proxy;
    return null;
  }

  /**
   * Get full backend url
   * @param url 
   */
  static get_full_backend_url(url: string) {
    return AppUtil.backendURL + url;
  }

   /**
   * Translate text
   */
  static _(text: string, params: object={}) {
    return t(text, params)
  }

  /**
   * Show message to user
   * @param title
   * @param message
   * @param on_ok
   * @param on_cancel
   * @param on_dismiss
   */
  static show_message(
    message: string,
    title: '',
    // on_ok = null,
    // on_cancel = null,
    // on_dismiss = null
  ) {
    if (!title) {
      title = this._('GLOBAL.DEFAULT_INFO_MESSAGE_TITLE');
    }
    this._show_dialog(title, message, null, null, null, false, false);
  }

  /**
   * Show error message
   * @param title
   * @param message
   * @param on_ok
   * @param on_cancel
   * @param on_dismiss
   */
  static show_error(
    message: string,
    title = '',
    // on_ok = null,
    // on_cancel = null,
    // on_dismiss = null
  ) {
    if (title === '' || !title) {
      title = this._('GLOBAL.DEFAULT_ERROR_MESSAGE_TITLE');
    }
    this._show_dialog(title, message, null, null, null, true, false);
  }

  static confirm(message: string, title: '', on_ok =null, on_cancel = null, on_dismiss=null) {
    if (title === '' || !title) {
      title = this._('GLOBAL.DEFAULT_ERROR_MESSAGE_TITLE');
    }
    this._show_dialog(title, message, on_ok, on_cancel, null, false, true);
  }
  /**
   * Display message. Attempt to make use of Quasar dialog
   * @param title
   * @param message
   * @param on_ok
   * @param on_cancel
   * @param on_dismiss
   * @param is_error
   */
  static _show_dialog(
    title: string,
    message: string,
    on_ok = null,
    on_cancel = null,
    on_dismiss = null,
    is_error = false,
    is_confirm = false
  ) {
    // See https://snyk.io/advisor/npm-package/quasar/functions/quasar.Dialog.create
    const dlg = Dialog.create({
      title: title,
      message: message,
      color: is_error ? 'negative' : 'primary',
      //class: 'bg-negative',
      html: true,
      ok: this.translate('BUTTON.OK'),
      cancel: is_confirm ? AppUtil.translate('BUTTON.CANCEL') : null,
    })
      .onOk(() => {
        if(on_ok) {
          on_ok();
        }
      })
      .onCancel(() => {
        if(on_cancel) {
          on_cancel();
        }
      })
      .onDismiss(() => {
        if(on_dismiss) {
          on_dismiss();
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
    return (<Notify message={message} />)

    // Notify.create({
    //   color: is_error ? 'negative' : 'secondary',
    //   //textColor: 'white',
    //   icon: 'info',
    //   message,
    //   position,
    //   avatar: 'info',
    //   multiLine: true, 
    //   timeout: timeout, // Math.random() * 5000 + 3000
    // })
  }

  /**
   * Show error notification
   * @param message 
   * @param position 
   * @param timeout 
   */
  static notify_error = (message: string, position: | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "center" = 'bottom', timeout=3000) => {

    this.notify(message, true, position); 
  }


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

  static route_to_path = (
    path: string,
    params: object = {},
    query: object = {}
  ) => { 

    router.push({
        pathname: path, 
        params: params,
        // query
      })
          // .then(() => {
          //   router.go(0)
          // });
    //router.push({path: path, params: params, query: queryString })
  };

  static route_to_name = (
    name: string,
    params: object = {},
    queryString = ''
  ) => { 
    router.push({ name: name, params: params, query: queryString })
      .then(() => {
        router.go(0)
      });
  };

  /**
   * Construct db parameters based on query string values
   * @param queryString
   */
  static make_filters = (queryString: object) => {
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
  static make_backend_url = (url: string) => {
    return `${this.backendURL}/${url}`;
  };

  static make_frappe_api_endpoint = (endpoint: string, include_custom_app: boolean = true) => {
    if(include_custom_app){
      return `${this.make_backend_url('')}api/method/${APPS.FRAPPE_CUSTOM_APP}.api.${endpoint}`; 
    }
    return `${this.make_backend_url('')}api/method/${endpoint}`; 
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
export { APP };
