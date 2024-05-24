import { FormikState } from "formik";
import { StyleProp, ViewStyle } from "react-native";

interface IBaseFieldProps {    
    field: object,
    name: string,
    field_name: string,
    field_type: string,
    label: string,
    value: any,
    hidden: boolean,
    readonly: boolean,    
    placeholder: string,
    depends_on: string, // Display of this field depends on this expression. Specify it in form of doc.FIELDNAME e.g doc.gender == 'Male'
    mandatory_depends_on: string, //This field will be required if the following expression is true. Specify it in form of doc.FIELDNAME e.g doc.gender == 'Male'
    form_state: FormikState<{}>,
    style: StyleProp<ViewStyle>, //additional display style
    reqd: boolean, //Is the field mandatory
    options: object, //It could be a string or an array. For select, this is an array, for special fields e.g email of Link fields, this is a primitive string
    on_change: (value: any) => void,
    on_blur?: () => void
}

interface IDataProps extends IBaseFieldProps {  
}

interface ISelectProps extends IBaseFieldProps {
    label_field?: string,
    value_field?: string,
    searchable?: boolean
}

interface INumericProps extends IBaseFieldProps {

}
interface ICheckBoxProps extends IBaseFieldProps { 
}

interface IDateProps extends IBaseFieldProps { 
}

interface IPasswordProps extends IBaseFieldProps { 
    visible: boolean
}

interface IChildTableProps extends IBaseFieldProps {
    doctype: string, //doctype of the child doc
    parenttype: string, //doctype of the parent doc
    parentfield: string, //Table field that contains the parent doc value
    parent?: string, //id of the parent doc
    parentdoc?: object, //parent doc incase it is available
    // on_change?: ()=>void, //handler for on_change function of DataTable
    navigation?: object, //navigation object
}  

interface ITableMultiSelectProps extends ISelectProps, IChildTableProps { 
}

interface ISectionBreakProps extends IBaseFieldProps {  
}

export {
    IBaseFieldProps,
    IDataProps,
    ISelectProps,
    INumericProps,
    ICheckBoxProps,
    IDateProps,
    IPasswordProps,
    IChildTableProps,
    ITableMultiSelectProps,
    ISectionBreakProps
}