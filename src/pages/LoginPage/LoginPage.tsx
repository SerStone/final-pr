import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { Email, Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { TextField, Box, Typography, Card, CardContent, InputAdornment, IconButton } from "@mui/material";

import AnimatedButton from './AnimatedButton';
import {ILoginForm, IUser } from '../../interfaces';
import { useAppDispatch } from '../../hooks';
import { userActions } from '../../redux';
import { authService } from '../../services';

import styles from '../../assets/CustomButton.module.css';

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ILoginForm>();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<IUser | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isValid, setIsValid] = useState(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isValid === true) {
            setTimeout(() => {
                navigate('/orders/v2?page=1');
            }, 2000);
        }
    }, [isValid, navigate]);


    const handleLogin: SubmitHandler<ILoginForm> = async (data) => {
        setIsValid(null);
        setError("");

        try {
            const response = await authService.login(data);
            const { access, refresh } = response.data;

            authService.setTokens(access, refresh);
            dispatch(userActions.getUser())

            setIsValid(true);
        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.response?.data?.message || "Authentication failed");

            setTimeout(() => {
                setIsValid(false);
            }, 300);
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(135deg, #6a11cb, #c13584)", width: "100vw" }}>
            <Card sx={{ width: 450, padding: 5, borderRadius: 5, textAlign: "center", boxShadow: 3 }}>
                <CardContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2, alignItems: 'center'}}>
                        <Person fontSize="large" sx={{ color: "#333",
                            width: 65,
                            height: 65,
                            backgroundColor: "#f5f5f5",
                            borderRadius: "50%",

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"}} />
                    <Typography variant="h5" fontWeight="bold" gutterBottom>Member Login</Typography>
                        <TextField
                            {...register("email", { required: "Email is required" })}
                            variant="outlined"
                            label="Email"
                            type="email"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: "gray" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            {...register("password", { required: "Password is required", minLength: { value: 5, message: "Password must be at least 5 characters" } })}
                            variant="outlined"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: "gray" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {error && <Typography color="error">{error}</Typography>}
                        <AnimatedButton isValid={isValid} onAction={handleSubmit(handleLogin)} />

                        <Typography variant="body2" sx={{ cursor: "pointer", textDecoration: "underline", color: "gray" }} onClick={() => navigate('/register')}>Create your Account →</Typography>
                    </Box>
                </CardContent>
            </Card>

        </Box>
    );
};

export { LoginPage };