import {combineReducers, configureStore} from "@reduxjs/toolkit";

import {
    userReducer,
    themeReducer,
    groupSliceReducer,
    usersReducer,

    orderSliceReducer,
    orderStatsSliceReducer,
    commentReducer
} from "./slice";

const rootReducer = combineReducers({
    theme: themeReducer,
    user: userReducer,
    orders: orderSliceReducer,
    users: usersReducer,
    groups: groupSliceReducer,
    stats: orderStatsSliceReducer,
    comments: commentReducer
});

const setupStore = () => configureStore({
    reducer: rootReducer
});

type RootState = ReturnType<typeof rootReducer>
type AppStore = ReturnType<typeof setupStore>
type AppDispatch = AppStore['dispatch']

export type {
    RootState,
    AppStore,
    AppDispatch
};

export {
    setupStore
};
