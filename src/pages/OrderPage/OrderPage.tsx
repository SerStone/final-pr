import { Box } from "@mui/material";
import { Header, OrdersTable } from "../../components";


const OrdersPage = () => {
    return (
        <Box sx={{ width: "100vw", minHeight: "100vh",  overflow: "hidden", overflowX: "hidden" }}>
            <OrdersTable />
        </Box>
    );
};

export {OrdersPage};