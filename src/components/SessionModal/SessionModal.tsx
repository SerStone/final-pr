import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { authService } from "../../services";

const SessionModal = () => {
    const [open, setOpen] = useState(false);
    const [resolver, setResolver] = useState<(token: string | null) => void>();

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

    const handleExtend = async () => {
        try {
            const refreshToken = authService.getRefreshToken();
            if (!refreshToken) {
                resolver?.(null);
                return;
            }

            const { data } = await authService.refresh(refreshToken);
            authService.setTokens(data.access, data.refresh);
            resolver?.(data.access);
            setOpen(false);
        } catch (err) {
            resolver?.(null);
            setOpen(false);
        }
    };

    const handleLogout = () => {
        authService.deleteToken();
        resolver?.(null);
        setOpen(false);
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
                    Your session has expired. Would you like to extend it?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button onClick={handleLogout} variant="outlined" color="inherit">
                    Logout
                </Button>
                <Button onClick={handleExtend} variant="contained" color="primary">
                    Extend
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export { SessionModal };
