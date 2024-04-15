const InstanceStore = class InstanceStore {
    static set_current_instance = (proxy: object) => {
        console.log(proxy);
    }

    static get_current_instance = () => {
        console.log("Getting...");
    } 
}
export { InstanceStore }
 
import { Store } from "pullstate";

/**
 * Lightweight store to hold form values as the user is capturing them
 * Whenever a tab is focused, form values will be initialized using stored state
 */

/**
 * Values will be stored as an object to ensure it can hold state for multiple forms especially for the case 
 * of multi-step forms
 */
// interface IAppInstanceStore {
//     BACKEND_URL: string
// }

// const AppInstanceStore = new Store<IAppInstanceStore>({
//     BACKEND_URL: 'http://197.248.185.171'
// })

// export {AppInstanceStore}