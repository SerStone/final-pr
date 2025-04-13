import {IUser} from "./user.interface";

export interface IGroup {
    id?: number;
    group_name?: string;
}

export interface IComment {
    id: number;
    order: number;
    author: IUser
    text: string;
    created_at: string;
}

export interface IOrder {
    id: number
    name: string;
    surname: string;
    email: string;
    phone: string;
    age: number;
    course: string;
    course_format: string;
    course_type: string;
    sum: number;
    alreadyPaid: number;
    created_at: string;
    utm: string;
    msg: string;
    status: string;
    manager: IUser;
    group: IGroup;
    comments: IComment[];
    group_id?: number;
}

