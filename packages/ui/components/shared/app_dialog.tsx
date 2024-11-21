import { View, Text } from 'react-native'
import React from 'react'
import { Portal, Dialog, Paragraph, Button, Snackbar } from 'react-native-paper'

// const MakeDialog = (message: string, 
//                     title: string, 
//                     is_notify: boolean = false, 
//                     is_visible: boolean=false, 
//                     on_ok: ()=>void, 
//                     on_cancel: ()=>void) => {

const MakeDialog = ({ 
        message, 
        title, 
        is_notify=false, 
        visible=true, 
        ok_label='Ok',
        cancel_label='Cancel',
        is_error=false,
        on_ok=null, 
        on_cancel=null,
        on_dismiss=null
    }) => { 
    const [is_visible, set_visible] = React.useState(visible);
    const hide_dialog = () => set_visible(false);
    const show_dialog = () => set_visible(true); 
 
    return (
        <View>
            <Portal>
                <Dialog 
                    visible={is_visible} 
                    onDismiss={()=> {
                        if(on_dismiss) {
                            hide_dialog();
                        }}
                    }
                >                       
                    <Dialog.Title>{title}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            {message}
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={()=> {
                                if(on_cancel){
                                    on_cancel();
                                }
                                hide_dialog();
                            }}>
                           {cancel_label}
                        </Button>
                        <Button onPress={()=> {
                                if(on_ok){
                                    on_ok();
                                }
                                hide_dialog();
                            }}>
                           {ok_label}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}

/**
 * Show message on a dialog
 * @param message 
 * @param title 
 * @param is_error 
 * @returns 
 */
export function ShowMessage({ message, title, is_error, visible=false}) {
  return (
    <MakeDialog 
        message={message} 
        visible={visible}
        title={title} 
        is_notify={true} 
        is_error={is_error}
    /> 
  )
}

/**
 * Issue a confirmation message
 * @param message 
 * @param title 
 * @param ok_label 
 * @param cancel_label 
 * @param on_ok 
 * @param on_cancel 
 * @param on_dismiss 
 * @returns 
 */
export function Confirm({ message, 
                          title, 
                          visible=false,
                          ok_label='Ok', 
                          cancel_label='Cancel', 
                          on_ok, 
                          on_cancel, 
                          on_dismiss }) {
    return (
        <MakeDialog 
            message={message} 
            title={title}
            visible={visible}
            is_notify={false} 
            ok_label={ok_label}
            cancel_label={cancel_label}
            on_ok={on_ok}
            on_cancel={on_cancel}
            on_dismiss={on_dismiss}
        /> 
      )
  }

  export function Notify(message: string, visible=true, duration: number = 3000) { //} 'Long' | 'Short' | 'Medium' = 'Medium') {
    const [is_visible, set_visible] = React.useState(visible);
    const toggle = set_visible(!visible);
    const hide = () => set_visible(false);
    return (
        <Snackbar
            visible={is_visible}
            onDismiss={hide}
            duration={duration}
            action={{
                label: 'Undo',
                onPress: () => {
                  // Do something
                },
              }}
        >
          {message}
        </Snackbar>
    )
  }
