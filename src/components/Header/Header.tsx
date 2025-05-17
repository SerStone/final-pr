import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from "@mui/material";
import { Home, ExitToApp, LightMode, DarkMode } from "@mui/icons-material";

import {useAppLocation, useAppSelector } from "../../hooks";
import { useThemeContext } from "../ThemeContext/ThemeContext";
import { authService } from "../../services";
import { ExportToExcel } from "../ExcelButton/ExcelButton";
import Logo from "../../assets/logo.png";


const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useAppLocation();
    const { userData } = useAppSelector((state) => state.user);
    const { toggleTheme, darkMode } = useThemeContext();

    const handleLogout = () => {
        authService.deleteToken();
        navigate("/login");
    };
    const showExportButton = location.pathname === '/orders/v2';

    return (
        <AppBar position="static" sx={{ backgroundColor: darkMode ? "#28293D" : "#efefef", color: darkMode ? "#fff" : "#000" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <Link to="/orders/v2?page=1&order=-id">
                        <img src={Logo} alt="Logo" style={{ height: 40, borderRadius: '50%' }} />
                    </Link>

                    <Button startIcon={<Home />} component={Link} to="/orders/v2?page=1&order=-id" sx={{ textTransform: "none", color: darkMode ? "#fff" : "#000" }}>
                        Home
                    </Button>
                    {showExportButton && <ExportToExcel />}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <Link to="/adminPanel?page=1" style={{ textDecoration: "none", color: "inherit" }}>
                        <AdminPanelSettingsIcon style={{ fontSize: 40, borderRadius: "15%" }} />
                    </Link>
                    <IconButton onClick={toggleTheme} color="inherit">
                        {darkMode ? <LightMode /> : <DarkMode />}
                    </IconButton>

                    <Typography variant="body1" sx={{ marginRight: 2, fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
                        {userData?.username || "Guest"}
                    </Typography>
                    <IconButton onClick={handleLogout} color="error">
                        <ExitToApp />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export { Header };

