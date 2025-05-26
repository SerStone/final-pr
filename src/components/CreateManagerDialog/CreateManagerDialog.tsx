import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
} from "@mui/material";

interface Profile {
    first_name: string;
    last_name: string;
}

interface FormData {
    email: string;
    username: string;
    profile: Profile;
}

interface CreateManagerDialogProps {
    open: boolean;
    handleClose: () => void;
    handleSubmit: () => void;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    formData: FormData;
}

const CreateManagerDialog: React.FC<CreateManagerDialogProps> = ({
                                                                     open,
                                                                     handleClose,
                                                                     handleSubmit,
                                                                     handleChange,
                                                                     formData,
                                                                 }) => {
    const [emailError, setEmailError] = useState<string>("");
    const [usernameError, setUsernameError] = useState<string>("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        if (!formData.email) {
            setEmailError("Email is required");
        } else if (!emailRegex.test(formData.email)) {
            setEmailError("Invalid email format");
        } else {
            setEmailError("");
        }
    }, [formData.email]);

    useEffect(() => {
        if (!formData.username) {
            setUsernameError("Username is required");
        } else if (formData.username.length < 5) {
            setUsernameError("Username must be at least 5 characters");
        } else {
            setUsernameError("");
        }
    }, [formData.username]);

    const onSubmit = () => {
        if (emailError || usernameError) return;
        handleSubmit();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            sx={{ "& .MuiPaper-root": { borderRadius: 4, padding: 2 } }}
        >
            <DialogTitle
                sx={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}
            >
                Create Manager
            </DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="dense"
                        variant="outlined"
                        error={!!emailError}
                        helperText={emailError}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        margin="dense"
                        variant="outlined"
                        error={!!usernameError}
                        helperText={usernameError}
                        required
                    />
                    <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        value={formData.profile.first_name}
                        onChange={handleChange}
                        margin="dense"
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="last_name"
                        value={formData.profile.last_name}
                        onChange={handleChange}
                        margin="dense"
                        variant="outlined"
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
                <Button
                    onClick={handleClose}
                    color="secondary"
                    sx={{ textTransform: "none", fontWeight: "bold" }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onSubmit}
                    color="primary"
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        borderRadius: 2,
                        px: 3,
                    }}
                    disabled={!!emailError || !!usernameError}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export {CreateManagerDialog};
