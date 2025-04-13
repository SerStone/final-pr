import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../../services";
import { IOrder } from "../../interfaces";
import { AxiosError } from "axios";

interface OrdersState {
    orders: IOrder[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    isLoading: boolean;
    error: string | null;
}

const initialState: OrdersState = {
    orders: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    isLoading: false,
    error: null,
};

// Отримання замовлень
const fetchOrders = createAsyncThunk(
    "orders/fetchOrders",
    async (
        { page, order, filters }: { page: number; order?: string; filters?: Record<string, string> },
        { rejectWithValue }
    ) => {
        try {
            const response = await orderService.getAll(page, order, filters);
            return response.data;
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data || { message: "Unknown error" });
        }
    }
);

// Оновлення замовлення
const updateOrder = createAsyncThunk<IOrder, { orderId: number; updatedData: Partial<IOrder> }>(
    "orders/updateOrder",
    async ({ orderId, updatedData }, { rejectWithValue }) => {
        try {
            const { data } = await orderService.updateById(orderId, updatedData);
            return data; // приходить оновлений ордер
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data || { message: "Помилка оновлення замовлення" });
        }
    }
);

const slice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.currentPage = action.payload;
        },
        replaceOrder: (state, action) => {
            const index = state.orders.findIndex(order => order.id === action.payload.id);
            if (index !== -1) {
                state.orders[index] = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload.data;
                state.totalItems = action.payload.total_items;
                state.totalPages = action.payload.total_pages;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.orders.findIndex(order => order.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
                // якщо ордер був відфільтрований і не присутній, не додаємо його
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

const { actions, reducer: orderSliceReducer } = slice;

const orderSliceActions = {
    ...actions,
    fetchOrders,
    updateOrder,
};

export {
    orderSliceActions,
    orderSliceReducer
};
