import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services';
import { AxiosError } from 'axios';
import { IUserPagination, IUser, IError } from '../../interfaces';
import { userService } from '../../services/user.service';

interface IState {
    users: IUser[],
    page: number,
    totalItems: number,
    totalPages: number,
    isLoading: boolean,
    errors: IError | null,
}

const initialState: IState = {
    users: [],
    page: 1,
    totalItems: 0,
    totalPages: 0,
    isLoading: false,
    errors: null,
};

const getAllUsers = createAsyncThunk<
        IUserPagination<IUser[]>,
    { page: number; order?: string; filters?: Record<string, string | boolean> }
    >(
    'usersSlice/getAllUsers',
    async ({page}, { rejectWithValue }) => {
        try {
            const { data } = await userService.getAll(page);
            return data;
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data || { message: "Unknown error" });
        }
    }
);

const createManager = createAsyncThunk(
    'users/createManager',
    async (userData: Partial<IUser>, { rejectWithValue }) => {
        try {
            const { data } = await authService.createManager(userData);
            return data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || 'Error creating manager');
        }
    }
);

const blockUser = createAsyncThunk(
    'users/blockUser',
    async (userId: number, { rejectWithValue }) => {
        try {
            const { data } = await userService.blockUser(userId);
            return data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || 'Error blocking user');
        }
    }
);

const unblockUser = createAsyncThunk(
    'users/unblockUser',
    async (userId: number, { rejectWithValue }) => {
        try {
            const { data } = await userService.unblockUser(userId);
            return data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || 'Error unblocking user');
        }
    }
);


const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setPage(state, action) {
            state.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true;
                state.errors = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                const { data, total_pages } = action.payload;
                state.users = data;
                state.page = action.meta.arg.page;
                state.totalPages = total_pages;
                state.totalItems = action.payload.total_items;
                state.isLoading = false;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action.payload;
            })


            .addCase(createManager.fulfilled, (state, action) => {
                const newUser = action.payload;

                state.users.unshift(newUser);
                state.totalItems += 1;
            })
            .addCase(createManager.rejected, (state, action) => {
                state.errors = action.payload;
            })


            .addCase(blockUser.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.users.findIndex(user => user.id === updated.id);
                if (index !== -1) {
                    state.users[index] = updated;
                }
            })
            .addCase(blockUser.rejected, (state, action) => {
                state.errors = action.payload;
            })

            .addCase(unblockUser.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.users.findIndex(user => user.id === updated.id);
                if (index !== -1) {
                    state.users[index] = updated;
                }
            })
            .addCase(unblockUser.rejected, (state, action) => {
                state.errors = action.payload;
            });
    },
});

const { reducer: usersReducer } = usersSlice;
const usersActions = {
    getAllUsers,
    createManager,
    blockUser,
    unblockUser,
};

export { usersReducer, usersActions };
