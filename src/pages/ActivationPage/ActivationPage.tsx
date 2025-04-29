import React, { useState } from "react";
import {useNavigate, useParams } from "react-router-dom";
import { TextField, Button, Alert, Container, Typography, Box } from "@mui/material";

import { authService } from "../../services";

const ActivateAccountForm = () => {
    const { token } = useParams<{ token: string }>();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (password: string): string | null => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter";
        }
        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one digit";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return "Password must contain at least one special character";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!token) {
            setError("Invalid activation link.");
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await authService.activateAccount(token, password);
            console.log(response);
            setSuccess(response.data.detail);

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err: any) {
            setError(err.response?.data?.detail || "Activation error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>Activate Your Account</Typography>

                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                        inputProps={{ minLength: 8 }}
                        error={!!error && error.toLowerCase().includes('password')}
                        helperText={!!error && error.toLowerCase().includes('password') ? error : '' }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                        error={!!error && error.toLowerCase().includes('match')}
                        helperText={!!error && error.toLowerCase().includes('match') ? error : ''}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />


                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? "Activating..." : "Activate Account"}
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export { ActivateAccountForm };
