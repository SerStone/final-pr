import {IGroup, IOrder} from "./order.interface";
import { IUser } from "./user.interface";

export interface IPagination<T> {
    page: number
    total_items: number;
    total_pages: number;
    prev: boolean
    next: boolean
    data: [IOrder];
}

export interface IUserPagination<T> {
    page: number
    total_items: number;
    total_pages: number;
    prev: boolean
    next: boolean
    data: [IUser];
}

export interface IGroupPagination<T> {
    page: number
    total_items: number;
    total_pages: number;
    prev: boolean
    next: boolean
    data: [IGroup];
}