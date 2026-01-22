import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
}

interface AuthState {
    token: string | null;
    user: User | null;
    loading: boolean;

}

const initialState: AuthState = {
    token: localStorage.getItem("token"),
    user: null,
    loading: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ token: string; user: User }>
        ) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.loading = false;
            localStorage.setItem("token", action.payload.token);
        },

        setAuthReady: (state) => {
            state.loading = false;
        },

        logout: (state) => {
            state.token = null;
            state.user = null;
            state.loading = false;
            localStorage.removeItem("token");
        },

    },
});

export const { setCredentials, setAuthReady, logout } = authSlice.actions;
export default authSlice.reducer;
