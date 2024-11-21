const sharedConfig3 = require('../../base-config');
module.exports = {
    ...sharedConfig3,
    TABLES_TO_UP_SYNC: [],
    TABLES_TO_DOWN_SYNC: ["DocType", "User", "Admin 0", "Admin 1", 
        "Admin 2", "Admin 3", "Admin 4", "Admin 5",
        "Engagement", "Engagement Template", "Technical Analysis"
    ],
    // extra fields to be down-synced per table
    TABLES_TO_DOWN_SYNC_EXTRA_FIELDS: { 
        "User": { "fields": ["full_name"], "filters": {} },
        "DocType": { "fields": ["*"], "filters": [["module", "=", "Engage"]] },
        "Engagement": { "fields": ["*"], "filters": [] },
        "Engagement Template": { "fields": ["*"], "filters": [] }, 
        "Technical Analysis": { "fields": ["*"], "filters": []}
    },
    // Tables whose data can be created on the frontend
    WRITEABLE_TABLES: [
        'Engagement'
    ]
};