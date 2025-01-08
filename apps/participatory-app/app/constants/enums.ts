const TABLES_TO_UP_SYNC = Array<string>();

const TABLES_TO_DOWN_SYNC = [
  'DocType',
  'User',
  'Admin 0',
  'Admin 1',
  'Admin 2',
  'Admin 3',
  'Admin 4',
  'Admin 5',
  'Engagement',
  'Engagement Template',
  'Technical Analysis',
];

// extra fields to be down-synced per table
const TABLES_TO_DOWN_SYNC_EXTRA_FIELDS = {
  User: { fields: ['full_name'], filters: {} },
  DocType: { fields: ['*'], filters: [['module', '=', 'Engage']] },
  Engagement: { fields: ['*'], filters: [] },
  'Engagement Template': { fields: ['*'], filters: [] },
  'Technical Analysis': { fields: ['*'], filters: [] },
};

// Tables whose data can be created on the frontend
const WRITEABLE_TABLES = ['Engagement'];

const DOCTYPES = {
  ENGAGEMENT_ENTRY: 'Engagement Entry',
};

const APPS = {
  FRAPPE_CUSTOM_APP: 'participatory_backend',
};

//const KENYA_BOUNDING_BOX = [33.89, -4.68, 41.86, 5.51];

const ENGAGEMENT_TYPES = {
  SURVEY: 'Survey',
  SUBMISSION: 'Submission',
  GUESTBOOK: 'Guestbook',
  STORIES: 'Stories',
  Q_A: 'Q&A',
  QUICK_POLL: 'Quick Poll',
  IDEAS: 'Ideas',
  DISCUSSION_FORUM: 'Discussion Forum',
  MAP: 'Map',
};

export {
  DOCTYPES,
  APPS,
  //KENYA_BOUNDING_BOX,
  TABLES_TO_UP_SYNC,
  TABLES_TO_DOWN_SYNC,
  TABLES_TO_DOWN_SYNC_EXTRA_FIELDS,
  WRITEABLE_TABLES,
  ENGAGEMENT_TYPES,
};
