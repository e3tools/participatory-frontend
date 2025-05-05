import { DocField, DocFieldType } from '@/module/engage/types';
import { KeyboardTypeOptions } from 'react-native';
import { SelectOption } from '../components/form/select';

export const getKeyboardType = (
    fieldType: DocFieldType,
    options: string
): KeyboardTypeOptions => {
    //see https://www.lefkowitz.me/visual-guide-to-react-native-textinput-keyboardtype-options/
    let keyboardType: KeyboardTypeOptions = 'default';
    switch (fieldType) {
        case 'Int':
            return 'number-pad';
            break;
        case 'Float':
        case 'Currency':
            return 'decimal-pad'; //numeric
            break;
        case 'Password':
            return 'default'; //'password';
            break;
        case 'Phone':
            return 'phone-pad'; //'password';
            break;
        case 'Data':
            if (options === 'Email') {
                return 'email-address';
            }
            break;
        default:
            break;
    }
    return keyboardType;
};

/**
 * Evaluate depends on
 * Works well on initial render. However it does not work thereafter since it is dependent on
 * the values of the form
 * @param expression
 * @param formik_props
 * @returns
 */
export const evaluateDependsOn = (
    field: DocField,
    expression: string,
    /*selected_field: object,*/ formValues: Record<string, any>
) => {
    let exp_str;
    const _eval = (xpr: string) => {
        return eval(xpr);
    };

    let exp = '1=0';
    //check if visibility is based on another field
    if (expression) {
        let tmp = expression;
        if (tmp.indexOf('doc.') === -1) {
            //If we have an expression without doc. prefix
            tmp = 'formValues.' + tmp;
        }
        // exp = tmp.replace(/eval:/g, "").replace(/doc./g, "formValues.");
        exp = tmp.replace(/eval:/g, '');

        // replace doc.[field] with actual values
        let keys = Object.keys(formValues) || [];
        keys.forEach((key) => {
            let re = new RegExp(`doc.${key}`, 'g');
            let val = formValues?.[key];
            if (isNaN(parseFloat(val))) {
                val = '"' + val + '"';
            }
            exp = exp.replace(re, val);
        });
        let res = _eval(exp);
        return res;
    }
    return true;
};

/**
 * Split Select Field options string into array of objects
 * @param options
 * @returns
 */
export const splitOptions = (options: string): SelectOption[] => {
    const res: SelectOption[] = [];
    if (options) {
        options.split('\n').map((el) => {
            if (el) {
                res.push({ label: el, value: el });
            }
        });
    }
    return res;
};
