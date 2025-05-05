import * as UiReact from 'tinybase/ui-react/with-schemas';
import {
    createMergeableStore,
    createRelationships,
    NoValuesSchema,
    OptionalSchemas,
} from 'tinybase/with-schemas';
import { useCreateClientPersisterAndStart } from './persistence/useCreateClientPersisterAndStart';
import { useCreateServerSynchronizerAndStart } from './synchronization/useCreateServerSynchronizerAndStart';
import { useCallback, useEffect } from 'react';
import { randomUUID } from 'expo-crypto';
import { useUser } from '@/hooks/useUser';
import { useFrappe } from '@/provider/frappe';
import { transformObjectorArray } from '@/utils/common';
import { DocField, DocType } from '@/module/engage/types';
import { arraySort } from '@/utils/array';
import { castBooleanFields } from './data.util';

const storeId = 'DocTypeStore';

const VALUES_SCHEMA = {
    name: { type: 'string' },
    description: { type: 'string' },
} as const;

const BOOLEAN_FIELDS = {
    doctype: [
        'allow_auto_repeat',
        'allow_copy',
        'allow_events_in_timeline',
        'allow_guest_to_view',
        'allow_import',
        'allow_rename',
        //'autoname?: string
        'beta',
        //color?: string
        'custom',
        //default_email_template: { type: 'string' },
        //default_print_format?: string
        //document_type:{ type: 'string' },
        //documentation?: string
        'editable_grid',
        'email_append_to',
        //engine: { type: 'string' },
        //fields: DocField[];
        'force_re_route_to_default_view',
        //'grid_page_length: number
        'has_web_view',
        'hide_toolbar',
        //'icon?: string
        //image_field?: string
        'in_create',
        'index_web_pages_for_search',
        'is_calendar_and_gantt',
        //is_published_field?: string
        'is_submittable',
        'is_tree',
        'is_virtual',
        'issingle',
        'istable',
        //link_filters: { type: 'string' },
        //links: DF.Table[DocTypeLink]
        'make_attachments_public',
        //max_attachments: { type: 'number' },
        //migration_hash?: string
        //nsm_parent_field?: string
        //permissions: DF.Table[DocPerm]
        'queue_in_background',
        'quick_entry',
        'read_only',
        //restrict_to_domain: string
        //route?: string
        //sender_field?: string
        //sender_name_field?: string
        'show_name_in_global_search',
        'show_preview_popup',
        'show_title_field_in_link',
        // sort_field: { type: 'string' },
        // sort_order: { type: 'string' },
        // timeline_field?: string
        // title_field: { type: 'string' },
        'track_changes',
        'track_seen',
        'track_views',
        'translated_doctype',
        // website_search_field?: string
    ],
    docfield: [
        //idx: { type: 'number' },
        //'name: { type: 'string' },
        'allow_bulk_edit',
        'allow_in_quick_entry',
        'allow_on_submit',
        'bold',
        'collapsible',
        //'collapsible_depends_on: { type: 'string' },
        //'columns: { type: 'number' },
        //'default: { type: 'string' },
        //'depends_on: { type: 'string' },
        //'description: { type: 'string' },
        //'documentation_url: { type: 'string' },
        //'fetch_from: { type: 'string' },
        'fetch_if_empty',
        //'fieldname: { type: 'string' },
        //'fieldtype: { type: 'string' },
        'hidden',
        'hide_border',
        'hide_days',
        'hide_seconds',
        'ignore_user_permissions',
        'ignore_xss_filter',
        'in_filter',
        'in_global_search',
        'in_list_view',
        'in_preview',
        'in_standard_filter',
        'is_virtual',
        //'label: { type: 'string' },
        //'length: { type: 'number' },
        //'link_filters: { type: 'string' },
        'make_attachment_public',
        //'mandatory_depends_on: { type: 'string' },
        //'max_height: { type: 'string' },
        'no_copy',
        'non_negative',
        //'oldfieldname: { type: 'string' },
        //'oldfieldtype: { type: 'string' },
        //'options: { type: 'string' },
        //'parent: { type: 'string' },
        //'parentfield: { type: 'string' },
        //'parenttype: { type: 'string' },
        //'permlevel: { type: 'number' },
        //'placeholder: { type: 'string' },
        //'precision: { type: 'string' },
        'print_hide',
        'print_hide_if_no_value',
        //'print_width: { type: 'string' },
        'read_only',
        //'read_only_depends_on: { type: 'string' },
        'remember_last_selected_value',
        'report_hide',
        'reqd',
        'search_index',
        'set_only_once',
        'show_dashboard',
        'show_on_timeline',
        'sort_options',
        'translatable',
        'unique',
        //'width: { type: 'string' },
    ],
};

const TABLES_SCHEMA = {
    doctype: {
        name: { type: 'string' },
        // actions: DF.Table[DocTypeAction]
        // allow_auto_repeat: { type: 'boolean' },
        // allow_copy: { type: 'boolean' },
        // allow_events_in_timeline: { type: 'boolean' },
        // allow_guest_to_view: { type: 'boolean' },
        // allow_import: { type: 'boolean' },
        // allow_rename: { type: 'boolean' },
        // autoname?: string
        // beta: { type: 'boolean' },
        // color?: string
        // custom: { type: 'boolean' },
        // default_email_template: { type: 'string' },
        // default_print_format?: string
        // default_view: { type: 'string' },
        description: { type: 'string' },
        // document_type:{ type: 'string' },
        // documentation?: string
        editable_grid: { type: 'boolean' },
        // email_append_to: { type: 'boolean' },
        // engine: { type: 'string' },
        // fields: DocField[];
        // force_re_route_to_default_view: { type: 'boolean' },
        // grid_page_length: number
        // has_web_view: { type: 'boolean' },
        // hide_toolbar: { type: 'boolean' },
        // icon?: string
        // image_field?: string
        // in_create: { type: 'boolean' },
        // index_web_pages_for_search: { type: 'boolean' },
        // is_calendar_and_gantt: { type: 'boolean' },
        // is_published_field?: string
        is_submittable: { type: 'boolean' },
        is_tree: { type: 'boolean' },
        // is_virtual: { type: 'boolean' },
        issingle: { type: 'boolean' },
        istable: { type: 'boolean' },
        link_filters: { type: 'string' },
        // links: DF.Table[DocTypeLink]
        // make_attachments_public: { type: 'boolean' },
        max_attachments: { type: 'number' },
        // migration_hash?: string
        module: { type: 'string' },
        naming_rule: { type: 'string' },
        // nsm_parent_field?: string
        // permissions: DF.Table[DocPerm]
        // queue_in_background: { type: 'boolean' },
        // quick_entry: { type: 'boolean' },
        read_only: { type: 'boolean' },
        // restrict_to_domain: string
        // route?: string
        // row_format: DF.Literal["Dynamic"| "Compressed"]
        // search_fields?: string
        // sender_field?: string
        // sender_name_field?: string
        // show_name_in_global_search: { type: 'boolean' },
        // show_preview_popup: { type: 'boolean' },
        show_title_field_in_link: { type: 'boolean' },
        sort_field: { type: 'string' },
        sort_order: { type: 'string' },
        //states: DF.Table[DocTypeState]
        // subject_field?: string
        // timeline_field?: string
        title_field: { type: 'string' },
        // track_changes: { type: 'boolean' },
        // track_seen: { type: 'boolean' },
        // track_views: { type: 'boolean' },
        // translated_doctype: { type: 'boolean' },
        // website_search_field?: string
    },
    docfield: {
        idx: { type: 'number' },
        name: { type: 'string' },
        allow_bulk_edit: { type: 'boolean' },
        allow_in_quick_entry: { type: 'boolean' },
        allow_on_submit: { type: 'boolean' },
        bold: { type: 'boolean' },
        collapsible: { type: 'boolean' },
        collapsible_depends_on: { type: 'string' },
        columns: { type: 'number' },
        default: { type: 'string' },
        depends_on: { type: 'string' },
        description: { type: 'string' },
        documentation_url: { type: 'string' },
        fetch_from: { type: 'string' },
        fetch_if_empty: { type: 'boolean' },
        fieldname: { type: 'string' },
        fieldtype: { type: 'string' },
        hidden: { type: 'boolean' },
        hide_border: { type: 'boolean' },
        hide_days: { type: 'boolean' },
        hide_seconds: { type: 'boolean' },
        ignore_user_permissions: { type: 'boolean' },
        ignore_xss_filter: { type: 'boolean' },
        in_filter: { type: 'boolean' },
        in_global_search: { type: 'boolean' },
        in_list_view: { type: 'boolean' },
        in_preview: { type: 'boolean' },
        in_standard_filter: { type: 'boolean' },
        is_virtual: { type: 'boolean' },
        label: { type: 'string' },
        length: { type: 'number' },
        link_filters: { type: 'string' },
        make_attachment_public: { type: 'boolean' },
        mandatory_depends_on: { type: 'string' },
        max_height: { type: 'string' },
        no_copy: { type: 'boolean' },
        non_negative: { type: 'boolean' },
        oldfieldname: { type: 'string' },
        oldfieldtype: { type: 'string' },
        options: { type: 'string' },
        parent: { type: 'string' },
        parentfield: { type: 'string' },
        parenttype: { type: 'string' },
        permlevel: { type: 'number' },
        placeholder: { type: 'string' },
        precision: { type: 'string' },
        print_hide: { type: 'boolean' },
        print_hide_if_no_value: { type: 'boolean' },
        print_width: { type: 'string' },
        read_only: { type: 'boolean' },
        read_only_depends_on: { type: 'string' },
        remember_last_selected_value: { type: 'boolean' },
        report_hide: { type: 'boolean' },
        reqd: { type: 'boolean' },
        search_index: { type: 'boolean' },
        set_only_once: { type: 'boolean' },
        show_dashboard: { type: 'boolean' },
        show_on_timeline: { type: 'boolean' },
        sort_options: { type: 'boolean' },
        translatable: { type: 'boolean' },
        unique: { type: 'boolean' },
        width: { type: 'string' },
        isDraft: { type: 'boolean' },
        createdBy: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
    },
} as const;

type Schemas = [typeof TABLES_SCHEMA, NoValuesSchema];

type SubmissionCellId = keyof (typeof TABLES_SCHEMA)['doctype'];

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
    useRow,
} = UiReact as UiReact.WithSchemas<Schemas>;

const useStoreId = () => storeId;

export const useGetDocType = (name: string) => {
    const store = useStore(useStoreId());
    const form = useRow('doctype', name, useStoreId());
    const res = transformObjectorArray(form, {}) as DocType;
    return res;
};

export const useGetDocFields = (doctype: string) => {
    const res = useTable('docfield', useStoreId());
    const fields = Object.values(res).filter(
        (el) => el.parent === doctype && el.parenttype === 'DocType'
    );
    arraySort(fields, 'idx', 'asc');
    return transformObjectorArray(fields, {}) as DocField[];
};

// Create, persist, and sync a store containing the doctypes
export const DocTypeStore = () => {
    const storeId = useStoreId();
    const { call } = useFrappe();

    const loadDocTypes = useCallback(() => {
        call.post('participatory_backend.api.get_list', {
            fields: '*',
            orderBy: { field: 'creation', order: 'desc' },
            doctype: 'DocType',
        })
            .then((res) => {
                res?.message?.map((el) => {
                    const id = el.name;
                    store.setRow('doctype', id, el);
                });
            })
            .catch((error) => console.error(error));
    }, [call]);

    const loadDocFields = useCallback(() => {
        call.post('participatory_backend.api.get_list', {
            fields: '*',
            orderBy: { field: 'creation', order: 'desc' },
            doctype: 'DocField',
        })
            .then((res) => {
                res?.message?.map((el) => {
                    const id = el.name;
                    store.setRow('docfield', id, el);
                });
            })
            .catch((error) => console.error(error));
    }, [call]);

    useEffect(() => {
        if (call !== null) {
            loadDocTypes();
            loadDocFields();
        }
    }, [call]);

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
    const relationships = useCreateRelationships(store, (store) => {
        return createRelationships(store).setRelationshipDefinition(
            'formFields',
            'docfield',
            'doctype',
            'parent'
        );
    });
    useProvideRelationships(storeId, relationships);

    return null;
};
