import { Numeric } from "i18n-js";
import { ViewStyle } from "react-native";


export interface IMenuProps {
    visible: boolean, //is menu visible
    on_dismiss?: () => void,
    // anchor: React.Component<any>, //component upon which the menu is anchored
    anchor_label: string, //title of the component where menu is anchored
    anchor_icon: string, //icon to use for the anchor
    //menu_items: Array<IMenuItemProps>
    /**
    * Content of the `Menu`.
    */
    children: React.ReactNode,
    disabled: boolean,
    anchor_size: number
}

export interface IMenuItemProps {
    style?: object, //Style to be applied
    title?: string, //menu item title
    on_press?: () => void, //function to call onPress
    is_divider?: boolean, //is it a divider
}

export interface ISnackbarProps {
    message: string,
    duration: number
}

export interface ISliderProps {
    minimum_value: number,
    maximum_value: number,
    value?: number,
    on_value_change: (val)=>void,
    step: number
}