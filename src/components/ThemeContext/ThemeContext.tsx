import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

interface ThemeContextType {
    toggleTheme: () => void;
    darkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext must be used within a ThemeProvider");
    }
    return context;
};

export const ThemeProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
            ...(darkMode && {
                background: {
                    default: "#1E1E2D", // Новий колір фону для темної теми
                    paper: "#1E1E2D", // Колір фону для карток/контейнерів
                },
                text: {
                    primary: "#ffffff", // Колір основного тексту
                    secondary: "#b0c4de", // Колір вторинного тексту
                },
            }),
        },
        components: {
            MuiTableHead: {
                styleOverrides: {
                    root: {
                        backgroundColor: "transparent",
                        color: "inherit",
                    },
                },
            },
            MuiTableRow: {
                styleOverrides: {
                    root: {
                    },
                },
            },
        },
    });

    const toggleTheme = () => {
        setDarkMode((prev) => !prev);
    };

    return (
        <ThemeContext.Provider value={{ toggleTheme, darkMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline /> {/* You can also remove or customize this */}
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
