interface BaseEntity {
    name: string
    creation: Date
}

export interface User extends BaseEntity { 
    email: string
    first_name: string
    last_name: string
    avatar: string
    auth_token: string
} 

export interface DocType extends BaseEntity {
     
}

export interface Engagement extends BaseEntity {
    has_data_forms: boolean
}

export interface DashboardChart extends BaseEntity {
    chart_type: string
}

export interface Dashboard extends BaseEntity {
    charts: DashboardChart[]
}

