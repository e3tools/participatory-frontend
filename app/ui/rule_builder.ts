import * as Yup from 'yup';
import { IBaseFieldProps } from '../interfaces/inputs';
import { FIELD_TYPE, SPECIAL_TEXT_FIELD_TYPE } from '../constants/enums'; 
import { UIUtil } from '../utils/ui';
import { APP } from '../utils/app';

class RuleBuilder {  
    static build = (field: IBaseFieldProps ) => {
        if(field == null || field == undefined) return Yup.string();
        let schema = Yup.string().nullable(true);
         
        // console.log("Rules for : ", field.field_type)
        const key = field.field_name;
        const field_type = field.field_type;
        // /* Set base type */
        // if (Transformer.is_numeric_field(field)){
        //     console.log("Numeric field: ", field.fieldname);
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
            schema = schema.required(`${APP._('VALIDATION.REQUIRED')}`);//APP._(`${field.label} is required`));
        }
        return schema;
    }
}

export { RuleBuilder }