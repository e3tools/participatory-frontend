import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Formik, FormikFormProps, FormikProps, useFormik } from 'formik';
import { Button } from '@/module/ui/components/button';
import { router, useRouter } from 'expo-router';
import {
    useGetEngagementForm,
    useGetEngagementFormFields,
} from '@/stores/EngagementFormStore';
import { TextInput } from '@/module/ui/components/form/text-input';
import * as Yup from 'yup';
import { DocField, DocType } from '../types';
import {
    ENGAGEMENT_TYPE,
    EngagementForm,
    EngagementFormField,
} from '@/stores/types';
import { ThemedText } from '@/components/ThemedText';
import { useGetDocFields, useGetDocType } from '@/stores/DocTypeStore';
import { BodyScrollView } from '@/components/ui/BodyScrollView';
import { useLocale } from '@/provider/translation';
import { appleRed, zincColors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
    evaluateDependsOn,
    getKeyboardType,
    splitOptions,
} from '@/module/ui/utils/ui';
import { parseDate } from '@/utils/date';
import { RuleBuilder } from '@/module/ui/utils/rule-builder';
import { CheckBox } from '@/module/ui/components/form/checkbox';
import { DateInput } from '@/module/ui/components/form/date-input';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Select, { SelectOption } from '@/module/ui/components/form/select';
import { useEngage } from '@/provider/engage';
import { TouchableOpacity } from 'react-native';
import { useGetDraftSubmissionByEngagement } from '@/stores/SubmissionStore';
import { generateRandomString } from '@/utils/common';
import ChildTable from '@/module/ui/components/form/child-table';

const NON_FORM_FIELDS = [
    'Tab Break',
    // 'Section Break',
    'Column Break',
];

interface StructuredFormProps {
    doctype: string;
    docname: string;
    doc?: any; // document to be edited
    initValues: Record<string, any>;
    onSubmit?: (values) => void;
    // child table props
    parentField?: string; //field name of the field in the parent form linking the child table
    engagement: string;
    isChild?: boolean;
    parentDocName?: string;
    parentDoctype?: string;
    childRowIndex?: number;
}

/**
 * We can have a recurring container within the container,
 */
const FormBuilder = ({
    doctype,
    engagement,
    fields,
    formik,
}: {
    doctype: DocType;
    engagement: string;
    fields: DocField[];
    formik: FormikProps<any>;
}) => {
    const { setSubmissionValue } = useEngage();

    return (
        <>
            <BodyScrollView style={{ paddingBottom: 300 }}>
                {fields.map((field) => {
                    return renderField(field);
                })}
            </BodyScrollView>
        </>
    );
};

export default function StructuredForm({
    doctype,
    docname,
    initValues,
    onSubmit,
    parentField,
    engagement,
    isChild,
    parentDocName,
    parentDoctype,
    doc,
    childRowIndex,
}: StructuredFormProps) {
    const router = useRouter();
    const formikRef = useRef(null);
    // const { submission: defaultSubmission, initializeStructuredSubmission } =
    //     useEngage();
    //const formFields = useGetEngagementFormFields(doctype);
    const [formFields, setFormFields] = useState([]);
    const DOCTYPE = useGetDocType(doctype);
    const { t } = useLocale();
    const { submission, setSubmissionValue } = useEngage();

    const draftSubmission = useGetDraftSubmissionByEngagement(engagement);
    // const [DOCNAME, setDOCNAME] = useState(docname || '');

    // const [submission, setSubmission] = useState(draftSubmission || {});

    //  console.log('Draft submission: ', draftSubmission);
    // if (draftSubmission) {
    //     submission = { ...draftSubmission };
    // } else {
    //     // initializeStructuredSubmission(engagement, doctype);
    //     submission = {
    //         engagement,
    //         engagement_form: doctype,
    //         engagement_type: ENGAGEMENT_TYPE.Structured,
    //         data: 'Sample first name',
    //     };
    // }
    // console.log('Final submission: ', submission);

    // const engagementForm = useGetEngagementForm(doctype);

    const makeFormConfig = (/*fields: Array<object> = []*/) => {
        // const _parse_val = (val, fld) => {
        //     if(!val) {
        //         //if val is null, try retrieve from the formstore
        //         if(formProps.isChildTable){
        //           //if child table, do not retrieve state as the state is stored for all rows not specific row field
        //           val = initialValues[fld.fieldname];
        //         }
        //         else {
        //           val = get_field_store_value(formProps.doctype, fld.fieldname, forms);
        //         }
        //     }
        //     if(!val) return val;
        //     if(fld.fieldtype == FIELD_TYPE.DATE){
        //         return parseDate(val);
        //     }
        //     return val;
        // }

        let dataObj = { doctype, docname };
        let formCfg = { fields: [], validationSchema: {}, initialValues: {} };
        let validationRules = {};
        // let frm_fields = fields; // fields?.length > 0 ? fields : form_fields;

        docfields?.map((field, idx) => {
            let key = field.fieldname;

            /* Transform into generic props*/
            // let clone_field = Transformer.transform_field(field);
            // formCfg.fields.push(clone_field);
            formCfg.fields.push(field);

            /* Get value of field from retrieved or created doc */
            if (field.fieldtype === 'Data') {
                dataObj[key] = doc?.[key]
                    ? parseVal(doc?.[key] || null, field)
                    : doc?.[key]; //doc[key] == null || doc[key] == undefined ? null : _parse_val(doc[key], field);
            }
            /* Make validation schema */
            // validationRules[key] = RuleBuilder.build(clone_field);
            if (field.fieldtype == 'Data') {
                validationRules[key] = RuleBuilder.build(field);
            }
        });

        // get stored form values. IF they exist, use them, else use the normal initialized values
        // const storeValues = null;
        // setInitialValues((vals) =>
        //     storeValues == null ? dataObj : storeValues
        // );

        // console.log('initValues: ', initValues);
        // setInitialValues(dataObj);
        formCfg.initialValues = dataObj;
        formCfg.validationSchema = Yup.object().shape(validationRules);
        // setFormConfig(formCfg);
        return formCfg;
    };

    const docfields = useGetDocFields(doctype);
    const formConfig = makeFormConfig();

    // const [initialValues, setInitialValues] = useState<object>(initValues); //({ name: '' });

    // const [formConfig, setFormConfig] = useState({
    //     fields: [],
    //     validationSchema: {},
    // });

    const parseVal = (val: any, fld: DocField) => {
        /*Get value from formStore. */
        /*
        let state_exists = form_store_exists(formProps.doctype, forms);
        let state_val = get_field_store_value(
          formProps.doctype,
          fld.fieldname,
          forms
        );
    
        if (state_exists) {
          //if val is null, try retrieve from the formstore
          if (formProps.isChildTable) {
            //if child table, do not retrieve state as the state is stored for all rows not specific row field
            if (doc) {
              // If a Child table row is being edited
              val = doc[fld.fieldname];
            } else {
              val = initialValues[fld.fieldname];
            }
          } else {
            val = state_val; // set to state value to allow for preservation of state on form navigation
          }
        }
        // if(!val) {
        //     //if val is null, try retrieve from the formstore
        //     if(formProps.isChildTable){
        //       //if child table, do not retrieve state as the state is stored for all rows not specific row field
        //       val = initialValues[fld.fieldname];
        //     }
        //     else {
        //       val = get_field_store_value(formProps.doctype, fld.fieldname, forms);
        //     }
        // }*/
        if (!val) return val;
        if (fld.fieldtype === 'Date') {
            return parseDate(val);
        }
        return val;
    };

    const validationSchema = Yup.object().shape({
        // venue: Yup.string()
        //     // .email('Please enter a valid email')
        //     .required('Venue is required'),
    });

    const makeValidationSchema = useCallback(() => {
        docfields.map((el) => {
            if (el.reqd) {
            }
        });
    }, [docfields]);

    // useEffect(() => {
    //     makeFormConfig();
    // }, [docfields]);

    /**
     * Get form fields to display including assessing runtime display or reqd options for the
     * fields that depend on others. Ensure the field config supplied conforms to the IBaseFieldProps interface
     * @param formik_props
     * @returns
     */
    const getFormFields = (formikValues: Record<string, any>) => {
        // for fields in other tabs, set display: none
        const cloneFields = [...docfields]; // make a copy to maintain the original state
        // const tabFields = formTabs?.[active_tab] || [];
        const tabFields = [...cloneFields];
        // const tabFields = clone_fields?.filter((df) => {
        //const flds = clone_fields?.filter((df) => {
        const flds = tabFields?.filter((df) => {
            if (!df) return false;
            let res = tabFields?.filter((el) => el.fieldname == df.fieldname);
            if (res.length == 0) {
                df.hidden = true; // set hidden to 1
            } else {
                /*
                if field does not belong to the active tab, set display to none. this is because react does not have support for keep-alive like in VueJS
                See https://github.com/facebook/react/issues/12039 
                */
                if (NON_FORM_FIELDS.includes(df.fieldtype)) {
                    return false;
                }
                if (
                    df.depends_on &&
                    !evaluateDependsOn(
                        df,
                        df.depends_on,
                        /*selected_value,*/ formikValues
                    )
                ) {
                    df['style'] = { display: 'none' };
                    return false;
                    //instead of returning false, proceed but set display to none since react does not support keep-alive
                    //return false
                }
                if (df.mandatory_depends_on) {
                    let res = evaluateDependsOn(
                        df,
                        df.mandatory_depends_on,
                        /*selected_value,*/ formikValues
                    );
                    df.reqd = res;
                }

                // evaluate dependencies of link fields where a link field may depend on values of other fields
                // if(df.field_filters_plain) {
                //   let filterParts = JSON.parse(df.field_filters_plain);
                //   for
                // }
            }
            return !NON_FORM_FIELDS.includes(df.fieldtype);
        });
        setFormFields(flds);
    };

    const renderField = (fieldConfig: DocField, formik: FormikProps<{}>) => {
        /**
         * Evaluate depends_on conditions
         */
        const _triggerDependsOnEvaluation = () => {
            console.log('Triggering depends_on evaluation');
            getFormFields(formik.values); //trigger this so that evaluation of depends_on happens as form_fields state will change
        };

        /**
         * Change form field value
         * @param field_name
         * @param new_field_val
         */
        const setFieldValue = (field: DocField, newVal: any) => {
            formik.values[field.fieldname] = newVal;
            setSubmissionValue(
                field.fieldname,
                newVal,
                isChild,
                docname,
                parentField
            );
            // get_form_fields(formik_props.values); //trigger this so that evaluation of depends_on happens as form_fields state will change
        };

        switch (fieldConfig.fieldtype) {
            case 'Data':
            case 'Phone':
            case 'Text':
            case 'Text Editor':
            case 'Small Text':
            case 'Int':
            case 'Float':
            case 'Currency':
                const fieldType = fieldConfig.fieldtype;
                const numLines = 3;
                // fieldType == 'Small Text' ? 3 : fieldType == 'Text' ? 5 : 1;
                return (
                    <TextInput
                        key={fieldConfig.name}
                        // name={fieldConfig.fieldname}
                        label={fieldConfig.label}
                        placeholder={fieldConfig.label}
                        onChangeText={(val: any) => {
                            formik.handleChange(fieldConfig.fieldname);
                            setFieldValue(fieldConfig, val);
                            console.log(
                                'Updated values:  ',
                                formik.values,
                                val
                            );
                        }}
                        onBlur={_triggerDependsOnEvaluation}
                        // value={formik.values?.[fieldConfig.fieldname]}
                        keyboardType={getKeyboardType(
                            fieldConfig.fieldtype,
                            fieldConfig.options
                        )}
                        multiline={
                            fieldType == 'Small Text' ||
                            fieldType == 'Text' ||
                            fieldType == 'Text Editor'
                        }
                        // numberOfLines={numLines}
                        error={formik.errors[fieldConfig.fieldname]}
                        readOnly={fieldConfig.read_only}
                        required={fieldConfig.reqd}
                    />
                );
                break;

            case 'Check':
                return (
                    <CheckBox
                        key={fieldConfig.name}
                        label={fieldConfig.label}
                        onValueChange={(val: any) => {
                            formik.handleChange(fieldConfig.fieldname);
                            setFieldValue(fieldConfig, val);
                        }}
                    />
                );
            case 'Date':
                return (
                    <DateInput
                        key={fieldConfig.name}
                        label={fieldConfig.label}
                        value={null}
                        onChange={(evt: DateTimePickerEvent, date?: Date) => {
                            formik.handleChange(fieldConfig.fieldname);
                            setFieldValue(fieldConfig, date);
                        }}
                        // onValueChange={(val: any) => {
                        //     formik.handleChange(fieldConfig.fieldname);
                        //     setFieldValue(fieldConfig, val);
                        // }}
                    />
                );

            case 'Select':
                return (
                    <Select
                        key={fieldConfig.name}
                        options={splitOptions(fieldConfig.options)}
                        onChange={(item: SelectOption) => {
                            formik.handleChange(fieldConfig.fieldname);
                            setFieldValue(fieldConfig, item.value);
                        }}
                        label={fieldConfig.label}
                        value={formik.values?.[fieldConfig.fieldname]}
                    />
                );

            case 'Table':
                return (
                    <ChildTable
                        key={fieldConfig.name}
                        doctype={fieldConfig.options}
                        parent={docname}
                        parentType={doctype}
                        parentField={fieldConfig.fieldname}
                        field={fieldConfig}
                        onChange={(rows) => {
                            console.log('Data changed: ', rows);
                        }}
                    />
                );
        }
    };

    useEffect(
        () => {
            console.log('Form initial values: ', formConfig.initialValues);
            getFormFields(formConfig.initialValues);
        },
        [
            /*formConfig.initialValues*/
        ]
    );

    useEffect(() => {
        if (!docname) {
            // If the docname is not set, generate a random id to enable real-time updates
            docname = generateRandomString();
        }
        if (!doc) {
            doc = {
                name: docname,
                doctype: doctype,
            };
        }
    }, [docname]);

    // useEffect(() => {
    //     // const draftSubmission = useGetDraftSubmissionByEngagement(engagement);
    //     console.log('Draft submission: ', draftSubmission);
    //     if (draftSubmission) {
    //         setSubmission({ ...draftSubmission });
    //     } else {
    //         // initializeStructuredSubmission(engagement, doctype);
    //         setSubmission({
    //             engagement,
    //             engagement_form: doctype,
    //             engagement_type: ENGAGEMENT_TYPE.Structured,
    //             data: 'Sample first name',
    //         });
    //     }
    // }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Formik
                innerRef={formikRef}
                initialValues={formConfig.initialValues}
                onSubmit={(values) => {
                    console.log('Submitted values: ', values);
                    // Set the values to the submission object
                    setSubmissionValue('doctype', doctype);
                    setSubmissionValue('docname', docname);
                    onSubmit?.(submission);
                    router.replace({
                        pathname: '/(index)/engagement/list',
                    });
                }}
                validationSchema={formConfig.validationSchema}
            >
                {/* {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    isValid,
                }) => (
                    <View>
                        <TextInput
                            label="Email Address"
                            placeholder="Email"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            keyboardType="email-address"
                        />
                        {errors.email && (
                            <Text style={{ fontSize: 11, color: 'red' }}>
                                {errors.email}
                            </Text>
                        )}
                        <Button onPress={handleSubmit}>Do Submit</Button>
                    </View>
                )} */}
                {(formikProps) => {
                    return (
                        <View>
                            {DOCTYPE?.istable === false && (
                                <View
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: 10,
                                        flexDirection: 'row',
                                        borderBottomWidth: 1,
                                        borderBottomColor: zincColors[300],
                                        marginBottom: 10,
                                        paddingBottom: 3,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Ionicons
                                            name="at-circle"
                                            size={5}
                                            style={{ marginLeft: 1 }}
                                        />
                                        <ThemedText
                                            type="default"
                                            style={{
                                                paddingHorizontal: 5,
                                                color: appleRed,
                                                backgroundColor:
                                                    zincColors['200'],
                                                borderRadius: 10,
                                            }}
                                        >
                                            {t('GLOBAL.NOT_SAVED')}
                                        </ThemedText>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onPress={() =>
                                                alert('Saving draft...')
                                            }
                                        >
                                            {t('BUTTON.SAVE_DRAFT')}
                                        </Button>
                                        <Button
                                            variant="filled"
                                            size="sm"
                                            onPress={() => {
                                                console.log('Validating...');
                                                formikProps
                                                    .validateForm()
                                                    .then((res) => {
                                                        console.log(
                                                            'Validation results: ',
                                                            res
                                                        );
                                                    });
                                                formikProps.handleSubmit();
                                            }}
                                        >
                                            {t('BUTTON.SUBMIT')}
                                        </Button>
                                    </View>
                                </View>
                            )}
                            {DOCTYPE?.istable === true && (
                                <View style={styles.headerContainer}>
                                    <ThemedText
                                        type="defaultSemiBold"
                                        style={styles.headerTitle}
                                    >
                                        {t('CHILD_TABLE.EDITING_ROW', {
                                            rowNumber: childRowIndex || 1,
                                        })}
                                    </ThemedText>
                                    <View style={styles.actionsContainer}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                console.log('Validating...');
                                                formikProps
                                                    .validateForm()
                                                    .then((res) => {
                                                        if (
                                                            Object.keys(res)
                                                                .length > 0
                                                        ) {
                                                            console.log(
                                                                'Validation results: ',
                                                                res
                                                            );
                                                        } else {
                                                            console.log(
                                                                'Updating global submission value'
                                                            );
                                                            // once we validate a child form, set the value of that field in the parent field
                                                            setSubmissionValue(
                                                                parentField,
                                                                formikProps.values,
                                                                true,
                                                                docname
                                                                // parentDocName,
                                                                // parentDoctype,
                                                                // parentField
                                                            );
                                                            console.log(
                                                                'Updated submission: ',
                                                                submission
                                                            );
                                                            router.back();
                                                        }
                                                    });
                                                // formikProps.handleSubmit();
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    gap: 5,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <ThemedText>
                                                    {t('CHILD_TABLE.INSERT')}
                                                </ThemedText>
                                                <Ionicons
                                                    style={styles.icons}
                                                    name="add"
                                                    size={20}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            <BodyScrollView style={{ paddingBottom: 300 }}>
                                {formFields.map((field) => {
                                    return renderField(field, formikProps);
                                })}

                                {/* <FormBuilder
                                    doc={doc}
                                    fields={docfields}
                                    formik={formikProps}
                                    engagement={engagement}
                                /> */}
                            </BodyScrollView>
                        </View>
                    );
                }}
            </Formik>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    headerTitle: {},
    actionsContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    icons: {
        paddingVertical: 2,
    },
});
