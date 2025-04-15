import { Box, Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import { useThemeContext } from "../ThemeContext/ThemeContext";

interface OrdersPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

const generatePagination = (currentPage: number, totalPages: number) => {
    const pages: (number | string)[] = [];

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

const Pagination: React.FC<OrdersPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pages = generatePagination(currentPage, totalPages);
    const [searchParams] = useSearchParams();
    const { darkMode } = useThemeContext();

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                mt: 2,
                alignItems: "center",
            }}
        >
            <Button
                variant="contained"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                sx={{
                    backgroundColor: darkMode ? "#3e37a9" : "#0d254c",
                    color: "#fff",
                    fontSize: "18px",
                    "&:hover": { bgcolor: darkMode ? "#3e37a9" : "#0d254c" },
                    minWidth: "40px",
                }}
            >
                {"<"}
            </Button>

            {pages.map((page, index) => (
                <Button
                    key={index}
                    variant={page === currentPage ? "contained" : "outlined"}
                    disabled={page === "..."}
                    onClick={() => typeof page === "number" && onPageChange(page)}
                    sx={{
                        minWidth: "40px",
                        fontWeight: "bold",
                        fontSize: "16px",
                        bgcolor: page === currentPage
                            ? darkMode ? "#3e37a9" : "#0d254c"
                            : "transparent",
                        color: page === currentPage
                            ? "#fff"
                            : page === "..."
                                ? "#0d254c"
                                : darkMode
                                    ? "#efefef"
                                    : "#0d254c",
                        border: page !== currentPage && page !== "..."
                            ? darkMode
                                ? "1px solid #555"
                                : "1px solid #ccc"
                            : "none",
                        "&:hover": {
                            bgcolor: page === currentPage || page === "..."
                                ? "transparent"
                                : darkMode
                                    ? "#555"
                                    : "#f5f5f5",
                        },
                        pointerEvents: page === "..." ? "none" : "auto",
                        cursor: page === "..." ? "default" : "pointer",
                    }}
                >
                    {page}
                </Button>
            ))}

            <Button
                variant="contained"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                sx={{
                    backgroundColor: darkMode ? "#3e37a9" : "#0d254c",
                    color: "#fff",
                    fontSize: "18px",
                    "&:hover": { backgroundColor: darkMode ? "#3e37a9" : "#0d254c" },
                    minWidth: "40px",
                }}
            >
                {">"}
            </Button>
        </Box>
    );
};

export {Pagination};
