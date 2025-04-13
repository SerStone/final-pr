import { AxiosError } from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { IError, IGroup, IGroupPagination, IOrder, IPagination } from "../../interfaces";
import { orderService } from "../../services";

// Інтерфейс для стану
interface IState {
    groups: IGroup[],
    orders: IOrder[],
    page: number,
    totalItems: number,
    totalPages: number,
    isLoading: boolean,
    errors: IError | null,
}

// Початковий стан
const initialState: IState = {
    groups: [],
    orders: [],
    page: 1,
    totalItems: 0,
    totalPages: 0,
    isLoading: false,
    errors: null,
};

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
    name: 'commentSlice',
    initialState,
    reducers: {
        setPage(state, action) {
            state.page = action.payload;
        },
    },
    extraReducers: builder =>
        builder
            // Comment
            .addCase(addCommentToOrder.fulfilled, (state, action) => {
                state.orders = state.orders.map(order =>
                    order.id === action.payload.id ? action.payload : order
                );
            })
            .addCase(deleteCommentFromOrder.fulfilled, (state, action) => {
                const { orderId, commentId } = action.meta.arg;
                const order = state.orders.find(order => order.id === orderId);

                if (order) {
                    order.comments = order.comments.filter(comment => comment.id !== commentId);
                }

                state.isLoading = false;
            })
            .addCase(deleteCommentFromOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCommentFromOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action.payload;
            })
});

// **Експорт екшенів і редюсера**
const { actions, reducer: commentReducer } = slice;
const commentActions = {
    ...actions,
    addCommentToOrder,
    deleteCommentFromOrder
};

export {
    commentReducer,
    commentActions
}