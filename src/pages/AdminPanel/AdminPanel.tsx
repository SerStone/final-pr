import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {orderStatsSliceActions, userActions, usersActions } from "../../redux";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Button, Box, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, Tooltip
} from "@mui/material";
import {Block, LockOpen, LockReset, Send } from "@mui/icons-material";

import { IUser } from "../../interfaces";
import { LoaderOrError } from "../../components/LoadingOrError/LoadingOrError";
import { Pagination } from "../../components/Pagination/Pagination";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useThemeContext } from "../../components/ThemeContext/ThemeContext";

import styles from "./AdminPanel.module.css";



const AdminPanel = () => {
    const dispatch = useAppDispatch();
    const { users, totalPages, isLoading, errors} = useAppSelector((state) => state.users);
    const { stats, loading: statsLoading, error: statsError } = useAppSelector(state => state.stats);
    const [searchParams, setSearchParams] = useSearchParams();
    const { userData } = useAppSelector((state) => state.user);
    const page = Number(searchParams.get("page")) || 1;
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        profile: { first_name: "", last_name: "" }
    });

    useEffect(() => {
        if (userData?.is_staff) {
            dispatch(usersActions.getAllUsers({page}));
            dispatch(orderStatsSliceActions.fetchOrderStats());
        }
    }, [dispatch, page, userData]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleBlock = (userId: number) => {
        dispatch(usersActions.blockUser(userId));
    };

    const handleUnblock = (userId: number) => {
        dispatch(usersActions.unblockUser(userId));
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name.includes("first_name") || name.includes("last_name") ? "profile" : name]:
                name.includes("first_name") || name.includes("last_name")
                    ? { ...prev.profile, [name]: value }
                    : value
        }));
    };

    const handlePageChange = (newPage: number) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set("page", newPage.toString());
            return newParams;
        });
    };
    const handleSubmit = async () => {
        const resultAction = await dispatch(usersActions.createManager(formData));
        if (usersActions.createManager.fulfilled.match(resultAction)) {
            dispatch(usersActions.getAllUsers({ page }));
            handleClose();
        }
    };



    const generatePagination = (currentPage: number, totalPages: number) => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 4) pages.push("...");
            for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 3) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = generatePagination(page, totalPages);

    const { darkMode } = useThemeContext();

    if (!userData?.is_staff) {
        return <Typography variant="h5" align="center">Access Denied. Please contact our support group.</Typography>;
    }

    return (
        <TableContainer component={Paper} sx={{ maxWidth: 1400, margin: "auto", mt: 4, p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box/>
                <Typography variant="h4">Admin Panel</Typography>
                <div tabIndex={0} className={styles.plusButton} onClick={handleOpen}>
                    <svg className={styles.plusIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                        <g mask="url(#mask0_21_345)">
                            <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                        </g>
                    </svg>
                </div>
            </Box>

            {stats && (
                <Box display="flex" gap={2} mt={2} justifyContent="center" flexWrap="wrap">
                    <Typography variant="subtitle1">Total: {stats.total}</Typography>
                    <Typography variant="subtitle1">New: {stats.New}</Typography>
                    <Typography variant="subtitle1">In Work: {stats.in_work}</Typography>
                    <Typography variant="subtitle1">Agreed: {stats.aggre}</Typography>
                    <Typography variant="subtitle1">Disagreed: {stats.disaggre}</Typography>
                    <Typography variant="subtitle1">Dubbing: {stats.dubbing}</Typography>
                </Box>
            )}
                    <LoaderOrError isLoading={isLoading} error={errors} />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Username</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', minWidth: 200 }}>Email</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Role</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>First Name</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Last Name</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Total Orders</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>New</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>In Work</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Agreed</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Disagreed</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Dubbing</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', minWidth: 160 }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user: IUser) => (
                        <TableRow key={user.id}>
                            <TableCell sx={{ textAlign: 'center' }}>{user.id}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{user.username}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{user.email}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{user.is_staff ? "Admin" : "Manager"}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{user.profile?.first_name || "N/A"}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{user.profile?.last_name || "N/A"}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{user.total_orders ?? 0}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{user.orders_new ?? 0}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{user.orders_in_work ?? 0}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{user.orders_agree ?? 0}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{user.orders_disagree ?? 0}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{user.orders_dubbing ?? 0}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                <Box display="flex" flexDirection="column" gap={1}>
                                    <Tooltip title="Send activation email">
                                      <span>
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            size="small"
                                            startIcon={<Send sx={{ fontSize: 18 }} />}
                                            disabled={user.is_manager}
                                            onClick={() => dispatch(userActions.sendActivationMail(user.id))}
                                            sx={{ textTransform: "none", height: 32, minWidth: 100 }}
                                        >
                                          Activate
                                        </Button>
                                      </span>
                                    </Tooltip>

                                    <Tooltip title="Send password recovery email">
                                      <span>
                                        <Button
                                            variant="outlined"
                                            color="warning"
                                            size="small"
                                            startIcon={<LockReset sx={{ fontSize: 18 }} />}
                                            disabled={!user.is_manager}
                                            onClick={() => dispatch(userActions.sendRecoveryMail(user.email))}
                                            sx={{ textTransform: "none", height: 32, minWidth: 100 }}
                                        >
                                          Recover
                                        </Button>
                                      </span>
                                    </Tooltip>
                                <span>
                                    {user.is_active ? (
                                        <Tooltip title="Ban user">
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                disabled={!user.is_manager}
                                                startIcon={<Block sx={{ fontSize: 18 }} />}
                                                onClick={() => handleBlock(user.id)}
                                                sx={{ textTransform: "none", height: 32, minWidth: 100 }}
                                            >
                                                Ban
                                            </Button>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Unban user">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                disabled={!user.is_manager}
                                                startIcon={<LockOpen sx={{ fontSize: 18 }} />}
                                                onClick={() => handleUnblock(user.id)}
                                                sx={{ textTransform: "none", height: 32, minWidth: 100 }}
                                            >
                                                Unban
                                            </Button>
                                        </Tooltip>
                                    )}
                                         </span>
                                </Box>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>

            </Table>

            {/* Пагінація */}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Modal for Creating Manager */}
            <Dialog open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { borderRadius: 4, padding: 2 } }}>
                <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}>
                    Create Manager
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="dense"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            margin="dense"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="First Name"
                            name="first_name"
                            value={formData.profile.first_name}
                            onChange={handleChange}
                            margin="dense"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="last_name"
                            value={formData.profile.last_name}
                            onChange={handleChange}
                            margin="dense"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
                    <Button onClick={handleClose} color="secondary" sx={{ textTransform: "none", fontWeight: "bold" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained" sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        borderRadius: 2,
                        px: 3
                    }}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
};

export { AdminPanel };

