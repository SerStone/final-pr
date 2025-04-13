import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { TextField, Button, Alert, Container, Typography, Box } from "@mui/material";
import { authService } from "../../services";

const ActivateAccountForm = () => {
    const { token } = useParams<{ token: string }>(); // Get the token from the URL
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!token) {
            setError("Invalid activation link.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await authService.activateAccount(token, password); // Токен передається через URL
            console.log(response);
            setSuccess(response.data.detail); // Display success message
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
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
