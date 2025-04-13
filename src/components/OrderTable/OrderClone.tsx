import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
    const { groups, isLoading: isGroupsLoading } = useAppSelector(state => state.groups);
    const { userData } = useAppSelector(state => state.user)

    const id = userData?.id;

    const page = Number(searchParams.get("page")) || 1;
    const courseFormat = searchParams.get("course_format") || "";
    const courseType = searchParams.get("course_type") || "";
    const course = searchParams.get("course") || "";
    const status = searchParams.get("status") || "";
    const name = searchParams.get("name") || "";
    const surname = searchParams.get("surname") || "";
    const phone = searchParams.get("phone") || "";
    const age = searchParams.get("age") || "";
    const alreadyPaid = searchParams.get("alreadyPaid") || "";
    const sum = searchParams.get("sum") || "";
    const order = searchParams.get("order") || "-id";
    const created_at_after = searchParams.get("created_at_after") || "";
    const created_at_before = searchParams.get("created_at_before") || "";
    const manager = searchParams.get("manager") || "";
    const email = searchParams.get("email") || "";
    const group = searchParams.get("group") || "";




    useEffect(() => {
        dispatch(orderSliceActions.fetchOrders({ page, order, filters: {
                course_format: courseFormat,
                course_type: courseType,
                status,
                name,
                phone,
                course,
                email,
                surname,
                group,
                age,
                alreadyPaid,
                sum,
                created_at_after,
                created_at_before,
                manager
            } }));
        dispatch(groupSliceActions.getAllGroups());
    }, [dispatch, page,group,email, order,course, courseFormat, courseType, status,phone, name, surname, age, alreadyPaid, sum, manager, created_at_after, created_at_before]);


    const handleSortToggle = () => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            const currentOrder = newParams.get("order") || "-id";
            const newOrder = currentOrder.startsWith("-") ? currentOrder.substring(1) : `-${currentOrder}`;
            newParams.set("order", newOrder);
            return newParams;
        });
    };

    const handleFilterChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set(key, event.target.value);
            newParams.set("page", "1");
            return newParams;
        });
    };

    const handleDateChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set(key, event.target.value);
            newParams.set("page", "1");
            return newParams;
        });
    };


    const handlePageChange = (newPage: number) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set("page", newPage.toString());
            return newParams;
        });
    };


    const handleResetFilters = () => {
        setSearchParams(new URLSearchParams({ page: "1" }));
    };

    const { darkMode } = useThemeContext();

    return (
        <Box sx={{ maxHeight: "80vh", overflowY: "auto", padding: 2 }}>

            {/* Фільтри */}
            <OrderFilters
                filters={{
                    course,
                    courseFormat,
                    courseType,
                    status,
                    name,
                    surname,
                    phone,
                    email,
                    group,
                    age,
                    alreadyPaid,
                    sum,
                    created_at_after,
                    created_at_before,
                    manager,
                }}
                userId={id}
                groups={groups}
                handleFilterChange={handleFilterChange}
                handleDateChange={handleDateChange}
                handleResetFilters={handleResetFilters}
                setSearchParams={setSearchParams}
            />

            <LoaderOrError isLoading={isLoading} error={error} />


            {!isLoading && !error && (
                <Box sx={{ display: "flex", flexDirection: "column" , justifyContent: "center" }}>

                    <Table sx={{
                        minWidth: 800,
                        borderRadius: "20%" ,
                        "& td, & th": { padding: "8px 12px", fontSize: "16px" },
                        "& th": { backgroundColor: darkMode ? "#3e37a9" : "#0d254c", color: "white", textAlign: "left" },
                        "& tr:nth-of-type(even)": {   backgroundColor: darkMode ? "#28293D" : "#f2f2f2" },
                        "& tr:hover": { backgroundColor: darkMode ? "#282e56" : "#ddd" }
                    }}>
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
                            {orders.map((order) => (
                                <OrderInfo key={order.id} order={order} />
                            ))}
                        </TableBody>
                    </Table>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </Box>
            )}
        </Box>
    );
};

export {OrdersTable};