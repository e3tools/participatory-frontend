import { boot } from 'quasar/wrappers';
import { useQuasar } from 'quasar';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
// export default boot(async (/* { app, router, ... } */) => {
//   // something to do
// });

export default boot(async (/*{ app, router, ... }*/) => {
  return {
    name: 'app_util',
    AppUtil: class AppUtil {
      constructor() {
        const $q = useQuasar();
      }
      show_message(
        title: string,
        message: string,
        onOK = null,
        onCancel = null,
        onDismiss = null
      ) {
        this._showDialog(message, title, onOK, onCancel, onDismiss);
      }

      show_error(
        title: string,
        message: string,
        onOK = null,
        onCancel = null,
        onDismiss = null
      ) {
        this._showDialog(message, title, onOK, onCancel, onDismiss);
      }

      _showDialog(
        message: string,
        title: string,
        onOK = null,
        onCancel = null,
        onDismiss = null
      ) {
        if(!title){
          AppUtil.translate('')
        }
        this.$q
          .dialog({
            title: title,
            message: message,
          })
          .onOk(() => {
            // console.log('OK')
            if (onOK) {
              onOK();
            }
          })
          .onCancel(() => {
            // console.log('Cancel')
            if (onCancel) {
              onCancel();
            }
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
            if (onDismiss) {
              onDismiss();
            }
          });
      }
    },
  };
});

/*
export default {
  name: 'app_util',
  AppUtil: class AppUtil {
    constructor() {
      const $q = useQuasar();
    }

    show_message(
      title: string,
      message: string,
      onOK = null,
      onCancel = null,
      onDismiss = null
    ) {
      this._showDialog(title, message, onOK, onCancel, onDismiss);
    }

    show_error(
      title: string,
      message: string,
      onOK = null,
      onCancel = null,
      onDismiss = null
    ) {
      this._showDialog(title, message, onOK, onCancel, onDismiss);
    }

    _showDialog(
      title: string,
      message: string,
      onOK = null,
      onCancel = null,
      onDismiss = null
    ) {
      this.$q
        .dialog({
          title: title,
          message: message,
        })
        .onOk(() => {
          // console.log('OK')
          if (onOK) {
            onOK();
          }
        })
        .onCancel(() => {
          // console.log('Cancel')
          if (onCancel) {
            onCancel();
          }
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
          if (onDismiss) {
            onDismiss();
          }
        });
    }
  },
};
*/
