interface BaseEntity {
  name: string;
  creation: Date;
}

export interface User extends BaseEntity {
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  auth_token: string;
}

export interface DocType extends BaseEntity {}

export interface Engagement extends BaseEntity {
  has_data_forms: boolean;
  engagement_template: string;
  engagement_form: string;
  engagement_name: string;
  engagement_type: string;
  description: string;
  status: string;
  is_published: boolean;
  closing_date: Date;
}

export interface EngagementEntry extends BaseEntity {
  engagement: string;
  engagement_name: string;
  entered_by: string;
  entered_on: Date;
  status: string;
}

export interface DashboardChart extends BaseEntity {
  chart_type: string;
  chart: string;
}

export interface Dashboard extends BaseEntity {
  charts: DashboardChart[];
}

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

interface ColorSchemeItem {
  text: string;
  background: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

export interface ColorScheme {
  light: ColorSchemeItem;
  dark: ColorSchemeItem;
}

export interface CustomSettings {
  app_name: string;
  app_slogan: string;
  app_introduction: string;
  county_name: string;
  county_slogan: string;
  logo?: string;
  logoUri?: string;
}

type OrderDirection = 'ASC' | 'DESC';

export type OrderBy = {
  field: string;
  direction: OrderDirection;
};

export interface DBSelectProps {
  doctype: string;
  filters: [][];
  fields: string[];
  orderBy: OrderBy;
  getGlobalCount?: boolean;
}
