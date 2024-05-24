// This is just an example,
// so you can safely delete all default props below

export default {
  failed: 'Action failed',
  success: 'Action was successful',
  username: 'Username',
  password: 'Password',
  login: 'Login',
  APP_NAME: 'Engage',
  GLOBAL: {
    GITHUB_NOTE: 'Development',
    FACEBOOK_NOTE: 'Join our Facebook Group!',
    WARNING: 'Warning',
    BETA_WARNING:
      "This website is under active development and everything is subject to change. We can't guarantee for the safety and privacy of the data you enter (but we try our best).",
    CONNECTION_INTERRUPTED: 'Error: connection interrupted!',
    SERVER_ERROR: 'Server error',
    DEFAULT_INFO_MESSAGE_TITLE: 'Info',
    DEFAULT_ERROR_MESSAGE_TITLE: 'Error',
    GENERAL_ERROR: 'Error occurred',
    CONFIRM_DIALOG_TITLE: 'Confirm',
    CONFIRM_RECORD_DELETE_MESSAGE: 'Delete the selected record(s)?',
    DELETE_WAIT_MESSAGE: 'Deleting...',
    SAVING_WAIT_MESSAGE: 'Saving...',
    NEW_DOCTYPE: 'new',
    SAVE_SUCCESS_MESSAGE: 'Record saved successfully',
    SAVE_ERROR_MESSAGE: 'Record was not saved',
    SEARCH_PLACEHOLDER: 'Search here...',
    FILE_SIZE_EXCEEDED_ERROR: 'File size limit exceeded. Please select a file up to ',
    NEW_RECORD_ID: 'New',
    DROPDOWN_PLACEHOLDER: 'Select'
  },
  LOGIN_PAGE: {
    TITLE: 'Welcome back!',
    EMAIL: 'Mail',
    PROFILE_TITLE: 'Profile',
    USERNAME: 'Username',
    PASSWORD: 'Password',
    WHERE_FROM: 'Where you are from (not required)',
    FORGOT_PASSWORD: 'Forgot your password?',
    BUTTONS: {
      LOGIN: 'Login',
    },    
    LOGIN_SUCCESS_MESSAGE: 'Logged in',
    LOGIN_FAILURE_TITLE: 'Login failure',
    LOGIN_FAILURE_MESSAGE: 'Invalid username or password', 
  },
  BUTTON: {
    OK: 'Ok',
    CREATE: 'Create',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
    EDIT: 'Edit',
    JOIN: 'Join',
    LEAVE: 'Leave',
    PREVIEW: 'Preview',
    BACK: 'Back',
    MORE_OPTIONS: 'More options',
    SEARCH: 'Search',
    OF_COURSE: 'Yes, of course!',
    YES: 'Yes',
    SAVE_CHANGES: 'Save changes',
    RESET: 'Reset',
    CHANGE_PASSWORD: 'Change password',
    CHANGE_EMAIL: 'Change e-mail address',
    AGREE: 'I agree',
    REMOVE: 'Remove',
    ARCHIVE: 'Archive',
    DOWNLOAD_PNG: 'Download PNG',
    CONTINUE: 'Continue', 
    FINISH: 'Finish',
    SEE_DETAILS: 'See Details',
    ADD: 'Add',
    NEW: 'New',
    SAVE: 'Save',
    SUBMIT: 'Submit',
    ADD_ROW: 'Add row',
    UPLOAD: 'Upload'
  },
  VALIDATION: {
    MINLENGTH: 'Please enter more than {min} characters.',
    MAXLENGTH: 'Too long, please use less than {max} characters.',
    UNIQUE: 'Name already exists, please choose another.',
    REQUIRED: 'This field is required.',
    VALID_EMAIL: 'Enter a valid email address.',
    VALID_TIMEZONE: 'Enter a valid timezone.',
    VALIDATION_ERRORS: 'Form contains errors',
    MANDATORY_FIELD_ERRORS: 'Mandatory fields missing', 
  },
  MAIN_LAYOUT: {
    HEADER: {
      VIEW_ALL: 'View All',
      MY_PROFILE: 'My Profile',
      TOGGLE_THEME: 'Toggle Theme',
      LOGOUT: 'Logout',
      ABOUT: 'About',
      HELP: 'Help',
    },
    NAVIGATOR: {
      TITLE: 'Main Menu',
      DASHBOARD: 'Dashboards',
      ENGAGEMENTS: 'Engage',
      DIAGNOSTICS_TITLE: 'Diagnostics',
      REPORTS_TITLE: 'Reports',
      REPORTS_ITEMS: {
        USERS: 'Users',
        ENGAGEMENTS: 'Engagements'
      },
      REFERENCE_RESOURCES_TITLE:  'References & Downloads',
      ACTION_PLANS_TITLE: 'Action Plans',
      ACTION_PLANS_ITEMS: {
        UPDATE_ACTION_TASK: 'Update Action Task',
        VIEW_ACTION_TASK: 'View Action Tasks',
      },
      AI_TOOLS: 'AI Models',
      GRM_TITLE: 'Grievances / Feedback',
      GRM_ITEMS: {
        NEW_COMPLAINT: 'New Complaint/Feedback'
      },
      USER_PROFILE: 'User Profile',        
    },
  },
  USER_PROFILE_PAGE: {
    TITLES: {
      PAGE: 'Edit profile',
      USER_DETAILS: 'Complete your profile',
      CHANGE_PASSWORD: 'Change Password',
    },
    LABELS: {
      ADD_PHOTO: 'Add Photo',
      FIRST_NAME: 'First Name',
      MIDDLE_NAME: 'Middle Name',
      LAST_NAME: 'Last Name',
      CURRENT_PASSWORD: 'Current Password',
      NEW_PASSWORD: 'New Password',
      CONFIRM_NEW_PASSWORD: 'Confirm New Password',
    },
    BUTTONS: {
      UPDATE_USER_INFO: 'Update User Info',
      CHANGE_PASSWORD: 'Change Password',
    },
    MESSAGES: {
      PASSWORD_INCORRECT: 'The current password specified is incorrect',
      PASSWORD_MISMATCH: 'Passwords do not match'
    }
  },
  DASHBOARD_PAGE: {
    TITLE: 'Dashboard'
  },
  AI_PAGE: {
    TITLE: 'AI Modeling'
  },
  HELP_RESOURCE_LIST_PAGE: {
    TITLE: 'Help Resources'
  },
  HELP_RESOURCE_DETAIL_PAGE : {
    ATTACHED_FILE: 'Attached File',
    PUBLICATION_DATE: 'Publication Date',
    RELEVANT_COUNTY: 'Relevant County',
    RELEVANT_SECTOR: 'Relevant Sector',
  },
  DOC_LIST_VIEW_PAGE: {
    TITLE: 'List',
    SEARCH: 'Search',    
    ID_COLUMN_HEADER: 'ID'
  },
  FORM_VIEW_PAGE: {
    DETAILS_TAB_TITLE: 'Basic Details',  
  },
  REPORT_VIEW_PAGE: {
    TITLE: 'Report',
    BUTTON: {
      ACTIONS: 'Actions',
      EXPORT: 'Export',
      PRINT: 'Print'
    }
  },
  ENGAGEMENT_LIST_PAGE: {
    TITLE: 'Active Engagements',
    FINALIZED_SUBMISSIONS: 'Submissions',
    DRAFT_SUBMISSIONS: 'Drafts',
    BUTTON: {
      EXPLORE: 'Explore'
    }
  },
  CHILD_TABLE: {
    NO_DATA: 'No data', 
    EDITING_ROW: 'Editing Row',
    INSERT: 'Insert'
  },
  MAP_PAGE: {
    TITLE: 'Diagnostics',
    SET_OPTIONS: 'Set Options',
    OVERLAYS: 'Overlays',
    SEARCH_REGION: 'Search region',
    OPTIONS: 'Options',
    MESSAGES: {
      NO_SELECTED_ADMIN: 'Please select a region',
      SLM_ENABLED: 'SLM querying enabled. Click any point on the map to query interventions',
      SLM_DISABLED: 'SLM querying disabled',
    }
    // TEMPERATURE: 'Temperature',
    // RAINFALL: 'Rainfall',
    // PRECIPITATION: 'Precipitation'
  },
  BASE_CONTROLS: {
    ATTACH_FILE: 'Attach',
    INVALID_IMAGE_FILE: 'Invalid image file',
    INVALID_FILE_TYPE: 'Invalid file type',
    MAX_FILE_SIZE_EXCEEDED: 'File selected is too big. File size must be less than '
  },
  FILE_UPLOADER: {
    UPLOAD_SINGLE_FILE: 'Upload file',
    UPLOAD_MULTIPLE_FILES: 'Upload {0} files'
  },
  MEDIA_HANDLER: {
    NO_CAMERA_PERMISSIONS: 'We need your permission to show the camera',
    REQUEST_CAMERA_PERMISSION: 'Grant permission',
    FLIP_CAMERA: 'Flip Camera',
    RECORD_AUDIO: 'Record audio',
    SELECT_IMAGE_VIDEO: 'Select photo/video',
    SELECT_DOCUMENT: 'Select document',
    LAUNCH_CAMERA: 'Launch camera',
    UPLOAD_MEDIA: 'Upload',
    DIALOG_TITLE: 'Select media'
  }
};
  