type LoginResult = {
    loggedIn: boolean;
    user?: object;
    error?: string;
}

export interface DocPerm {
    amend: boolean
		cancel: boolean
		create: boolean
		delete: boolean
		email: boolean
		export: boolean
		if_owner: boolean
		parent: string;
		parentfield: string
		parenttype: string
		permlevel: Number;
		print: boolean
		read: boolean
		report: boolean
		role: string
		select: boolean
		share: boolean
		submit: boolean
		write: boolean
}

export interface DocField {   
    allow_bulk_edit: boolean
		allow_in_quick_entry: boolean
		allow_on_submit: boolean
		bold: boolean
		collapsible: boolean
		collapsible_depends_on?: string;
		columns: Number
		default?: string;
		depends_on?: string;
		description?: string;
		documentation_url?: string;
		fetch_from?: string;
		fetch_if_empty: boolean
		fieldname?: string;
		fieldtype:  "Autocomplete"| 
        "Attach"| 
        "Attach Image"| 
        "Barcode"| 
        "Button"| 
        "Check"| 
        "Code"| 
        "Color"| 
        "Column Break"| 
        "Currency"| 
        "Data"| 
        "Date"| 
        "Datetime"| 
        "Duration"| 
        "Dynamic Link"| 
        "Float"| 
        "Fold"| 
        "Geolocation"| 
        "Heading"| 
        "HTML"| 
        "HTML Editor"| 
        "Icon"| 
        "Image"| 
        "Int"| 
        "JSON"| 
        "Link"| 
        "Long Text"| 
        "Markdown Editor"| 
        "Password"| 
        "Percent"| 
        "Phone"| 
        "Read Only"| 
        "Rating"| 
        "Section Break"| 
        "Select"| 
        "Signature"| 
        "Small Text"| 
        "Tab Break"| 
        "Table"| 
        "Table MultiSelect"| 
        "Text"| 
        "Text Editor"| 
        "Time";
		hidden: boolean
		hide_border: boolean
		hide_days: boolean
		hide_seconds: boolean
		ignore_user_permissions: boolean
		ignore_xss_filter: boolean
		in_filter: boolean
		in_global_search: boolean
		in_list_view: boolean
		in_preview: boolean
		in_standard_filter: boolean
		is_virtual: boolean
		label?: string;
		length: Number
		link_filters?: string;
		make_attachment_public: boolean
		mandatory_depends_on?: string;
		max_height?: string;
		no_copy: boolean
		non_negative: boolean
		oldfieldname?: string;
		oldfieldtype?: string;
		options?: string;
		parent: string
		parentfield: string
		parenttype: string
		permlevel: Number
		placeholder?: string;
		    precision: "" | "0" |  "1" |  "2" |  "3"| "4"| "5"| "6"| "7"| "8"| "9";
		print_hide: boolean
		print_hide_if_no_value: boolean
		print_width?: string;
		read_only: boolean
		read_only_depends_on?: string;
		remember_last_selected_value: boolean
		report_hide: boolean
		reqd: boolean
		search_index: boolean
		set_only_once: boolean
		show_dashboard: boolean
		show_on_timeline: boolean
		sort_options: boolean
		translatable: boolean
		unique: boolean
		width?: string;
}

export interface DocType {
    actions: any[]
		allow_auto_repeat: boolean
		allow_copy: boolean
		allow_events_in_timeline: boolean
		allow_guest_to_view: boolean
		allow_import: boolean
		allow_rename: boolean
		autoname?: string;
		beta: boolean
		color?: string;
		custom: boolean
		default_email_template?: string;
		default_print_format?: string;
		default_view?: string;
		description?: string;
		document_type?: "Document" | "Setup" |  "System" | "Other"
		documentation?: string;
		editable_grid: boolean
		email_append_to: boolean
		engine: "InnoDB" |"MyISAM"
		fields: DocField[]
		force_re_route_to_default_view: boolean
		has_web_view: boolean
		hide_toolbar: boolean
		icon?: string;
		image_field?: string;
		in_create: boolean
		index_web_pages_for_search: boolean
		is_calendar_and_gantt: boolean
		is_published_field?: string;
		is_submittable: boolean
		is_tree: boolean
		is_virtual: boolean
		issingle: boolean
		istable: boolean
		link_filters?: string,
		links: any[]
		make_attachments_public: boolean
		max_attachments: Number
		migration_hash?: string;
		module: string
		naming_rule?:  
			"Set by user"|
			"Autoincrement"|
			"By fieldname"|
			'By "Naming Series" field'|
			"Expression"|
			"Expression (old style)"|
			"Random"|
			"By script";
		nsm_parent_field?: string;
		permissions: DocPerm[]
		queue_in_background: boolean
		quick_entry: boolean
		read_only: boolean
		restrict_to_domain?: string;
		route?: string;
		search_fields?: string;
		sender_field?: string;
		sender_name_field?: string;
		show_name_in_global_search: boolean
		show_preview_popup: boolean
		show_title_field_in_link: boolean
		sort_field?: string;
		sort_order:  "ASC" | "DESC"
		states: any[]
		subject_field?: string;
		timeline_field?: string;
		title_field?: string;
		track_changes: boolean
		track_seen: boolean
		track_views: boolean
		translated_doctype: boolean
		website_search_field?: string;
}