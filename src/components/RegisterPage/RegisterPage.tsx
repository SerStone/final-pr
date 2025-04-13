import React from 'react';
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            minWidth: "100vw",
            background: "linear-gradient(135deg, #6a11cb, #c13584) !important",
            overflow: "hidden"
        }}>
            <Card sx={{ width: 450, padding: 5, borderRadius: 5, textAlign: "center", boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Registration Unavailable
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Account creation is only possible through an administrator.
                        If you need access, please contact the system administrator.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/login')}
                        sx={{
                            backgroundColor: "#0d254c",
                            color: "#fff",
                            "&:hover": { backgroundColor: "#09203f" },
                            fontSize: "16px",
                            padding: "10px 20px"
                        }}
                    >
                        Go to Login
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export { RegisterPage };
