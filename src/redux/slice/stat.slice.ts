import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderService } from '../../services/order.service';
import {IOrderStats} from '../../interfaces';

interface OrderStatsState {
    stats: IOrderStats | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrderStatsState = {
    stats: null,
    loading: false,
    error: null
};

const fetchOrderStats = createAsyncThunk(
    'orderStats/fetchOrderStats',
    async (_, { rejectWithValue }) => {
        try {
            const { data }: { data: any } = await orderService.getAllStats();

            const mappedStats: IOrderStats = {
                total: data.total || 0,
                New: data["New"] || 0,
                in_work: data["In work"] || 0,
                aggre: data["Aggre"] || 0,
                disaggre: data["Disaggre"] || 0,
                dubbing: data["Dubbing"] || 0,
                null: data["null"] || 0,
            };
            return mappedStats;
        } catch (e: any) {
            return rejectWithValue(e.response?.data?.detail || 'Failed to fetch stats');
        }
    }
);

const slice = createSlice({
    name: 'orderStats',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchOrderStats.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchOrderStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

const { actions, reducer: orderStatsSliceReducer } = slice;
const orderStatsSliceActions = {
    ...actions,
    fetchOrderStats
};

export {
    orderStatsSliceActions,
    orderStatsSliceReducer
};
