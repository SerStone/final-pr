import {useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";
import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, TextField, MenuItem, Box, Button, Grid, FormControlLabel, Checkbox, IconButton, useTheme } from "@mui/material";
import { ArrowDropUp, ArrowDropDown, Refresh } from "@mui/icons-material";

import {groupSliceActions, orderSliceActions } from "../../redux";
import { LoaderOrError } from "../LoadingOrError/LoadingOrError";
import { Pagination } from "../Pagination/Pagination";
import { OrderInfo } from "../OrderInfo/OrderInfo";
import {OrderFilters} from "../OrderFilters/OrderFilters";
import { useThemeContext } from "../ThemeContext/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../hooks";

const OrdersTable = () => {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchParamsString = searchParams.toString();

    const columns = [
        { key: "id", label: "id" },
        { key: "name", label: "name" },
        { key: "surname", label: "surname" },
        { key: "email", label: "email" },
        { key: "phone", label: "phone" },
        { key: "age", label: "age" },
        { key: "course", label: "course" },
        { key: "course_format", label: "format" },
        { key: "course_type", label: "type" },
        { key: "status", label: "status" },
        { key: "sum", label: "sum" },
        { key: "alreadyPaid", label: "alreadyPaid" },
        { key: "group", label: "group" },
        { key: "created_at", label: "created_at" },
        { key: "manager", label: "manager" },
    ];


    const { orders, totalPages, isLoading, error } = useAppSelector(state => state.orders);
    const { groups } = useAppSelector(state => state.groups);
    const { userData } = useAppSelector(state => state.user);
    const { darkMode } = useThemeContext();

    const id = userData?.id;
    const username = userData?.username || "";

    const page = Number(searchParams.get("page")) || 1;
    const order = searchParams.get("order") || "-id";

    const [filters, setFilters] = useState({
        course: searchParams.get("course") || "",
        courseFormat: searchParams.get("course_format") || "",
        courseType: searchParams.get("course_type") || "",
        status: searchParams.get("status") || "",
        name: searchParams.get("name") || "",
        surname: searchParams.get("surname") || "",
        phone: searchParams.get("phone") || "",
        email: searchParams.get("email") || "",
        group: searchParams.get("group") || "",
        age: searchParams.get("age") || "",
        alreadyPaid: searchParams.get("alreadyPaid") || "",
        sum: searchParams.get("sum") || "",
        created_at_after: searchParams.get("created_at_after") || "",
        created_at_before: searchParams.get("created_at_before") || "",
        manager: searchParams.get("manager") || "",
    });
    const prevFiltersRef = useRef<typeof filters>(filters);

    const debouncedUpdateFilters = useCallback(
        debounce((newFilters: typeof filters) => {
            const newParams = new URLSearchParams();

            let filtersChanged = Object.keys(newFilters).some(
                (key) => newFilters[key as keyof typeof filters] !== prevFiltersRef.current[key as keyof typeof filters]
            );
            if (filtersChanged) {
                newParams.set("page", "1");
            } else {
                newParams.set("page", String(page));
            }

            newParams.set("order", order);

            Object.entries(newFilters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    if (key === "courseFormat") newParams.set("course_format", String(value));
                    else if (key === "courseType") newParams.set("course_type", String(value));
                    else if (key === "manager") newParams.set("manager", String(value));
                    else newParams.set(key, String(value));
                }
            });

            if (filtersChanged) {
                setSearchParams(newParams);
                prevFiltersRef.current = newFilters;
            }
        }, 500),
        [order, page]
    );


    useEffect(() => {
        debouncedUpdateFilters(filters);
    }, [filters, debouncedUpdateFilters]);

    useEffect(() => {
        dispatch(orderSliceActions.fetchOrders({
            page,
            order,
            filters: {
                course: searchParams.get("course") || "",
                course_format: searchParams.get("course_format") || "",
                course_type: searchParams.get("course_type") || "",
                status: searchParams.get("status") || "",
                name: searchParams.get("name") || "",
                surname: searchParams.get("surname") || "",
                phone: searchParams.get("phone") || "",
                email: searchParams.get("email") || "",
                group: searchParams.get("group") || "",
                age: searchParams.get("age") || "",
                alreadyPaid: searchParams.get("alreadyPaid") || "",
                sum: searchParams.get("sum") || "",
                created_at_after: searchParams.get("created_at_after") || "",
                created_at_before: searchParams.get("created_at_before") || "",
                manager: searchParams.get("manager") || "",
            },
        }));
        dispatch(groupSliceActions.getAllGroups());
    }, [dispatch, page, order, searchParamsString]);

    const handleSort = (column: string) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            const currentOrder = newParams.get("order") || "-id";

            let newOrder: string;
            if (currentOrder === column) {
                newOrder = `-${column}`;
            } else if (currentOrder === `-${column}`) {
                newOrder = column;
            } else {
                newOrder = column;
            }

            newParams.set("order", newOrder);
            return newParams;
        });
    };


    const handleFilterChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({
            ...prev,
            [key]: event.target.value,
        }));
    };

    const handleCheckboxChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({
            ...prev,
            [key]: event.target.checked ? username : "",
        }));
    };

    const handleDateChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({
            ...prev,
            [key]: event.target.value,
        }));
    };

    const handlePageChange = (newPage: number) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set("page", newPage.toString());
            return newParams;
        });
    };

    const handleResetFilters = () => {
        setFilters({
            course: "",
            courseFormat: "",
            courseType: "",
            status: "",
            name: "",
            surname: "",
            phone: "",
            email: "",
            group: "",
            age: "",
            alreadyPaid: "",
            sum: "",
            created_at_after: "",
            created_at_before: "",
            manager: "",
        });
        setSearchParams(new URLSearchParams({ page: "1", order: "-id" }));
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "90vh",

        }}>
            <OrderFilters
                filters={filters}
                username={username}
                userId={id}
                groups={groups}
                handleFilterChange={handleFilterChange}
                handleDateChange={handleDateChange}
                handleResetFilters={handleResetFilters}
                setSearchParams={setSearchParams}
                handleCheckboxChange={handleCheckboxChange}
            />

            <LoaderOrError isLoading={isLoading} error={error}>
                {!isLoading && !error && (
                    <Box sx={{
                        flexGrow: 1,
                        overflowY: "auto",
                    }}>
                        <Table
                            sx={{
                                minWidth: 900,
                                "& td, & th": { padding: "8px 12px", fontSize: "16px" },
                                "& th": {
                                    backgroundColor: darkMode ? "#3e37a9" : "#0d254c",
                                    color: "white",
                                    textAlign: "left"
                                },
                                "& tr:nth-of-type(even)": { backgroundColor: darkMode ? "#28293D" : "#f2f2f2" },
                                "& tr:hover": { backgroundColor: darkMode ? "#282e56" : "#ddd" }
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    {columns.map(({ key, label }) => (
                                        <TableCell
                                            key={key}
                                            onClick={() => handleSort(key)}
                                            sx={{
                                                backgroundColor: darkMode ? "#3e37a9" : "#091a35",
                                                color: "white",
                                                cursor: "pointer",
                                                userSelect: "none",
                                                "&:hover": {
                                                    backgroundColor: darkMode ? "#4c44d4" : "#12335d",
                                                },
                                                fontWeight: "bold",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            <Box display="flex" alignItems="center" gap={1}>
                                                {label}
                                                {order === key ? (
                                                    <ArrowDropUp />
                                                ) : order === `-${key}` ? (
                                                    <ArrowDropDown />
                                                ) : null}
                                            </Box>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map(order => (
                                    <OrderInfo key={order.id} order={order} />
                                ))}
                            </TableBody>
                        </Table>

                    </Box>
                )}

                <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />

            </LoaderOrError>
        </Box>
    );
};

export { OrdersTable };