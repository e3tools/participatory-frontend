const DOCTYPES = {
    ENGAGEMENT_ENTRY: 'Engagement Entry'
}

const APPS = {
    FRAPPE_CUSTOM_APP: 'participatory_backend'
}

const URLS = {
    //BACKEND: "http://192.168.1.111:8003",
    BACKEND: "http://192.168.101.6:8000"
}

const LEGEND_TYPE = {
    TEXT: 'Text',
    NUMERIC: 'Numeric',
    DATE: 'Date'
}

const ANALYSIS_TYPE = {
    TEXT: 'Text',
    NUMERIC: 'Numeric',
    DATE: 'Date'
}

const DATASOURCE = {
    VECTOR: 'Vector',
    RASTER: 'Raster',
    TABULAR: 'Tabular'
}

const DATA_TYPE = {
    GEOJSON: 'geojson'
}

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

export {
    DOCTYPES,
    APPS,
    URLS,
    LEGEND_TYPE,
    ANALYSIS_TYPE,
    DATASOURCE,
    OPERATOR,
    DATA_TYPE
}