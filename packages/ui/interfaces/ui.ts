import { StyleProp, ViewStyle } from "react-native";

export interface IGridButtonProps {
    label: string, //label of the button
    icon: string, //icon of the button
    on_press: (e)=> void, //handler when button is pressed
  }
  
  export interface IGridProps { 
    label?: string,
    doctype: string, 
    docname?: string,
    is_child_table: boolean,
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

  export interface IDocFormProps {
    title?: string, 
    is_child_table: boolean,
    doctype: string,
    docname?: string,
    doc?: object,
    show_save_button?: boolean,
    initial_values?: object,
    fields?: Array<object>,
    on_insert_child_row?: ()=>void, //function to call when a child table record is inserted if this is a child table
    on_submit?:()=>void, // function to call when form is submitted when this is not a child table
    navigation?: object, //navigation object
  }
 
export interface IDocDialogProps extends IDocFormProps {
    // doctype: string,
    // docname: string,
    // doc: object,
    visible: boolean,
    // is_child_table: boolean,
    // on_dismiss: ()=>void,
    // insert_child_row: (row: object)=>void,
}


// export interface DocListProps {
//   doctype: string,
//   is_child_table: boolean,
//   parent: string, //id of the parent
//   parenttype?: string, //parent type in case of a child table 
//   parentfield?: string, //parent field in case of 
//   parentdoc?: object, //parent doc object in case of a child table
//   navigation: object, //navigation object
// }