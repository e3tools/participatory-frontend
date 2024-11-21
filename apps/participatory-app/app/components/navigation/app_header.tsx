import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { AppMenu } from 'ui/components/shared/app_menu';
import { Button, Divider, Icon, IconButton, Menu, Modal, Portal } from 'react-native-paper'
import LanguageSwitcher from './language_switcher'
// import UserSummary from './user_summary2';
import UserSummary from 'auth/components/user_summary';
import SynchronizeData from '../synchronize_data';
import { Provider } from 'react-redux';
import { store } from '@/app/state/store';
import { useAppSelector } from '@/app/state/hooks';

type AppHeaderProps = {
     /**
   * This will reset the root component key to force a re-render of all components
   * when the language has been switched
   */
    reset_root_key_func: ()=>void,
}

const AppHeader = (props: AppHeaderProps) => {
    const [visible, set_visible] = React.useState(false);
    const [show_sync, set_show_sync] = React.useState(false);
    const isOnline = useAppSelector((state) => state.backend.isBackendConnected)
    const user = useAppSelector((state) => state.user.loggedInUser);
 
  return (
    <View>
      <View style={styles.container}>
        <IconButton
          icon="sync"
          onPress={() => {
            set_show_sync(true);
          }}
        />
        <Portal>
          <Modal
            visible={show_sync}
            dismissable={true}
            onDismiss={() => {
              set_show_sync(false);
            }}
            contentContainerStyle={styles.sync_container}
          >
            <SynchronizeData isOnline={isOnline} />
          </Modal>
        </Portal>

        <AppMenu
          visible={true}
          disabled={false}
          anchor_icon="menu-open"
          anchor_label=""
          anchor_size={18}
          // anchor_label={APP._('MAP_PAGE.OPTIONS')}
        >
          <View>
            <View style={{ marginLeft: 15 }}>
              <LanguageSwitcher
                reset_root_key_func={props.reset_root_key_func}
              />
            </View>
            <Divider style={{ marginTop: 3 }} />
            <UserSummary userFullName={user?.full_name} />
          </View>
        </AppMenu>

        {/* <Menu
            style={{ paddingTop: 50 }}
            visible={true}
            // onDismiss={props.on_dismiss || close_menu}
          //   anchor={<Button onPress={open_menu}>{ props.anchor_label }</Button>}
          // anchor={<Button disabled={disabled} icon={props.anchor_icon} mode='text' onPress={open_menu}>{ props.anchor_label }</Button>} 
            anchor={<IconButton
                        // label={props.anchor_label} 
                        // disabled={disabled} 
                        // size={props.anchor_size}  
                        icon='cog'
                        // mode='contained-tonal' 
                        onPress={()=>set_visible(true)}
                    >                        
                    </IconButton>} 
          >
            <Text>Item 5</Text>
            <Text>Item 6</Text>
            <Button>Button</Button>
            <Text>Item 7</Text> 
        </Menu>  */}
      </View>
    </View>
  );
}

export default AppHeader

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  sync_container: {
    backgroundColor: 'white',
    padding: 50,
    margin: 20,
    height: 300
  }
})