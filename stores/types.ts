export type Engagement = {
    name: string;
    engagement_name: string;
    engagement_form: string;
    engagement_type: string;
    description: string;
    cover_image: string;
    closing_date: string;
    has_data_forms: boolean;
    has_discussion_forum: boolean;
    has_formal_submissions: boolean;
    has_guestbook: boolean;
    has_ideas: boolean;
    has_map: boolean;
    has_qa: boolean;
    include_quick_poll: boolean;
    is_published: boolean;
    question: string;
    quick_poll: string;
    status: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
};

export type EngagementForm = {
    name: string;
    form_name: string;
    description: string;
    anonymous: boolean;
    enable_web_form: boolean;
    field_is_table: boolean;
    // form_design_permissions: DF.Table[EngagementFormPermission]
    // form_fields: DF.Table[EngagementFormField]
    form_group: string;
    form_image: string;
    form_image_base_64: string;
    form_key: string;
    // form_permissions: DF.Table[EngagementFormPermission]
    include_logo_in_web_form: boolean;
    make_attachments_public: boolean;
    naming_field: string;
    naming_format: string;
    public_url: string;
    qr_code: string;
    record_id_prefix: string;
    route: string;
    show_data_processing_consent_statement: boolean;
    show_title_field_in_link: boolean;
    show_watermark_image: boolean;
    success_message: string;
    title_field: string;
    use_field_to_generate_id: boolean;
    web_title: string;
};

export type EngagementFormField = {
    name: string;
    additional_linked_table_fields: string;
    data_field_html: string;
    data_field_options: string; //["", "Email", "Phone", "URL"]
    depends_on: string;
    depends_on_plain: string;
    description: string;
    field_child_doctype: string;
    field_choices: string;
    field_default: string;
    field_doctype: string;
    field_filters: string;
    field_filters_plain: string;
    field_hidden: boolean;
    field_in_list_view: boolean;
    field_is_backend_field: boolean;
    field_is_search_field: boolean;
    field_label: string;
    field_length: { type: 'number' };
    field_linked_field: string;
    field_name: string;
    field_non_negative: boolean;
    field_precision: string; //["", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    field_readonly: boolean;
    field_reqd: boolean;
    field_type: string; //["", "Attach", "Attach Image", "Check", "Column Break", "Currency", "Data", "Date", "Datetime", "HTML", "Int", "Float", "Geolocation", "Link", "Linked Field", "Select", "Select Multiple", "Section Break", "Text", "Text Editor", "Tab Break", "Table", "Table MultiSelect", "Time"]
    formula: string;
    linked_form: string;
    linked_form_property: string;
    mandatory_depends_on: string;
    mandatory_depends_on_plain: string;
    max_height: string;
    parent: string;
    parentfield: string;
    parenttype: string;
    read_only_depends_on: string;
    read_only_depends_on_plain: string;
};

export type Submission = {
    id: string;
    name: string;
    engagement: string;
    engagement_form: string;
    responseJson: string;
    isDraft: boolean;
    createdBy: string;
    createdAt: string;
};

export type FieldLabel = {
    fieldName: string;
    fieldLabel: string;
};

export const ENGAGEMENT_TYPE = {
    Structured: 'Structured',
    Poll: 'Poll',
};
