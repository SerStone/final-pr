import {FC, useCallback, useState} from 'react';
import {Outlet} from 'react-router-dom';

import {Box, Container, createTheme, ThemeProvider} from '@mui/material';

import {Header} from '../components';
import {IUser} from "../interfaces/user.interface";
import {Footer} from "../components"
import {useAppLocation} from '../hooks'




const MainLayout: FC = () => {
    const location = useAppLocation();
    const hideHeader = location.pathname === "/login";


    return (
            <Box>
                <Box sx={{ width: "100%", height: "maxContent" }}>
                    {!hideHeader && <Header />}
                    <Outlet/>
                    <Footer/>

                </Box>
            </Box>
    );
};

export {MainLayout};