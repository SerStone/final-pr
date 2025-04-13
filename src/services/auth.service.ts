import { axiosService } from "./axios.service";
import { urls } from "../constants";
import { IUser } from "../interfaces";
import { IRes } from "../types/axiosRes.type";

const _accessTokenKey = "access";
const _refreshTokenKey = "refresh";

const authService = {
    register: (user: { email: string; password: string }) => axiosService.post(urls.auth.register, user),
    login: (user: { email: string; password: string }) => axiosService.post(urls.auth.login, user),
    refresh: (refresh: string) => axiosService.post(urls.auth.refresh, { refresh }),

    createManager: (userData: Partial<IUser>) =>
        axiosService.post(urls.auth.createManager, userData),

    activateAccount: (token: string, password: string) =>
        axiosService.post(urls.auth.activate(token), { password }),

    sendActivationMail: (userId: number) =>
    axiosService.post(urls.auth.activationMailAcc, { user_id: userId }),

    resetPassword: (token: string, password: string) =>
        axiosService.post(urls.auth.recoveryNewPass(token), { password }),

    sendRecoveryMail: (email: string) =>
        axiosService.post(urls.auth.recoveryMailPass, { email }),

    setTokens: (access: string, refresh: string) => {
        localStorage.setItem(_accessTokenKey, access);
        localStorage.setItem(_refreshTokenKey, refresh);
    },


    deleteToken: () => {
        localStorage.removeItem(_accessTokenKey);
        localStorage.removeItem(_refreshTokenKey);
    },

    getAccessToken: () => localStorage.getItem(_accessTokenKey),
    getRefreshToken: () => localStorage.getItem(_refreshTokenKey),
};

export { authService };
