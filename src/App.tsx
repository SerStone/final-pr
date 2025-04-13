import React, {FC, useEffect, useState} from 'react';
import {Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { authService } from './services/auth.service';
import {Box} from "@mui/material";
import {MainLayout} from './layouts'
import {LoginPage, RegisterPage} from './components'
import {OrdersPage} from './pages/OrderPage/OrderPage'
import { ActivateAccountForm } from './pages/ActivationPage/ActivationPage';
import { AdminPanel } from './pages/AdminPanel/AdminPanel';

import { PasswordResetPage } from './pages/PasswordResetPage/PasswordResetPage';
import { ThemeProviderComponent } from './components/ThemeContext/ThemeContext';
import { SessionModal } from './components/SessionModal/SessionModal';
import { useAppLocation } from './hooks';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';


const App: FC = () => {
    return (
        <ThemeProviderComponent>
            <Box>
                <Routes>
                        {/* Публічні сторінки */}
                        <Route path={'/register'} element={<RegisterPage />} />
                        <Route path={'/login'} element={<LoginPage />} />
                        <Route path={'/activate/:token'} element={<ActivateAccountForm />} />
                        <Route path={'/recovery/:token'} element={<PasswordResetPage />} />

                    <Route path={'/'} element={<MainLayout />}>
                        {/* Захищені сторінки */}
                        <Route path={'/orders/v2'} element={
                            <ProtectedRoute>
                                <OrdersPage />
                            </ProtectedRoute>
                        } />
                        <Route path={'/adminPanel'} element={
                            <ProtectedRoute>
                                <AdminPanel />
                            </ProtectedRoute>
                        } />
                    </Route>
                </Routes>
                <SessionModal />
            </Box>
        </ThemeProviderComponent>
    );
}

export default App;
