import {combineReducers, configureStore} from "@reduxjs/toolkit";

import {
    userReducer,
    groupSliceReducer,
    usersReducer,

    orderSliceReducer,
    orderStatsSliceReducer,
} from "./slice";

const rootReducer = combineReducers({
    user: userReducer,
    orders: orderSliceReducer,
    users: usersReducer,
    groups: groupSliceReducer,
    stats: orderStatsSliceReducer,
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
