import { Store } from "pullstate";

/**
 * Lightweight store to hold form values as the user is capturing them
 * Whenever a tab is focused, form values will be initialized using stored state
 */

/**
 * Values will be stored as an object to ensure it can hold state for multiple forms especially for the case 
 * of multi-step forms
 */
interface IFormStore {
    forms: {}
}

const FormStore = new Store<IFormStore>({
    forms: {}
})

export {FormStore}