import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";

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
    async (_, { getState, rejectWithValue }) => {
        const token = getState().auth.token;

        try {
            const res = await fetch("/api/admin/stats", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch admin stats");
            }

            return (await res.json()) as AdminStats;
        } catch (err) {
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
    async (_, { getState, rejectWithValue }) => {
        const token = getState().auth.token;

        try {
            const res = await fetch("/api/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await res.json();
            return Array.isArray(data) ? data : data.users ?? [];
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
    async (userId, { getState, rejectWithValue }) => {
        const token = getState().auth.token;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to delete user");
            }

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

// 5️⃣ EXPORT
export default adminSlice.reducer;
