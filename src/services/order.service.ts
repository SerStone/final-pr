import {axiosService} from "./axios.service";

import {IComment, IGroup, IGroupPagination, IOrder, IPagination} from "../interfaces";
import {urls} from "../constants";
import {IRes} from "../types/axiosRes.type";
import { IOrderStats } from "../interfaces/stat.interface";

class OrderService {
    getAll(page: number, order?: string, filters?: Record<string, string | boolean>): IRes<IPagination<IOrder[]>> {
        return axiosService.get(urls.orders.orders, {
            params: { page, order, ...filters }
        });
    }
    getAllStats(): IRes<IOrderStats> {
        return axiosService.get(urls.orders.ordersStatistics);
    }


    updateById(orderId: number, updatedOrder: Partial<IOrder>): IRes<IOrder> {
        return axiosService.patch(urls.orders.UpdateOrder(orderId), updatedOrder);
    }
    addComment(orderId: number, text: string): IRes<IOrder> {
        return axiosService.post(urls.orders.addComment(orderId), { text });
    }

    getCommentsByOrderId(orderId: number): IRes<IComment[]> {
        return axiosService.get(urls.orders.addComment(orderId));
    }

    deleteById(orderId: number, commentId: number): IRes<IComment> {
        return axiosService.delete(urls.orders.DeleteComment(orderId, commentId));
    }

    getGroups(): IRes<IGroupPagination<IGroup[]>> {
        return axiosService.get(urls.orders.allGroups);
    }


    createGroup(groupName: string): IRes<IGroup> {
        return axiosService.post(urls.orders.addGroup, { group_name: groupName });
    }
}

const orderService = new OrderService();
export { orderService };

