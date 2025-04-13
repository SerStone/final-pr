export interface ILoginForm {
    email: string;
    password: string;
}

export interface IUser {
    id?: number;
    email: string;
    username: string;
    password?: string;
    is_manager?: boolean;
    is_active: boolean;
    is_staff?: boolean;
    is_superuser: boolean;
    created_at: string;
    updated_at: string;
    profile?: IProfile;
    total_orders: number;
    orders_new: number;
    orders_in_work: number;
    orders_agree: number;
    orders_disagree: number;
    orders_dubbing: number;
}

export interface IProfile {
    first_name: string;
    last_name: string;
    age?: number;
    avatar?: string;
}
