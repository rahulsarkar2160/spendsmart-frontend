import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import api from "../../api/axiosInstance";


// 2️⃣ TYPES / INTERFACES
interface AdminStats {
    totalUsers: number;
    totalExpenses: number;
    categoryTotals: Record<string, number>;
    monthlyTrends: { month: string; total: number }[];
}

interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
}

interface AdminState {
    stats: AdminStats | null;
    users: AdminUser[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    stats: null,
    users: [],
    loading: false,
    error: null,
};

export const fetchAdminStats = createAsyncThunk<
    AdminStats,
    void,
    { state: RootState }
>(
    "admin/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/admin/stats");
            return res.data;
        } catch {
            return rejectWithValue("Unable to load admin stats");
        }
    }
);


export const fetchAdminUsers = createAsyncThunk<
    AdminUser[],
    void,
    { state: RootState }
>(
    "admin/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/admin/users");

            // backend usually returns { users: [...] }
            return Array.isArray(res.data)
                ? res.data
                : res.data.users ?? [];
        } catch {
            return rejectWithValue("Unable to load users");
        }
    }
);


export const deleteAdminUser = createAsyncThunk<
    string,
    string,
    { state: RootState }
>(
    "admin/deleteUser",
    async (userId, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/users/${userId}`);
            return userId;
        } catch {
            return rejectWithValue("Unable to delete user");
        }
    }
);



const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // 🔹 Admin stats
            .addCase(fetchAdminStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchAdminStats.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) || "Failed to load admin stats";
            })

            // 🔹 Admin users
            .addCase(fetchAdminUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAdminUsers.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) || "Failed to load users";
            })

            // 🔹 Delete user
            .addCase(deleteAdminUser.fulfilled, (state, action) => {
                state.users = state.users.filter(
                    (u) => u.id !== action.payload
                );
            });
    },


});

export default adminSlice.reducer;
