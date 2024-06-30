import { observable } from "@legendapp/state";
import { APP } from "../utils/app";
import { configureObservablePersistence, persistObservable } from "@legendapp/state/persist";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage"; 

// const LocalDB = new MMKV({
//   id: `user-${userId}-storage`,
//   path: `${USER_DIRECTORY}/storage`,
//   encryptionKey: 'hunter2',
//   mode: Mode.MULTI_PROCESS
// })

// const GlobalLocalDB = new MMKV();
  
// const useUserLocalDB = async () => {
//     const is_authenticated = await AuthService.is_authenticated();
//     if(is_authenticated){
//         const user = await AuthService.get_current_user();
//         return new MMKV({
//             id: `user-${user.name}-storage`,
//         })        
//         // const LocalDB = new MMKV({
//         //   id: `user-${userId}-storage`,
//         //   path: `${USER_DIRECTORY}/storage`,
//         //   encryptionKey: 'hunter2',
//         //   mode: Mode.MULTI_PROCESS
//         // })
//     }
//     return null;
// } 

// Global configuration
// configureObservablePersistence({
//     // Use react-native-mmkv in React Native
//     pluginLocal: ObservablePersistMMKV,  
// })

configureObservablePersistence({
    // Use react-native-mmkv in React Native
    pluginLocal: ObservablePersistLocalStorage,  
})

// const TABLES_TO_UP_SYNC = new Array<string>();
// const TABLES_TO_DOWN_SYNC = ["User", "Admin 0", "Admin 1", "Admin 2", "Admin 3", "Admin 4", "Admin 5"];

// const initialize_db_state = () => {
//     const db_obj = {'sync_up': {}, 'sync_down': {}};
//     // Initialize state
//     TABLES_TO_UP_SYNC.forEach((el) => {
//         db_obj['sync_up'][el] = [];
//     });

//     TABLES_TO_DOWN_SYNC.forEach((el) => {
//         db_obj['sync_down'][el] = [];
//     });
//     return db_obj;
// }

// const initial_state = initialize_db_state();
const LocalDBState$ = observable({ data: {} });

// Persist this observable
persistObservable(LocalDBState$, {
    pluginLocal: ObservablePersistLocalStorage,
    local: 'store' // Unique name
})
  
export { LocalDBState$ }