// export default {
export type Translation = {
    failed: string;
    success: string;
    username: string;
    password: string;
    login: string;
    APP_NAME: string;
    GLOBAL: {
        GITHUB_NOTE: string;
        FACEBOOK_NOTE: string;
        WARNING: string;
        BETA_WARNING: string;
        CONNECTION_INTERRUPTED: string;
        SERVER_ERROR: string;
        DEFAULT_INFO_MESSAGE_TITLE: string;
        DEFAULT_ERROR_MESSAGE_TITLE: string;
        CONFIRM_DIALOG_TITLE: string;
        CONFIRM_RECORD_DELETE_MESSAGE: string;
        GENERAL_ERROR: string;
        DELETE_WAIT_MESSAGE: string;
        SAVING_WAIT_MESSAGE: string;
        NEW_DOCTYPE: string;
        SAVE_SUCCESS_MESSAGE: string;
        SAVE_ERROR_MESSAGE: string;
        SEARCH_PLACEHOLDER: string;
        FILE_SIZE_EXCEEDED_ERROR: string;
        NEW_RECORD_ID: string;
        DROPDOWN_PLACEHOLDER: string;
        DELETE_NOT_EXIST: string;
        ONLINE_STATUS: string;
        OFFLINE_STATUS: string;
        SYNC_START: string;
        SYNC_IN_PROGRESS: string;
        SYNC_COMPLETED: string;
        NOT_IMPLEMENTED_IN_OFFLINE: string;
        LOADING: string;
        PERMISSION_DENIED: string;
        LOGIN_REQUIRED: string;
        NOT_SAVED: string;
        DRAFT: string;
        MIGRATION_ERROR: string;
    };
    LOGIN_PAGE: {
        TITLE: string;
        EMAIL: string;
        PROFILE_TITLE: string;
        USERNAME: string;
        PASSWORD: string;
        WHERE_FROM: string;
        FORGOT_PASSWORD: string;
        BUTTONS: {
            LOGIN: string;
        };
        LOGIN_SUCCESS_MESSAGE: string;
        LOGIN_FAILURE_TITLE: string;
        LOGIN_FAILURE_MESSAGE: string;
    };
    BUTTON: {
        OK: string;
        CREATE: string;
        CANCEL: string;
        DELETE: string;
        EDIT: string;
        JOIN: string;
        LEAVE: string;
        PREVIEW: string;
        BACK: string;
        MORE_OPTIONS: string;
        SEARCH: string;
        OF_COURSE: string;
        YES: string;
        SAVE_CHANGES: string;
        RESET: string;
        CHANGE_PASSWORD: string;
        CHANGE_EMAIL: string;
        AGREE: string;
        REMOVE: string;
        ARCHIVE: string;
        DOWNLOAD_PNG: string;
        CONTINUE: string;
        FINISH: string;
        SEE_DETAILS: string;
        ADD: string;
        NEW: string;
        SAVE: string;
        SUBMIT: string;
        ADD_ROW: string;
        UPLOAD: string;
        SAVE_DRAFT: string;
    };
    VALIDATION: {
        MINLENGTH: string;
        MAXLENGTH: string;
        UNIQUE: string;
        REQUIRED: string;
        VALID_EMAIL: string;
        VALID_TIMEZONE: string;
        VALIDATION_ERRORS: string;
        MANDATORY_FIELD_ERRORS: string;
    };
    MAIN_LAYOUT: {
        HEADER: {
            VIEW_ALL: string;
            MY_PROFILE: string;
            TOGGLE_THEME: string;
            LOGOUT: string;
            ABOUT: string;
            HELP: string;
        };
        NAVIGATOR: {
            TITLE: string;
            DASHBOARD: string;
            HOME: string;
            ENGAGEMENTS: string;
            DIAGNOSTICS_TITLE: string;
            REPORTS_TITLE: string;
            REPORTS_ITEMS: {
                USERS: string;
                ENGAGEMENTS: string;
            };
            REFERENCE_RESOURCES_TITLE: string;
            ACTION_PLANS_TITLE: string;
            ACTION_PLANS_ITEMS: {
                UPDATE_ACTION_TASK: string;
                VIEW_ACTION_TASK: string;
            };
            AI_TOOLS: string;
            GRM_TITLE: string;
            GRM_ITEMS: {
                NEW_COMPLAINT: string;
            };
            USER_PROFILE: string;
            MY_SUBMISSIONS_TITLE: string;
            SETTINGS_TITLE: string;
        };
    };
    USER_PROFILE_PAGE: {
        TITLES: {
            PAGE: string;
            USER_DETAILS: string;
            CHANGE_PASSWORD: string;
        };
        LABELS: {
            ADD_PHOTO: string;
            FIRST_NAME: string;
            MIDDLE_NAME: string;
            LAST_NAME: string;
            CURRENT_PASSWORD: string;
            NEW_PASSWORD: string;
            CONFIRM_NEW_PASSWORD: string;
        };
        BUTTONS: {
            UPDATE_USER_INFO: string;
            CHANGE_PASSWORD: string;
        };
        MESSAGES: {
            PASSWORD_INCORRECT: string;
            PASSWORD_MISMATCH: string;
        };
    };
    DASHBOARD_PAGE: {
        TITLE: string;
    };
    AI_PAGE: {
        TITLE: string;
    };
    HOME_PAGE: {};
    SETTINGS_PAGE: {
        TITLE: string;
    };
    HELP_RESOURCE_LIST_PAGE: {
        TITLE: string;
    };
    HELP_RESOURCE_DETAIL_PAGE: {
        ATTACHED_FILE: string;
        PUBLICATION_DATE: string;
        RELEVANT_COUNTY: string;
        RELEVANT_SECTOR: string;
    };
    DOC_LIST_VIEW_PAGE: {
        TITLE: string;
        SEARCH: string;
        ID_COLUMN_HEADER: string;
    };
    FORM_VIEW_PAGE: {
        DETAILS_TAB_TITLE: string;
    };
    REPORT_VIEW_PAGE: {
        TITLE: string;
        BUTTON: {
            ACTIONS: string;
            EXPORT: string;
            PRINT: string;
        };
    };
    SUCCESS_SAVE_PAGE: {
        TITLE: string;
        SAVE_SUCCESS_MESSAGE: string;
        BUTTON: {
            SAVE_ANOTHER_RECORD: string;
            BACK_TO_ENGAGEMENTS: string;
        };
    };
    ENGAGEMENT_LIST_PAGE: {
        TITLE: string;
        FINALIZED_SUBMISSIONS: string;
        DRAFT_SUBMISSIONS: string;
        INTRODUCTION: string;
        NO_DATA: string;
        NO_DRAFT_SUBMISSIONS: string;
        BUTTON: {
            EXPLORE: string;
            ADD_SUBMISSION: string;
        };
    };
    CHILD_TABLE: {
        NO_DATA: string;
        EDITING_ROW: string;
        INSERT: string;
    };
    MAP_PAGE: {
        TITLE: string;
        SET_OPTIONS: string;
        OVERLAYS: string;
        SEARCH_REGION: string;
        OPTIONS: string;
        INTRODUCTION: string;
        SWIPE: string;
        MESSAGES: {
            NO_SELECTED_ADMIN: string;
            SLM_ENABLED: string;
            SLM_DISABLED: string;
        };
    };
    SUBMISSIONS_PAGE: {
        TITLE: string;
        SUBMISSIONS: string;
        BUTTONS: {
            NEW_SUBMISSION: string;
            VIEW: string;
        };
        SUBMISSION_GRID: {
            ENGAGEMENT_COLUMN_TITLE: string;
            DATE_COLUMN_TITLE: string;
            ROWS_PER_PAGE: string;
        };
        CHARTS: {
            SUBMISSIONS_BY_ENGAGEMENT: string;
            SUBMISSIONS_BY_DATE: string;
        };
        STRUCTURED_ENGAGEMENT: {
            MISSING_FORM: string;
        };
    };
    BASE_CONTROLS: {
        ATTACH_FILE: string;
        INVALID_IMAGE_FILE: string;
        INVALID_FILE_TYPE: string;
        MAX_FILE_SIZE_EXCEEDED: string;
    };
    FILE_UPLOADER: {
        UPLOAD_SINGLE_FILE: string;
        UPLOAD_MULTIPLE_FILES: string;
        PICK_DOCUMENT: string;
    };
    MEDIA_HANDLER: {
        NO_CAMERA_PERMISSIONS: string;
        REQUEST_CAMERA_PERMISSION: string;
        FLIP_CAMERA: string;
        RECORD_AUDIO: string;
        SELECT_IMAGE_VIDEO: string;
        SELECT_DOCUMENT: string;
        LAUNCH_CAMERA: string;
        UPLOAD_MEDIA: string;
        DIALOG_TITLE: string;
        NO_FILE_SELECTED: string;
    };
};

// const I = {
//     WELCOME: 'welcome',
// }
type I = keyof Translation;
export const SSS = {} as I;
export default I;
