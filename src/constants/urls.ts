const baseURL = 'http://localhost:8000/api';
const notImg = 'https://bazarama.com/assets/imgs/Image-not-available.png';

const urls = {
    orders: {
        orders: `/orders`,
        ordersStatistics: '/orders/stats',
        UpdateOrder:(orderId: number) => `/orders/${orderId}/`,
        allGroups:`/orders/groups`,
        addGroup:`/orders/groups`,
        addComment: (orderId: number) => `/orders/${orderId}/add_comment`,
        DeleteComment: (orderId: number, commentId: number) => `/orders/${orderId}/comment/${commentId}`
    },
    users: {
        users: `/users`,
        block: (userId: number) => `/users/${userId}/block`,
        unblock: (userId: number) => `/users/${userId}/unblock`,
    },
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        refresh: '/auth/refresh',
        me: '/auth/me',
        createManager: '/auth/create-manager',
        activationMailAcc: `/auth/send-activation`,
        recoveryMailPass: `/auth/recovery`,
        activate: (token: string) => `/auth/activate/${token}`,
        recoveryNewPass: (token: string) => `/auth/recovery/${token}`,
    },
};


export {
    baseURL,
    urls,
    notImg
};