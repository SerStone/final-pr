import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
    darkMode: boolean;
}

const initialState: ThemeState = {
    darkMode: false, // Початкове значення
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;
        },
        setTheme: (state, action: PayloadAction<boolean>) => {
            state.darkMode = action.payload;
        },
    },
});

// Деструктуризуємо actions і reducer
const { actions, reducer: themeReducer } = themeSlice;

// Правильне створення themeActions без дублювання
const themeActions = {
    ...actions, // Додаємо всі екшени з slice

};

export { themeActions, themeReducer };