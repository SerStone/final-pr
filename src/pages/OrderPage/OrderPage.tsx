import { Box } from "@mui/material";
import { Header } from "../../components";
import {OrdersTable} from "../../components/OrderTable/OrderClone";

const OrdersPage = () => {
    return (
        <Box sx={{ width: "100vw", minHeight: "100vh", overflowX: "hidden" }}>
            <OrdersTable />
        </Box>
    );
};

export {OrdersPage};