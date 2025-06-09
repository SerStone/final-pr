import {FC, useCallback, useEffect, useState} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {Box, Container, createTheme, ThemeProvider} from '@mui/material';

import {Header, Footer, isTokenValid} from '../components';
import {useAppLocation} from '../hooks'
import {IUser} from "../interfaces/user.interface";
import { authService } from '../services';

const MainLayout: FC = () => {
    const location = useAppLocation();
    const hideHeader = location.pathname === "/login";
    const navigate = useNavigate();

    useEffect(() => {
        const token = authService.getAccessToken();

        if (location.pathname === "/") {
            if (isTokenValid(token)) {
                navigate("/orders/v2?page=1", { replace: true });
            } else {
                navigate("/login", { replace: true });
            }
        }
    }, [location.pathname]);

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
        }}>
            {!hideHeader && <Header />}

            <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export {MainLayout};