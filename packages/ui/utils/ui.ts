import { FIELD_TYPE } from "../constants/enums";
import { SPECIAL_TEXT_FIELD_TYPE } from "../constants/enums";
import { GLOBALS } from "../constants/defaults";
import { IBaseFieldProps } from "../interfaces/inputs";

class UIUtil {
    /**
     * Get keyboard to use on focus of a field
     * @param field 
     * @returns 
     */
    static get_keyboard_type_old = (field: IBaseFieldProps) => {
        //see https://www.lefkowitz.me/visual-guide-to-react-native-textinput-keyboardtype-options/
        let keyboard_type = 'default';
        switch(field.field_type) {
            case FIELD_TYPE.INT:
                return 'number-pad';
            break;
            case FIELD_TYPE.FLOAT: case FIELD_TYPE.CURRENCY:
                return 'decimal-pad'; //numeric
            break;
            case FIELD_TYPE.PASSWORD:
                return 'default'; //'password';
            break; 
            case FIELD_TYPE.PHONE:
                return 'phone-pad'; //'password';
            break; 
            case FIELD_TYPE.DATA:
                const special_field_type = this.get_special_text_type(field);
                if(special_field_type == SPECIAL_TEXT_FIELD_TYPE.EMAIL) {
                    return 'email-address';
                } 
                break;
            default:
                break;
        }
        return keyboard_type;
    }

    static get_keyboard_type = (field_type: string, options: string) => {
        //see https://www.lefkowitz.me/visual-guide-to-react-native-textinput-keyboardtype-options/
        let keyboard_type = 'default';
        switch(field_type) {
            case FIELD_TYPE.INT:
                return 'number-pad';
            break;
            case FIELD_TYPE.FLOAT: case FIELD_TYPE.CURRENCY:
                return 'decimal-pad'; //numeric
            break;
            case FIELD_TYPE.PASSWORD:
                return 'default'; //'password';
            break; 
            case FIELD_TYPE.PHONE:
                return 'phone-pad'; //'password';
            break; 
            case FIELD_TYPE.DATA:
                const special_field_type = this.get_special_text_type(field_type, options);
                if(special_field_type == SPECIAL_TEXT_FIELD_TYPE.EMAIL) {
                    return 'email-address';
                } 
                break;
            default:
                break;
        }
        return keyboard_type;
    }
    /**
     * Retrieve field.options
     * @param field 
     * @returns 
     */
    static get_options = (field: IBaseFieldProps) => { 
        let options = 'options' in field ? field.options.toString().trim().toLocaleLowerCase() : '';
        return options;
    }

    /**
     * Get special text input field type
     * @param field 
     */
    static get_special_text_type = (field_type: string, options: string) => {
        if(field_type == FIELD_TYPE.DATA) {
            //const options = this.get_options(field);
            if(options?.toLocaleLowerCase().trim() == 'email') {
                return SPECIAL_TEXT_FIELD_TYPE.EMAIL;
            } 
        }
        return null;
        // if(field.field_type == FIELD_TYPE.DATA) {
        //     const options = this.get_options(field);
        //     if(options?.toLocaleLowerCase().trim() == 'email') {
        //         return SPECIAL_TEXT_FIELD_TYPE.EMAIL;
        //     } 
        // }
        // return null;
    }

    /**
     * Check if the supplied docname represents a new document
     * @param docname 
     * @returns 
     */
    static is_new_record = (docname: string) => {
        if(docname && docname.toString().toLocaleLowerCase().trim().split('-')[0] == GLOBALS.NEW_RECORD_ID.toLocaleLowerCase()) return true;
        return false;
    }
}
/**
 * Get keyboard to display
 */
export {
    UIUtil
} 