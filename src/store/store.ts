import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import expensesReducer from "../features/expenses/expensesSlice";
import adminReducer from "../features/admin/adminSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        expenses: expensesReducer,
        admin: adminReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

