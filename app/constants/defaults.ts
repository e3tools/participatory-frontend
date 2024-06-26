import { APP } from "../utils/app";

const GLOBALS = class {
    static MAX_GRID_COLUMNS = 2;
    static LISTVIEW_PAGE_SIZES = [5, 10, 20];
    static LISTVIEW_SORT_FIELD = "Modified DESC"
    static MAX_DATA_ROWS = 5000;
    static MAX_UPLOAD_SIZE = 5 * 1024 * 1024; //5 MB
    static NEW_RECORD_ID = 'New'
    static BACKEND_TIMEOUT = 120000 //backend api calls will timeout in 2 minutes
}

export { GLOBALS }