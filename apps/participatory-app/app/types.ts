type FieldType =
  | 'Data'
  | 'Password'
  | 'Text'
  | 'Small Text'
  | 'Long Text'
  | 'Select'
  | 'Link'
  | 'Read Only'
  | 'Currency'
  | 'Int'
  | 'Float'
  | 'Date'
  | 'Check'
  | 'Phone'
  | 'Attach'
  | 'Attach Image'
  | 'Table'
  | 'Table MultiSelect'
  | 'Section Break'
  | 'Geolocation';

export interface EngagementFormField {
  data_field_options: string;
  depends_on: string;
  depends_on_plain: string;
  description: string;
  field_child_doctype: string;
  field_choices: string;
  field_default: string;
  field_doctype: string;
  field_filters: string;
  field_filters_plain: string;
  field_in_list_view: boolean;
  field_is_backend_field: boolean;
  field_is_search_field: boolean;
  field_label: string;
  field_length: number;
  field_precision: number;
  field_readonly: boolean;
  field_reqd: boolean;
  field_type: FieldType;
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
}

export interface EngagementFormPermission {
  parent: string;
  parentfield: string;
  parenttype: string;
  perm_create: boolean;
  perm_delete: boolean;
  perm_export: boolean;
  perm_import: boolean;
  perm_print: boolean;
  perm_read: boolean;
  perm_report: boolean;
  perm_select: boolean;
  perm_write: boolean;
  role: string;
}

export interface EngagementForm {
  anonymous: boolean;
  description: string;
  enable_web_form: boolean;
  field_is_table: boolean;
  form_design_permissions: EngagementFormPermission[];
  form_fields: EngagementFormField[];
  form_group: string;
  form_image: string;
  form_name: string;
  form_permissions: EngagementFormPermission[];
  naming_field: string;
  naming_format: string;
  public_url: string;
  qr_code: string;
  record_id_prefix: string;
  route: string;
  show_data_processing_consent_statement: boolean;
  show_title_field_in_link: boolean;
  success_message: string;
  title_field: string;
  use_field_to_generate_id: boolean;
  web_title: string;
}
