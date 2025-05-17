import {axiosService} from "./axios.service";
import {IPagination, IUser, IUserPagination} from "../interfaces";
import {urls} from "../constants";
import {IRes} from "../types/axiosRes.type";

class UserServiceService {

    getAll(page: number): IRes<IUserPagination<IUser[]>> {
        return axiosService.get(urls.users.users, {
            params: { page }

        })
    }

    blockUser(userId: number): IRes<IUser> {
        return axiosService.put(urls.users.block(userId));
    }

    unblockUser(userId: number): IRes<IUser> {
        return axiosService.put(urls.users.unblock(userId));
    }
}
const userService = new UserServiceService();
export { userService };