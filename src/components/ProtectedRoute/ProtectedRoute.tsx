import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { authService } from '../../services';

const isTokenValid = (token: string | null) => {
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
    const location = useLocation();

    if (!isTokenValid(token)) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};
