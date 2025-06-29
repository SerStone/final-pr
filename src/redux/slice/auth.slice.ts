import {createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { urls } from '../../constants';
import {authService, axiosService } from '../../services';


const getUser = createAsyncThunk("user/getUser", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosService.get(urls.auth.me);
        localStorage.setItem("user", JSON.stringify(data));
        return data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data || "Помилка отримання користувача");
        }
        return rejectWithValue("Невідома помилка");
    }
});

const sendActivationMail = createAsyncThunk<
    string,
    number,
    { rejectValue: string }
    >(
    "user/sendActivationMail",
    async (userId, { rejectWithValue }) => {
        try {
            const { activation_link } = await authService.sendActivationMail(userId);
            return activation_link;
        } catch (e) {
            if (axios.isAxiosError(e)) return rejectWithValue(e.response?.data || "Activation error");
            return rejectWithValue("Unknown error");
        }
    }
);


const sendRecoveryMail = createAsyncThunk(
    "user/sendRecoveryMail",
    async (email: string, { rejectWithValue }) => {
        try {
          const { recovery_link } = await authService.sendRecoveryMail(email);
          return recovery_link;
        } catch (e) {
            if (axios.isAxiosError(e)) return rejectWithValue(e.response?.data);
            return rejectWithValue("Unknown error");
        }
    }
);

const authSlice = createSlice({
    name: "user",
    initialState: {
        userData: JSON.parse(localStorage.getItem("user")) || null,
        accessToken: localStorage.getItem("access") || null,
        refreshToken: localStorage.getItem("refresh") || null,
        name: "Guest",
        avatar: null,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setTokens: (state, action) => {
            state.accessToken = action.payload.access;
            state.refreshToken = action.payload.refresh;
        },
        logout: (state) => {
            state.userData = null;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem("user");
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
        },

    },
    extraReducers: (builder) => {
        builder.addCase(getUser.fulfilled, (state, action) => {
            state.userData = action.payload;
        });
    },
});

const { actions, reducer: userReducer } = authSlice;

const userActions = {
    ...actions,
    getUser,
    sendActivationMail,
    sendRecoveryMail

};

export { userActions, userReducer };