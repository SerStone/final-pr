import {FC, useCallback, useState} from 'react';
import {Outlet} from 'react-router-dom';
import {Box, Container, createTheme, ThemeProvider} from '@mui/material';

import {Header, Footer} from '../components';
import {useAppLocation} from '../hooks'
import {IUser} from "../interfaces/user.interface";

const MainLayout: FC = () => {
    const location = useAppLocation();
    const hideHeader = location.pathname === "/login";


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