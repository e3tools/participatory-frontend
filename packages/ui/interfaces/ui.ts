import { StyleProp, ViewStyle } from "react-native";

export interface IGridButtonProps {
    label: string, //label of the button
    icon: string, //icon of the button
    onPress: (e)=> void, //handler when button is pressed
  } 
  
  export interface IGridProps { 
    label?: string,
    doctype: string, 
    docname?: string,
    isChildTable: boolean,
    parent?: string, //id of the parent in case of a child table 
    parenttype?: string, //parent type in case of a child table 
    parentfield?: string, //parent field in case of 
    parentdoc?: object, //parent doc object in case of a child table
    on_row_select?: (row: object) => void, //additional event listener for row selection
    header_buttons?: Array<IGridButtonProps>, //header buttons
    footer_buttons?: Array<IGridButtonProps>, //footer buttons
    on_change?: (vals) => void,//handler for on_change of rows
    style: StyleProp<ViewStyle>, //additional display style,
    value: Array<object>, //Initial set of rows
    field_name: string, //Id of the grid
    is_report?: boolean,
    navigation?: object, // navigation object
  }
 

  interface ExtraFieldDef<T> {
    // [key: string]: any;
    fields: any[]
  }

  export interface IDocFormProps {
    title?: string, 
    isChildTable: boolean,
    doctype: string,
    docname?: string,
    doc?: object,
    showSaveButton?: boolean,
    initialValues?: object,
    fields?: Array<object>,
    onInsertChildRow?: (row: object)=>void, //function to call when a child table record is inserted if this is a child table
    onSubmit?:(values?: any)=>void, // function to call when form is submitted when this is not a child table
    navigation?: object, //navigation object
    extraData?: ExtraFieldDef<any>;
  }
 
export interface IDocDialogProps extends IDocFormProps { 
    visible: boolean, 
}
 