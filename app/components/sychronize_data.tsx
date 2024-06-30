import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import OnlineStatus from './online_status'
import { Button, Modal, PaperProvider, Portal } from 'react-native-paper';
import AppLoader from './shared/AppLoader';
import { Sync } from '../utils/sync';
import { APP } from '../utils/app';
import { DB } from '../utils/db';

type SyncDataProps = {
  visible: boolean,
  on_dismiss: ()=>void
}
const SynchronizeData = (/*props: SyncDataProps*/) => {
  const [syncing, set_syncing] = useState(false);
  const [is_online, set_is_online] = useState(false);

  useEffect(()=>{
    const load = async()=> {
      const res = await DB.is_online();
      console.log("Online status", res)
      set_is_online(res);
    }
    console.log("Loading online...")
    load();
  }, [])

  //const {visible, on_dismiss} = props
  // const [show, set_show] = React.useState(visible);
  // useEffect(()=> {
  //   set_show(visible);
  // }, [visible]);
  

  const start_sync = () => {
    APP.notify(APP._("GLOBAL.SYNC_IN_PROGRESS"))
    set_syncing(true);
    setTimeout(()=> {
      Sync.sync_down()
      set_syncing(false);
    }, 3000);
    // Sync.sync_down();
    // set_syncing(false);
    APP.notify(APP._("GLOBAL.SYNC_COMPLETED"))
  }

  return (
    <View>
      <Button icon='sync' disabled={!is_online} mode='contained' onPress={()=>start_sync()}>{APP._("GLOBAL.SYNC_START")} </Button>
      {syncing && <AppLoader />}
      <OnlineStatus />       
    </View>
  )
  // return (  
  //   <Portal>
  //     {/* <Text>SynchronizeData</Text> */}
  //     <Modal
  //         visible={show}
  //         dismissable={true}
  //         onDismiss={()=> {
  //           set_show(false);
  //           on_dismiss();
  //         }
  //       }
  //       contentContainerStyle={styles.container}
  //     >
  //       <OfflineNotice />
  //     </Modal>
  //   </Portal> 
  // )
}

export default SynchronizeData

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 50
  }
})