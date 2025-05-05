import * as Yup from 'yup';
import { MAX_UPLOAD_SIZE } from '@/constants/engage';
import { DocField } from '@/module/engage/types';
import { translate as t, translate } from '@/provider/translation';

class RuleBuilder {
    static validateFileSize = (value) => {
        if (value && value?.size) {
            return value?.size <= MAX_UPLOAD_SIZE;
        }
        return true;
    };
    static build = (field: DocField) => {
        if (field == null || field == undefined) return Yup.string();
        let schema; // = Yup.string().nullable();

        const key = field.fieldname;
        const fieldType = field.fieldtype;
        // /* Set base type */
        // if (Transformer.is_numeric_field(field)){
        //     schema = Yup.number();
        // }

        if (fieldType === 'Data') {
            schema = Yup.string().max(140); //.nullable(!field.reqd);
            if (!field.reqd) {
                schema = schema.nullable();
            }
        } else if (fieldType === 'Int') {
            schema = Yup.number().integer(); //.nullable(!field.reqd);
            if (!field.reqd) {
                schema = schema.nullable();
            }
        } else if (fieldType === 'Float') {
            schema = Yup.number(); //.nullable(!field.reqd);
            if (!field.reqd) {
                schema = schema.nullable();
            }
        } else if (fieldType === 'Currency') {
            schema = Yup.number().positive(); //.nullable(!field.reqd);
            if (!field.reqd) {
                schema = schema.nullable();
            }
        } else if (
            fieldType === 'Small Text' ||
            fieldType === 'Text' ||
            fieldType === 'Link'
        ) {
            schema = Yup.string(); //.nullable(!field.reqd);;
            if (!field.reqd) {
                schema = schema.nullable();
            }
        } else if (fieldType === 'Select') {
            let opts = Array.isArray(field.options)
                ? field.options
                : field.options.split('\n');
            schema = Yup.string().oneOf(opts);
        } else if (fieldType === 'Date') {
            schema = Yup.date();
        }
        // else if (fieldType === 'Link') {
        //     schema = Yup.string();
        // }
        if (fieldType === 'Table' || fieldType === 'Table MultiSelect') {
            schema = Yup.array();
        } else if (fieldType === 'Attach Image') {
            const valid_file_types = [
                'jpg',
                'gif',
                'png',
                'jpeg',
                'svg',
                'webp',
            ];
            const isValidFileType = (fileName: string) => {
                if (fileName) {
                    return (
                        valid_file_types.indexOf(fileName.split('.').pop()) > -1
                    );
                }
                return true;
            };
            schema = Yup.mixed()
                .test(
                    'is-valid-type',
                    `${field.label}. ` + t('BASE_CONTROLS.INVALID_IMAGE_FILE'),
                    (value) =>
                        isValidFileType(
                            value && value?.name?.toLocaleLowerCase()
                        )
                )
                .test(
                    'is-valid-size',
                    `${field.label}. ` +
                        t('BASE_CONTROLS.MAX_FILE_SIZE_EXCEEDED') +
                        MAX_UPLOAD_SIZE / (1024 * 1024) +
                        'MB',
                    (value) => this.validateFileSize(value)
                )
                .test(
                    'is-not-empty-array',
                    `${field.label}. ${t('VALIDATION.REQUIRED')}`,
                    (value) => {
                        if (
                            field.reqd &&
                            value instanceof Array &&
                            value.length == 0
                        ) {
                            return false;
                        }
                        return true;
                    }
                );
        } else if (fieldType === 'Attach') {
            const exclude_file_types = ['bat', 'exe', '.zip'];
            const isValidFileType = (fileName) => {
                if (fileName) {
                    return (
                        exclude_file_types.indexOf(fileName.split('.').pop()) ==
                        -1
                    );
                }
                return true;
            };
            schema = Yup.mixed()
                .test(
                    'is-valid-type',
                    `${field.label}. ` + t('BASE_CONTROLS.INVALID_FILE_TYPE'),
                    (value) => isValidFileType(value?.name?.toLocaleLowerCase())
                )
                .test(
                    'is-valid-size',
                    `${field.label}. ` +
                        t('BASE_CONTROLS.MAX_FILE_SIZE_EXCEEDED') +
                        MAX_UPLOAD_SIZE / (1024 * 1024) +
                        'MB',
                    (value) => this.validateFileSize(value)
                )
                .test(
                    'is-not-empty-array',
                    `${t('VALIDATION.REQUIRED')}`,
                    (value) => {
                        if (
                            field.reqd &&
                            value instanceof Array &&
                            value.length == 0
                        ) {
                            return false;
                        }
                        return true;
                    }
                );
        }
        // set special fields like email
        if (fieldType === 'Data') {
            const isEmail = field.options === 'Email';
            if (isEmail) {
                schema = schema.email(translate('VALIDATION.VALID_EMAIL'));
            }
        }
        // set required
        if (field.reqd) {
            // schema = schema.required(`${field.label}. ${t('VALIDATION.REQUIRED')}`);
            schema = schema.required(`${t('VALIDATION.REQUIRED')}`);
        }
        return schema;
    };
}

export { RuleBuilder };
