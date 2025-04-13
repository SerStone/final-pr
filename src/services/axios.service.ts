import axios from "axios";
import { authService } from "./auth.service";
import { createBrowserHistory } from "history";
import { baseURL } from "../constants";


const history = createBrowserHistory();
const axiosService = axios.create({ baseURL });

let isRefreshing = false;

axiosService.interceptors.request.use((config) => {
    const token = authService.getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Глобальна змінна для збереження функції виклику модального вікна
let showSessionModal: (() => Promise<string | null>) | null = null;

export const setSessionModalHandler = (handler: () => Promise<string | null>) => {
    showSessionModal = handler;
};

axiosService.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = authService.getRefreshToken();

        if (
            error.response?.status === 401 &&
            refreshToken &&
            !isRefreshing &&
            showSessionModal &&
            !originalRequest._retry
        ) {
            isRefreshing = true;
            originalRequest._retry = true;

            try {
                const newAccessToken = await showSessionModal();
                if (newAccessToken && originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosService(originalRequest);
                } else {
                    authService.deleteToken();
                    window.location.href = "/login";
                }
            } catch (err) {
                authService.deleteToken();
                window.location.href = "/login";
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export { axiosService };