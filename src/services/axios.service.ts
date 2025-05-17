import axios from "axios";
import { createBrowserHistory } from "history";
import { jwtDecode } from "jwt-decode";

import { authService } from "./auth.service";
import { baseURL } from "../constants";

const history = createBrowserHistory();
const axiosService = axios.create({ baseURL });

let isRefreshing = false;
let refreshFailedOnce = false;
let showSessionModal: (() => Promise<string | null>) | null = null;
let refreshSubscribers: ((token: string) => void)[] = [];

export const setSessionModalHandler = (handler: () => Promise<string | null>) => {
    showSessionModal = handler;
};

function isAccessTokenExpired(token: string): boolean {
    try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        const currentTime = Date.now() / 1000;
        return exp - currentTime < 60;
    } catch (e) {
        return true;
    }
}

function subscribeTokenRefresh(cb: (token: string) => void) {
    refreshSubscribers.push(cb);
}


function onRefreshed(token: string) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

axiosService.interceptors.request.use(async (config) => {
    const accessToken = authService.getAccessToken();
    const refreshToken = authService.getRefreshToken();

    if (config.url?.includes("/auth/refresh")) {
        return config;
    }

    if (accessToken && config.headers) {
        if (isAccessTokenExpired(accessToken)) {
            if (!isRefreshing && refreshToken) {
                isRefreshing = true;
                try {
                    const { data } = await authService.refresh(refreshToken);
                    authService.setTokens(data.access, data.refresh);
                    onRefreshed(data.access);
                    config.headers.Authorization = `Bearer ${data.access}`;
                } catch (e) {
                    authService.deleteToken();
                    onRefreshed("");
                    isRefreshing = false;
                }
            } else {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((newToken) => {
                        if (config.headers && newToken) {
                            config.headers.Authorization = `Bearer ${newToken}`;
                        }
                        resolve(config);
                    });
                });
            }
        } else {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }

    return config;
});

axiosService.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = authService.getRefreshToken();

        if (
            error.response?.status === 401 &&
            refreshToken &&
            !originalRequest._retry &&
            !refreshFailedOnce
        ) {
            originalRequest._retry = true;

            if (showSessionModal) {
                try {
                    const newAccessToken = await showSessionModal();
                    if (newAccessToken && originalRequest.headers) {
                        refreshFailedOnce = false;
                        authService.setTokens(newAccessToken, refreshToken);
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return axiosService(originalRequest);
                    }
                } catch (e) {
                }
            }

            refreshFailedOnce = true;
            authService.deleteToken();
        }

        return Promise.reject(error);
    }
);

export { axiosService };