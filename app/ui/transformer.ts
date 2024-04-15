import { 
    IBaseFieldProps, 
    IDataProps, 
    ISelectProps, 
    INumericProps, 
    IDateProps, 
    ICheckBoxProps, 
    IChildTableProps, 
    ITableMultiSelectProps} from "../interfaces/inputs"; 
import { FIELD_TYPE } from "../constants/enums";
import {  } from "../interfaces/inputs";

// /**
//  * Generic config to hold field types
//  */
// type FormFieldConfig = {
//     fieldtype: string,
//     fieldname: string,
//     required: boolean,
//     hidden: boolean,
//     options: any,
//     label: string
// }

class Transformer {
    /**
     * Transform a Frappe field configuration into a generic config
     * @param field_def 
     */
    static _frappe_base_transform(field_cfg: object) : IBaseFieldProps { 
        let cfg = {} as IBaseFieldProps;

        cfg.field = field_cfg;
        cfg.field_type = field_cfg.fieldtype;
        cfg.field_name = field_cfg.fieldname;
        cfg.name = field_cfg.fieldname;
        cfg.reqd = field_cfg.reqd || 0;
        cfg.hidden = field_cfg.hidden || 0;
        cfg.options = field_cfg.options || '';
        cfg.label = field_cfg.label || '';
        cfg.placeholder = field_cfg.label || '';
        cfg.readonly = field_cfg.read_only;
        cfg.style = { display: field_cfg.hidden == 1 ? 'none' : 'block' } 
        return cfg;
    }
    
    /**
     * Generic transform
     * @param field_cfg 
     * @returns 
     */
    static _base_transform(field_cfg: object) : IBaseFieldProps { 
        let cfg = this._frappe_base_transform(field_cfg) as IBaseFieldProps;
        return cfg;
    }

    static _data_props(field_cfg: object) : IDataProps {
        let cfg = this._base_transform(field_cfg) as IBaseFieldProps;
        let dst = {} as IDataProps;
        Object.assign(dst, cfg);
        dst.on_change = () => {};
        return dst;
    }

    static _select_props(field_cfg: object) : ISelectProps {
        let cfg = this._base_transform(field_cfg) as IBaseFieldProps;
        let dst = {} as ISelectProps;
        Object.assign(dst, cfg);
        dst.on_change = () => {};
        let opts = field_cfg.options;
        dst.options = opts ? (opts instanceof Array ? opts : opts.split('\n')) : [];        
        return dst;
    }

    static _numeric_props(field_cfg: object) : ISelectProps {
        let cfg = this._base_transform(field_cfg) as IBaseFieldProps;
        let dst = {} as INumericProps;
        Object.assign(dst, cfg);
        dst.on_change = () => {};
        return dst;
    }

    static _checkbox_props(field_cfg: object) : ICheckBoxProps {
        let cfg = this._base_transform(field_cfg) as IBaseFieldProps;
        let dst = {} as ICheckBoxProps;
        Object.assign(dst, cfg);
        dst.on_change = () => {};
        return dst;
    }

    static _date_props(field_cfg: object) : IDateProps {
        let cfg = this._base_transform(field_cfg) as IBaseFieldProps;
        let dst = {} as IDateProps;
        Object.assign(dst, cfg);
        dst.on_change = () => {};
        return dst;
    }

    static _table_props(field_cfg: object) : IDateProps {
        let cfg = this._base_transform(field_cfg) as IBaseFieldProps; 
        let dst = {} as IChildTableProps;
        Object.assign(dst, cfg);
        dst.doctype = field_cfg.options;  
        dst.on_change = () => {};  
        return dst;
    }

    /**
     * Transform any Frappe field definition into generic format
     * @param field_cfg 
     * @returns 
     */
    static transform_field(field_cfg: object) {
        const field_type = field_cfg.fieldtype;
        let el = null;
        let props = null;
        
        switch (field_type){ 
            case FIELD_TYPE.DATA: 
            case FIELD_TYPE.SMALL_TEXT: 
            case FIELD_TYPE.TEXT:
            case FIELD_TYPE.LONG_TEXT:
            case FIELD_TYPE.PHONE:
                props = Transformer._data_props(field_cfg) as IDataProps;
            break;
           
            case FIELD_TYPE.SELECT: case FIELD_TYPE.LINK:
                props = Transformer._select_props(field_cfg) as ISelectProps;
            break;

            case FIELD_TYPE.INT: case FIELD_TYPE.FLOAT: case FIELD_TYPE.CURRENCY:
                props = Transformer._numeric_props(field_cfg) as INumericProps;   
            break;

            case FIELD_TYPE.CHECKBOX:
                props = Transformer._checkbox_props(field_cfg) as ICheckBoxProps;
            break;

            case FIELD_TYPE.DATE:
                props = Transformer._date_props(field_cfg) as IDateProps;
            break;

            case FIELD_TYPE.TABLE:
                props = Transformer._table_props(field_cfg) as IChildTableProps;
            break;

            case FIELD_TYPE.MULTI_SELECT_TABLE:
                props = Transformer._table_props(field_cfg) as ITableMultiSelectProps;
            break;
            
            case FIELD_TYPE.ATTACH:
            case FIELD_TYPE.ATTACH_IMAGE:
                props = Transformer._data_props(field_cfg) as IDataProps;
            break;

            default: 
            break;
        }
        return props;
    } 

    /**
     * Check if field is numeric
     * @param field 
     * @returns 
     */
    static is_numeric_field(field: IBaseFieldProps) {
        return [FIELD_TYPE.INT, FIELD_TYPE.FLOAT, FIELD_TYPE.CURRENCY].includes(field.field_type);
    }
}

export {
    Transformer,
    // FormFieldConfig
}