import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

import { authService } from "../../services";

const SessionModal = () => {
    const [open, setOpen] = useState(false);
    const [resolver, setResolver] = useState<(token: string | null) => void>();
    const navigate = useNavigate();

    useEffect(() => {
        import("../../services/axios.service").then(({ setSessionModalHandler }) => {
            setSessionModalHandler(() => {
                return new Promise((resolve) => {
                    setResolver(() => resolve);
                    setOpen(true);
                });
            });
        });
    }, []);

    const handleLogout = () => {
        authService.deleteToken();
        resolver?.(null);
        setOpen(false);
        navigate("/login", { replace: true });
    };

    return (
        <Dialog
            open={open}
            onClose={handleLogout}
            aria-labelledby="session-expired-title"
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle id="session-expired-title" sx={{ textAlign: "center" }}>
                Session Expired
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" align="center" color="textSecondary">
                    Your session has expired. Please log in again.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button onClick={handleLogout} variant="contained" color="primary">
                    Logout
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export { SessionModal };
