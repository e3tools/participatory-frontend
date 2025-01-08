export interface User {
    name: string;
    username: string;
    email: string;
    full_name: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    mobile_no: string;
    token: string;
    roles: string[];
    is_locked: boolean;
    language: string;
}

export interface LoginCredentials {
    username: string
    password: string
}