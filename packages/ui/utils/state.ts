import { FormStore } from "../store/form";

/**
 * Update form state
 * @param doctype 
 * @param values
 */
export const set_form_store = (doctype: string, values: object) => { 
    FormStore.update(s=> {
        if(!(doctype in s.forms)){
            s.forms[doctype] = values;// initialize if doctype key does not exist
        }
        else {
            s.forms[doctype] = values;
        }
    })
}

/**
 * Update form state
 * @param doctype 
 * @param values
 */
export const get_form_store = (doctype: string, forms: object) => {
    if(doctype in forms){
        if(doctype in forms){
            return forms[doctype];
        }
    } 
    return null;
}

/**
 * Update form field store value
 * @param doctype 
 * @param fieldname 
 * @param value 
 */
export const update_field_store_value = (doctype: string, fieldname: string, value: object) => {
     FormStore.update(s=> {
        if(!s.forms) s.forms = {}
        if(!(doctype in s.forms)){
            s.forms[doctype] = {};// initialize if doctype key does not exist
        }
        s.forms[doctype][fieldname] = value; 
    })
}

/**
 * Retrieve form field value from store
 * Since we cannot use useState hook outside of a component, we need to pass the state as an argument
 * @param doctype 
 * @param fieldname 
 */
export const get_field_store_value = (doctype: string, fieldname: string, forms: object) => {
    // const forms = FormStore.useState(f => f.forms);
    forms = forms || {}; 
    if(doctype && doctype in forms){
        if(fieldname in forms[doctype] || {}){
            return forms[doctype][fieldname];
        }
    }
    return null;
}

/**
 * Reset
 * @param doctype 
 * @param fieldname 
 * @param forms 
 * @returns 
 */
export const reset_form_store = (doctype: string) => {
    // FormStore.update(s => {
    //     if(doctype in forms) s.forms[doctype] = {};
    // }); 
    FormStore.update(s => {
        if(!s.forms) s.forms = {}
        if(doctype in s.forms){
           delete s.forms[doctype];
        } 
    }); 
}

/**
 * Does form exist in the store?
 * @param form 
 * @param forms 
 * @returns 
 */
export const form_store_exists = (doctype: string, forms: object) => { 
   return doctype in forms; 
}