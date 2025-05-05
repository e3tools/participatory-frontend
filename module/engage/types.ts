export type DocFieldType =
    | 'Autocomplete'
    | 'Attach'
    | 'Attach Image'
    | 'Barcode'
    | 'Button'
    | 'Check'
    | 'Code'
    | 'Color'
    | 'Column Break'
    | 'Currency'
    | 'Data'
    | 'Date'
    | 'Datetime'
    | 'Duration'
    | 'Dynamic Link'
    | 'Float'
    | 'Fold'
    | 'Geolocation'
    | 'Heading'
    | 'HTML'
    | 'HTML Editor'
    | 'Icon'
    | 'Image'
    | 'Int'
    | 'JSON'
    | 'Link'
    | 'Long Text'
    | 'Markdown Editor'
    | 'Password'
    | 'Percent'
    | 'Phone'
    | 'Read Only'
    | 'Rating'
    | 'Section Break'
    | 'Select'
    | 'Signature'
    | 'Small Text'
    | 'Tab Break'
    | 'Table'
    | 'Table MultiSelect'
    | 'Text'
    | 'Text Editor'
    | 'Time';

export type DocField = {
    name: string;
    allow_bulk_edit: boolean;
    allow_in_quick_entry: boolean;
    allow_on_submit: boolean;
    bold: boolean;
    collapsible: boolean;
    collapsible_depends_on: string;
    columns: number;
    default: string;
    depends_on: string;
    description: string;
    documentation_url: string;
    fetch_from: string;
    fetch_if_empty: boolean;
    fieldname: string;
    fieldtype: DocFieldType;
    hidden: boolean;
    hide_border: boolean;
    hide_days: boolean;
    hide_seconds: boolean;
    ignore_user_permissions: boolean;
    ignore_xss_filter: boolean;
    in_filter: boolean;
    in_global_search: boolean;
    in_list_view: boolean;
    in_preview: boolean;
    in_standard_filter: boolean;
    is_virtual: boolean;
    label: string;
    length: number;
    link_filters: string;
    make_attachment_public: boolean;
    mandatory_depends_on: string;
    max_height: string;
    no_copy: boolean;
    non_negative: boolean;
    oldfieldname: string;
    oldfieldtype: string;
    options: string;
    parent: string;
    parentfield: string;
    parenttype: string;
    permlevel: number;
    placeholder: string;
    precision: '' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    print_hide: boolean;
    print_hide_if_no_value: boolean;
    print_width: string;
    read_only: boolean;
    read_only_depends_on: string;
    remember_last_selected_value: boolean;
    report_hide: boolean;
    reqd: boolean;
    search_index: boolean;
    set_only_once: boolean;
    show_dashboard: boolean;
    show_on_timeline: boolean;
    sort_options: boolean;
    translatable: boolean;
    unique: boolean;
    width: string;
};

export type DocType = {
    name: string;
    // actions: DF.Table[DocTypeAction]
    // allow_auto_repeat: boolean
    // allow_copy: boolean
    // allow_events_in_timeline: boolean
    // allow_guest_to_view: boolean
    // allow_import: boolean
    // allow_rename: boolean
    // autoname?: string
    // beta: boolean
    // color?: string
    // custom: boolean
    // default_email_template: string | None
    // default_print_format?: string
    // default_view: DF.Literal[None]
    description: string;
    // document_type: "" | "Document" | "Setup" | "System" | "Other"
    // documentation?: string
    editable_grid: boolean;
    // email_append_to: boolean
    // engine: "InnoDB" | "MyISAM"
    fields: DocField[];
    // force_re_route_to_default_view: boolean
    // grid_page_length: number
    // has_web_view: boolean
    // hide_toolbar: boolean
    // icon?: string
    // image_field?: string
    // in_create: boolean
    // index_web_pages_for_search: boolean
    // is_calendar_and_gantt: boolean
    // is_published_field?: string
    is_submittable: boolean;
    is_tree: boolean;
    // is_virtual: boolean
    issingle: boolean;
    istable: boolean;
    link_filters?: string;
    // links: DF.Table[DocTypeLink]
    // make_attachments_public: boolean
    max_attachments: number;
    // migration_hash?: string
    module: string;
    naming_rule:
        | ''
        | 'Set by user'
        | 'Autoincrement'
        | 'By fieldname'
        | 'By "Naming Series" field'
        | 'Expression'
        | 'Expression (old style)'
        | 'Random'
        | 'By script';
    // nsm_parent_field?: string
    // permissions: DF.Table[DocPerm]
    // queue_in_background: boolean
    // quick_entry: boolean
    read_only: boolean;
    // restrict_to_domain: string
    // route?: string
    // row_format: DF.Literal["Dynamic"| "Compressed"]
    // search_fields?: string
    // sender_field?: string
    // sender_name_field?: string
    // show_name_in_global_search: boolean
    // show_preview_popup: boolean
    show_title_field_in_link: boolean;
    sort_field?: string;
    sort_order: 'ASC' | 'DESC';
    //states: DF.Table[DocTypeState]
    // subject_field?: string
    // timeline_field?: string
    title_field?: string;
    // track_changes: boolean
    // track_seen: boolean
    // track_views: boolean
    // translated_doctype: boolean
    // website_search_field?: string
};
