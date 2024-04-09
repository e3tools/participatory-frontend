import { Platform } from "react-native"

const DOCTYPES = {
    ENGAGEMENT_ENTRY: 'Engagement Entry'
}

const APPS = {
    FRAPPE_CUSTOM_APP: 'participatory_backend'
}

const URLS = {
    //BACKEND: "http://10.120.108.101:8003",
    //BACKEND: Platform.OS === 'web' ? "http://192.168.101.6:8000" : "http://10.0.2.2:8000"
    BACKEND: "http://192.168.101.6:8000"
}

// const LEGEND_TYPE = {
//     TEXT: 'Text',
//     NUMERIC: 'Numeric',
//     DATE: 'Date'
// }

// const ANALYSIS_TYPE = {
//     TEXT: 'Text',
//     NUMERIC: 'Numeric',
//     DATE: 'Date'
// }

// const DATASOURCE = {
//     VECTOR: 'Vector',
//     RASTER: 'Raster',
//     TABULAR: 'Tabular'
// }

// const DATA_TYPE = {
//     GEOJSON: 'geojson',
//     RASTER: 'raster'
// }

const OPERATOR = {
    EQUALS: "Equals",
    NOT_EQUALS: "Not Equals",
    LIKE: 'Like',
    NOT_LIKE: 'Not Like',
    IN: 'In',
    NOT_IN: 'Not In',
    GREATER_THAN: '>',
    GREATER_OR_EQUAL_TO: '>=',
    LESS_THAN: '<',
    LESS_OR_EQUAL_TO: '<=',
    BETWEEN: 'Between'
}

const FIELD_TYPE = {
    DATA: 'Data',
    PASSWORD: 'Password',
    TEXT: 'Text',
    SMALL_TEXT: 'Small Text',
    LONG_TEXT: 'Long Text',
    SELECT: 'Select',
    LINK: 'Link',
    CURRENCY: 'Currency',
    INT: "Int",
    FLOAT: "Float",
    DATE: "Date",
    CHECKBOX: "Check",
    PHONE: 'Phone',
    ATTACH: 'Attach',
    ATTACH_IMAGE: 'Attach Image',
    TABLE: 'Table'
}

const SPECIAL_TEXT_FIELD_TYPE = { 
    EMAIL: 'Email'
}

// const NUMERIC_DATA_TYPES = ['Currency', 'Int', 'Float'];

export {
    DOCTYPES,
    APPS,
    URLS,
    //LEGEND_TYPE,
    //ANALYSIS_TYPE,
    //DATASOURCE,
    OPERATOR,
    //DATA_TYPE,
    FIELD_TYPE, 
    SPECIAL_TEXT_FIELD_TYPE,
}