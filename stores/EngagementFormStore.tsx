import * as UiReact from 'tinybase/ui-react/with-schemas';
import {
    createMergeableStore,
    createRelationships,
    NoValuesSchema,
    OptionalSchemas,
    Relationships,
} from 'tinybase/with-schemas';
import { useCreateClientPersisterAndStart } from './persistence/useCreateClientPersisterAndStart';
import { useCreateServerSynchronizerAndStart } from './synchronization/useCreateServerSynchronizerAndStart';
import { useCallback, useEffect } from 'react';
import { useFrappeAuth } from '@/provider/frappe-auth';
import { useFrappe } from '@/provider/frappe';
import Toast from 'react-native-toast-message';
import {
    useLocalRowIds,
    useRelationships,
    useRemoteRowId,
    useRow,
} from 'tinybase/ui-react';
import { EngagementForm } from './types';
import { transformObjectorArray } from '@/utils/common';
import { DocField } from '@/module/engage/types';
import { arraySort } from '@/utils/array';

const storeId = 'EngagementFormStore';

const TABLES_SCHEMA = {
    engagement_form: {
        idx: { type: 'number' },
        name: { type: 'string' },
        anonymous: { type: 'boolean' },
        description: { type: 'string' },
        enable_web_form: { type: 'boolean' },
        field_is_table: { type: 'boolean' },
        // form_design_permissions: DF.Table[EngagementFormPermission]
        // form_fields: DF.Table[EngagementFormField]
        form_group: { type: 'string' },
        form_image: { type: 'string' },
        form_image_base_64: { type: 'string' },
        form_key: { type: 'string' },
        form_name: { type: 'string' },
        // form_permissions: DF.Table[EngagementFormPermission]
        include_logo_in_web_form: { type: 'boolean' },
        make_attachments_public: { type: 'boolean' },
        naming_field: { type: 'string' },
        naming_format: { type: 'string' },
        public_url: { type: 'string' },
        qr_code: { type: 'string' },
        record_id_prefix: { type: 'string' },
        route: { type: 'string' },
        show_data_processing_consent_statement: { type: 'boolean' },
        show_title_field_in_link: { type: 'boolean' },
        show_watermark_image: { type: 'boolean' },
        success_message: { type: 'string' },
        title_field: { type: 'string' },
        use_field_to_generate_id: { type: 'boolean' },
        web_title: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
    },
    engagement_form_field: {
        idx: { type: 'number' },
        additional_linked_table_fields: { type: 'string' },
        data_field_html: { type: 'string' },
        data_field_options: { type: 'string' }, //["", "Email", "Phone", "URL"]
        depends_on: { type: 'string' },
        depends_on_plain: { type: 'string' },
        description: { type: 'string' },
        field_child_doctype: { type: 'string' },
        field_choices: { type: 'string' },
        field_default: { type: 'string' },
        field_doctype: { type: 'string' },
        field_filters: { type: 'string' },
        field_filters_plain: { type: 'string' },
        field_hidden: { type: 'boolean' },
        field_in_list_view: { type: 'boolean' },
        field_is_backend_field: { type: 'boolean' },
        field_is_search_field: { type: 'boolean' },
        field_label: { type: 'string' },
        field_length: { type: 'number' },
        field_linked_field: { type: 'string' },
        field_name: { type: 'string' },
        field_non_negative: { type: 'boolean' },
        field_precision: { type: 'string' }, // ["", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
        field_readonly: { type: 'boolean' },
        field_reqd: { type: 'boolean' },
        field_type: { type: 'string' }, // ["", "Attach", "Attach Image", "Check", "Column Break", "Currency", "Data", "Date", "Datetime", "HTML", "Int", "Float", "Geolocation", "Link", "Linked Field", "Select", "Select Multiple", "Section Break", "Text", "Text Editor", "Tab Break", "Table", "Table MultiSelect", "Time"]
        formula: { type: 'string' },
        linked_form: { type: 'string' },
        linked_form_property: { type: 'string' },
        mandatory_depends_on: { type: 'string' },
        mandatory_depends_on_plain: { type: 'string' },
        max_height: { type: 'string' },
        parent: { type: 'string' },
        parentfield: { type: 'string' },
        parenttype: { type: 'string' },
        read_only_depends_on: { type: 'string' },
        read_only_depends_on_plain: { type: 'string' },
    },
} as const;

type Schemas = [typeof TABLES_SCHEMA, NoValuesSchema];

type EngagementFormCellId = keyof (typeof TABLES_SCHEMA)['engagement_form'];

const {
    useCell,
    useCreateMergeableStore,
    useDelRowCallback,
    useProvideStore,
    useRowIds,
    useSetCellCallback,
    useSortedRowIds,
    useStore,
    useTable,
    useCreateRelationships,
    useProvideRelationships,
    useSetRowCallback,
} = UiReact as UiReact.WithSchemas<Schemas>;

const useStoreId = () => storeId;

let relationships = null;

export const useGetEngagementForms = () => {
    const res = useTable('engagement_form', useStoreId());
    return Object.values(res);
};

export const useGetEngagementForm = (name: string) => {
    const store = useStore(useStoreId());
    const form = useRow('engagement_form', name, useStoreId());
    // const form = store.getRow('engagement_form', name);
    const res = transformObjectorArray(form, {}) as EngagementForm;
    return res;
};

export const useGetEngagementFormFields = (formId: string) => {
    const res = useTable('engagement_form_field', useStoreId());
    const fields = Object.values(res).filter(
        (el) => el.parent === formId && el.parenttype === 'Engagement Form'
    );
    arraySort(fields, 'idx', 'asc');
    return transformObjectorArray(fields, {}) as DocField[];
};

// Create, persist, and sync a store containing the engagements
export const EngagementFormStore = () => {
    const { accessToken, refreshAccessTokenAsync } = useFrappeAuth();
    const { db, call } = useFrappe();

    const loadEngagementForms = useCallback(() => {
        // load forms
        call.post('participatory_backend.api.get_list', {
            fields: '*',
            orderBy: { field: 'creation', order: 'desc' },
            doctype: 'Engagement Form',
        })
            .then((res) => {
                res?.message?.map((el) => {
                    const id = el.name;
                    store.setRow('engagement_form', id, el);
                });
            })
            .catch((error) => console.error(error));
    }, [call]);

    const loadEngagementFormFields = useCallback(() => {
        // load form fields
        call.post('participatory_backend.api.get_list', {
            fields: '*',
            orderBy: { field: 'creation', order: 'desc' },
            doctype: 'Engagement Form Field',
        })
            .then((res) => {
                res?.message?.map((el) => {
                    const id = el.name;
                    store.setRow('engagement_form_field', id, el);
                });
            })
            .catch((error) => console.error(error));
    }, [call]);

    useEffect(() => {
        if (db !== null) {
            loadEngagementForms();
            loadEngagementFormFields();
        }
    }, [accessToken, db]);

    const storeId = useStoreId();
    // Create a store with the schema
    const store = useCreateMergeableStore(() =>
        createMergeableStore().setTablesSchema(TABLES_SCHEMA)
    );

    // persist store with initial content if it has not been saved before
    useCreateClientPersisterAndStart(storeId, store, '', () => {
        // load data from backend
    });

    // useCreateServerSynchronizerAndStart(storeId, store);// disable synchronization for now
    useProvideStore(storeId, store); // Add store by id to a provider dynamically

    // create relationship between form and form fields
    relationships = useCreateRelationships(store, (store) => {
        return createRelationships(store).setRelationshipDefinition(
            'formFields',
            'engagement_form_field',
            'engagement_form',
            'parent'
        );
    });
    useProvideRelationships(storeId, relationships);

    return null;
};
