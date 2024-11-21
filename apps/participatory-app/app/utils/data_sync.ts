import { APPS, URLS } from '../constants/enums';
import { _ as t } from "./translate";
import { router, useNavigation, useRootNavigationState } from 'expo-router'; 
import { Alert, ToastAndroid } from 'react-native'; 
import * as Random from 'randomstring';   
// import { NavigationActions } from 'react-navigation';
import { CommonActions, DrawerActions } from '@react-navigation/native';
import * as Updates from 'expo-updates';
import { useNetInfo } from '@react-native-community/netinfo'; 
import { Sync } from 'data-layer/utils/sync'; 
import { 
  TABLES_TO_UP_SYNC,
  TABLES_TO_DOWN_SYNC,
  TABLES_TO_DOWN_SYNC_EXTRA_FIELDS,
  WRITEABLE_TABLES 
} from '../constants/enums';
import { VectorService } from '../services/vector';

const SYNC = new Sync(TABLES_TO_UP_SYNC, TABLES_TO_DOWN_SYNC, TABLES_TO_DOWN_SYNC_EXTRA_FIELDS, WRITEABLE_TABLES);

const full_sync = async () => {  
  await SYNC.full_sync();
  await VectorService._initialize_localDB();
  /*
  SYNC.sync_down(()=>{
    console.log("Sync down completed")
  });
  SYNC.sync_up();*/
} 

const down_sync = async() => {
  SYNC.sync_down(() => {
    // load shapes
    VectorService._initialize_localDB();
  })
}
export { full_sync, down_sync };
