import React from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";

interface ActivationLinkDialogProps {
    open: boolean;
    onClose: () => void;
    link: string;
    type: "activation" | "recovery";
}

const ActivationLinkDialog: React.FC<ActivationLinkDialogProps> = ({ open, onClose, link, type }) => {
    const handleCopyAndClose = () => {
        navigator.clipboard.writeText(link);
        onClose();
    };

    const title = type === "activation" ? "Activation Link" : "Recovery Password Link";

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    value={link}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCopyAndClose} color="primary" variant="contained">
                    Copy & Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export {ActivationLinkDialog};


