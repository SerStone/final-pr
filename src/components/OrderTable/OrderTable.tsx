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
            const newParams = new URLSearchParams(searchParams.toString());

            const filtersChanged = Object.keys(newFilters).some(
                (key) => newFilters[key as keyof typeof filters] !== prevFiltersRef.current[key as keyof typeof filters]
            );

            Object.entries(newFilters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    if (key === "courseFormat") newParams.set("course_format", String(value));
                    else if (key === "courseType") newParams.set("course_type", String(value));
                    else if (key === "manager") newParams.set("manager", String(value));
                    else newParams.set(key, String(value));
                } else {
                    newParams.delete(key);
                }
            });

            if (filtersChanged) {
                newParams.set("page", "1");
            }

            newParams.set("order", order);
            setSearchParams(newParams);
            prevFiltersRef.current = newFilters;
        }, 500),
        [order, searchParams]
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
    }, [dispatch, page, order, searchParams]);

    const handleSortToggle = () => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            const currentOrder = newParams.get("order") || "-id";
            const newOrder = currentOrder.startsWith("-") ? currentOrder.slice(1) : `-${currentOrder}`;
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
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            onClick={handleSortToggle}
                                            sx={{
                                                backgroundColor: darkMode ? "#3e37a9" : "#091a35",
                                                color: "white",
                                                "&:hover": { backgroundColor: darkMode ? "#3e37a9" : "#091a35" },
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "5px"
                                            }}
                                        >
                                            id {order.startsWith("-") ? <ArrowDropDown /> : <ArrowDropUp />}
                                        </Button>
                                    </TableCell>
                                    <TableCell>name</TableCell>
                                    <TableCell>surname</TableCell>
                                    <TableCell>email</TableCell>
                                    <TableCell>phone</TableCell>
                                    <TableCell>age</TableCell>
                                    <TableCell>course</TableCell>
                                    <TableCell>format</TableCell>
                                    <TableCell>type</TableCell>
                                    <TableCell>status</TableCell>
                                    <TableCell>sum</TableCell>
                                    <TableCell>paid</TableCell>
                                    <TableCell>group</TableCell>
                                    <TableCell>date</TableCell>
                                    <TableCell>manager</TableCell>
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