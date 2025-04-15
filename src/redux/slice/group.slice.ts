import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../../services";
import { IGroup, IGroupPagination } from "../../interfaces";
import { AxiosError } from "axios";

interface GroupsState {
    groups: IGroup[];
    totalPages: number;
    currentPage: number;
    isLoading: boolean;
    errors: string | null;
}

const initialState: GroupsState = {
    groups: [],
    totalPages: 0,
    currentPage: 1,
    isLoading: false,
    errors: null,
};

const getAllGroups = createAsyncThunk<IGroupPagination<IGroup>, void>(
    "groups/getAllGroups",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await orderService.getGroups();
            return data;
        } catch (e) {
            return rejectWithValue("Failed to fetch groups");
        }
    }
);

const createGroup = createAsyncThunk<IGroup, string>(
    "groups/createGroup",
    async (groupName, { rejectWithValue }) => {
        try {
            const { data } = await orderService.createGroup(groupName);
            return data;
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data || { message: "Unknown error" });
        }
    }
);

const slice = createSlice({
    name: "groups",
    initialState,
    reducers: {
        setPage(state, action) {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllGroups.fulfilled, (state, action) => {
                state.groups = action.payload.data;
                state.totalPages = action.payload.total_pages;
                state.isLoading = false;
            })
            .addCase(getAllGroups.pending, (state) => {
                state.isLoading = true;
                state.errors = null;
            })
            .addCase(getAllGroups.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action.payload as string;
            })

            .addCase(createGroup.fulfilled, (state, action) => {
                state.groups = [...state.groups, action.payload];
            })
            .addCase(createGroup.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action.payload as string;
            });
    },
});

const { actions, reducer: groupSliceReducer } = slice;
const groupSliceActions = {
    ...actions,
    getAllGroups,
    createGroup,

};

export {
    groupSliceActions,
    groupSliceReducer
};
