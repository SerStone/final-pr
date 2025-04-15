import React, { FC, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Box } from "@mui/material";

import { authService } from './services/auth.service';
import { AdminPanel, ActivateAccountForm, PasswordResetPage, LoginPage, RegisterPage, OrdersPage } from './pages'
import { MainLayout } from './layouts'
import { ThemeProviderComponent, SessionModal ,ProtectedRoute, AuthRedirect } from './components';
import { useAppLocation } from './hooks';

import './App.css';

const App: FC = () => {
    return (
        <ThemeProviderComponent>
            <Box>
                <Routes>
                        <Route path="/" element={<AuthRedirect />} />
                        <Route path={'/register'} element={<RegisterPage />} />
                        <Route path={'/login'} element={<LoginPage />} />
                        <Route path={'/activate/:token'} element={<ActivateAccountForm />} />
                        <Route path={'/recovery/:token'} element={<PasswordResetPage />} />

                    <Route path={'/'} element={<MainLayout />}>

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
