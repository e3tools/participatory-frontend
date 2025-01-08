const FIELD_TYPE = {
    DATA: 'Data',
    PASSWORD: 'Password',
    TEXT: 'Text',
    SMALL_TEXT: 'Small Text',
    LONG_TEXT: 'Long Text',
    SELECT: 'Select',
    LINK: 'Link',
    LINKED_FIELD: 'Read Only',
    CURRENCY: 'Currency',
    INT: "Int",
    FLOAT: "Float",
    DATE: "Date",
    CHECKBOX: "Check",
    PHONE: 'Phone',
    ATTACH: 'Attach',
    ATTACH_IMAGE: 'Attach Image',
    TABLE: 'Table',
    MULTI_SELECT_TABLE: 'Table MultiSelect',
    SECTION_BREAK: "Section Break",
    GEOLOCATION: "Geolocation",
}

const SPECIAL_TEXT_FIELD_TYPE = { 
    EMAIL: 'Email'
}

export {
    FIELD_TYPE, 
    SPECIAL_TEXT_FIELD_TYPE, 
}

export interface IMenuItemProps {
  style?: object, //Style to be applied
  title?: string, //menu item title
  onPress?: () => void, //function to call onPress
  is_divider?: boolean, //is it a divider
}
