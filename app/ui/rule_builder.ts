import * as Yup from 'yup';
import { IBaseFieldProps } from '../interfaces/inputs';
import { FIELD_TYPE, SPECIAL_TEXT_FIELD_TYPE } from '../constants/enums'; 
import { UIUtil } from '../utils/ui';
import { APP } from '../utils/app';
import { GLOBALS } from '../constants/defaults';
import { tr } from 'react-native-paper-dates';

class RuleBuilder {  
    static validate_file_size = (value) => { 
        if(value && value?.size) { 
            return value?.size <= GLOBALS.MAX_UPLOAD_SIZE
        }
        return true
    }
    static build = (field: IBaseFieldProps ) => {
        if(field == null || field == undefined) return Yup.string();
        let schema = Yup.string().nullable(true);
          
        const key = field.field_name;
        const field_type = field.field_type;
        // /* Set base type */
        // if (Transformer.is_numeric_field(field)){ 
        //     schema = Yup.number();
        // }
        if ([FIELD_TYPE.DATA].includes(field_type)){
            schema = Yup.string().max(140).nullable(!field.reqd);
        }
        else if ([FIELD_TYPE.INT].includes(field_type)){
            schema = Yup.number().integer().nullable(!field.reqd);
        }
        else if ([FIELD_TYPE.FLOAT].includes(field_type)){
            schema = Yup.number().nullable(!field.reqd);
        }
        else if ([FIELD_TYPE.CURRENCY].includes(field_type)){
            schema = Yup.number().positive().nullable(!field.reqd);
        }
        else if ([FIELD_TYPE.SMALL_TEXT, 
                  FIELD_TYPE.TEXT, 
                  FIELD_TYPE.LINK].includes(field_type)){
            schema = Yup.string().nullable(!field.reqd);;
        }
        else if ([FIELD_TYPE.SELECT].includes(field_type)){ 
            let opts = Array.isArray(field.options) ? field.options : field.options.split('\n');
            schema = Yup.string().oneOf(opts);
        }
        else if ([FIELD_TYPE.DATE].includes(field_type)) {
            schema = Yup.date();
        }
        else if ([FIELD_TYPE.LINK].includes(field_type)) {
            schema = Yup.string();
        }
        else if ([FIELD_TYPE.TABLE, FIELD_TYPE.MULTI_SELECT_TABLE].includes(field_type)) {
            schema = Yup.array();
        }
        else if ([FIELD_TYPE.ATTACH_IMAGE].includes(field_type)) { 
            const valid_file_types = ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp']
            const is_valid_file_type = (file_name) => {
                if(file_name){
                    return valid_file_types.indexOf(file_name.split(".").pop() > -1);
                }
                return true
            }
            schema = Yup
                        .mixed()
                        .test("is-valid-type", `${field.label}. ` + APP._("BASE_CONTROLS.INVALID_IMAGE_FILE"), 
                            value => is_valid_file_type(value && value?.name?.toLocaleLowerCase())
                        )
                        .test("is-valid-size", `${field.label}. ` + APP._("BASE_CONTROLS.MAX_FILE_SIZE_EXCEEDED") + GLOBALS.MAX_UPLOAD_SIZE / (1024 * 1024) + 'MB', 
                            value => this.validate_file_size(value)
                        )
                        .test("is-not-empty-array", `${field.label}. ${APP._('VALIDATION.REQUIRED')}`, 
                            value => { 
                                if (field.reqd && value instanceof Array && value.length == 0) {
                                    return false
                                }
                                return true
                            } 
                        )
        }
        else if ([FIELD_TYPE.ATTACH].includes(field_type)) { 
            const exclude_file_types = ['bat', 'exe', '.zip']
            const is_valid_file_type = (file_name) => { 
                if(file_name){
                    return exclude_file_types.indexOf(file_name.split(".").pop() == -1);
                } 
                return true;
            }
            schema = Yup
                        .mixed()
                        .test("is-valid-type", `${field.label}. ` + APP._("BASE_CONTROLS.INVALID_FILE_TYPE"), 
                            value => is_valid_file_type(value?.name?.toLocaleLowerCase())
                        )
                        .test("is-valid-size", `${field.label}. ` + APP._("BASE_CONTROLS.MAX_FILE_SIZE_EXCEEDED") + GLOBALS.MAX_UPLOAD_SIZE / (1024 * 1024) + 'MB', 
                            value => this.validate_file_size(value)
                        )
                        .test("is-not-empty-array", `${field.label}. ${APP._('VALIDATION.REQUIRED')}`, 
                            value => { 
                                if (field.reqd && value instanceof Array && value.length == 0) {
                                    return false
                                }
                                return true
                            } 
                        )
        }
        // set special fields like email
        if([FIELD_TYPE.DATA].includes(field_type)) {
            const special_field_type = UIUtil.get_special_text_type(field);
            if(special_field_type == SPECIAL_TEXT_FIELD_TYPE.EMAIL) {
                schema = schema.email();  
            }
        }
        // set required
        if(field.reqd) {
            // schema = schema.required(`${field.label}: ${APP._('VALIDATION.REQUIRED')}`);//APP._(`${field.label} is required`));
            // schema = schema.required(`${APP._('VALIDATION.REQUIRED')}`);//APP._(`${field.label} is required`));
            schema = schema.required(`${field.label}. ${APP._('VALIDATION.REQUIRED')}`);//APP._(`${field.label} is required`));
        }
        return schema;
    }
}

export { RuleBuilder }