import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { get_field_store_value, set_form_store } from '@/app/ui/utils/state';
import { FormStore } from '@/app/ui/store/form';
import { DocTypeService } from '@/app/services/doctype';
import { UIUtil } from '@/app/utils/ui';
import { APP } from '@/app/utils/app';

// type StoreHOCProps = {
//     doctype: string,
//     docname: string,
//     field_name: string
// }

const withStoreValue = (WrappedComponent) => (props) => {
    const [value, set_value] = useState(props.value);
    const forms = FormStore.useState(s => s.forms);
    const db = new DocTypeService(props.doctype);
      
    useEffect(() => {
        /* Check if there exists an entry in the store for that particular form. IF the form exists, retrieve the value of the field from there.
        If there is no entry and the docname signifies that it is an existing doc, retrieve from the db and set in the store, then try retrieve.
        */
       const load = async () => {
            let val = get_field_store_value(props.doctype, props.field_name, forms); 
            if(!val)
            {
                if(!UIUtil.is_new_record(props.docname)){
                    const doc = await db.get_doc(props.docname); 
                    if(doc) { 
                        set_form_store(props?.doctype, doc);
                        val = doc[props?.field_name];
                    }
                }
            }
            set_value(val)
            return val;
       } 
       load();
    }, []);

    useEffect(() => {
        set_value(props.value);
    }, [props.value])

    return <WrappedComponent {...props} value={value} />   
}

export default withStoreValue;