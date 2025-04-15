import { AxiosError } from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../../services";
import { IOrder } from "../../interfaces";

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

const updateOrder = createAsyncThunk<IOrder, { orderId: number; updatedData: Partial<IOrder> }>(
    "orders/updateOrder",
    async ({ orderId, updatedData }, { rejectWithValue }) => {
        try {
            const { data } = await orderService.updateById(orderId, updatedData);
            return data;
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data || { message: "Помилка оновлення замовлення" });
        }
    }
);

const addCommentToOrder = createAsyncThunk<IOrder, { orderId: number, text: string }>(
    'commentSlice/addCommentToOrder',
    async ({ orderId, text }, { rejectWithValue }) => {
        try {
            const { data } = await orderService.addComment(orderId, text);
            return data;
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data || { message: "Unknown error" });
        }
    }
);

const deleteCommentFromOrder = createAsyncThunk<IOrder, { orderId: number, commentId: number }>(
    'commentSlice/deleteCommentFromOrder',
    async ({ orderId, commentId }, { rejectWithValue }) => {
        try {
            await orderService.deleteById(orderId, commentId);
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data || { message: "Unknown error" });
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
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(addCommentToOrder.fulfilled, (state, action) => {
                    const updatedOrder = action.payload;
                    const index = state.orders.findIndex(order => order.id === updatedOrder.id);
                    if (index !== -1) {
                        state.orders[index] = updatedOrder;
                    }
                })
            .addCase(deleteCommentFromOrder.fulfilled, (state, action) => {
                const { orderId, commentId } = action.meta.arg;
                const order = state.orders.find(order => order.id === orderId);
                if (order) {
                    order.comments = order.comments.filter(comment => comment.id !== commentId);
                }
            });
    },
});

const { actions, reducer: orderSliceReducer } = slice;

const orderSliceActions = {
    ...actions,
    fetchOrders,
    updateOrder,
    addCommentToOrder,
    deleteCommentFromOrder
};

export {
    orderSliceActions,
    orderSliceReducer
};
