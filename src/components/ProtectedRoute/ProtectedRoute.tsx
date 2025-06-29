import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useAppLocation } from '../../hooks';
import { authService } from '../../services';

export const isTokenValid = (token: string | null) => {
    if (!token) return false;
    try {
        const [, payload] = token.split('.');
        const decoded = JSON.parse(atob(payload));
        return decoded.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = authService.getAccessToken();
    const access = authService.getAccessToken();
    const refresh = authService.getRefreshToken();
    const location = useAppLocation();

    if (!isTokenValid(access) && !refresh) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};
