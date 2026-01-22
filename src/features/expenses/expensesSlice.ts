import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
} from "../../api/expensesApi";



export interface Expense {
    _id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    note?: string;
}

interface ExpensesState {
    items: Expense[];
    loading: boolean;
    error: string | null;
    page: number;
    pages: number;
}


const initialState: ExpensesState = {
    items: [],
    loading: false,
    error: null,
    page: 1,
    pages: 1,
};


// Async thunk to call API
export const getExpenses = createAsyncThunk(
    "expenses/getExpenses",
    async (
        {
            page = 1,
            filters,
        }: {
            page?: number;
            filters?: {
                category?: string;
                month?: string;
                sort?: "asc" | "desc";
            };
        } = {}
    ) => {
        const data = await fetchExpenses(page, 10, filters);
        return data;
    }
);



export const addExpense = createAsyncThunk(
    "expenses/addExpense",
    async (expense: {
        title: string;
        amount: number;
        category: string;
        date: string;
        note?: string;
    }, { rejectWithValue }) => {
        try {
            const data = await createExpense(expense);
            return data; // newly created expense
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to add expense"
            );
        }
    }
);

export const editExpense = createAsyncThunk(
    "expenses/editExpense",
    async (
        {
            id,
            data,
        }: {
            id: string;
            data: {
                title: string;
                amount: number;
                category: string;
                date: string;
                note?: string;
            };
        },
        { rejectWithValue }
    ) => {
        try {
            const res = await updateExpense(id, data);
            return res;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to update expense"
            );
        }
    }
);

export const removeExpense = createAsyncThunk(
    "expenses/removeExpense",
    async (id: string, { rejectWithValue }) => {
        try {
            await deleteExpense(id);
            return id; // return id so we can remove it from Redux
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to delete expense"
            );
        }
    }
);


const expensesSlice = createSlice({
    name: "expenses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.expenses;
                state.page = action.payload.page;
                state.pages = action.payload.totalPages;
            })

            .addCase(getExpenses.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addExpense.pending, (state) => {
                state.loading = true;
            })
            .addCase(addExpense.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addExpense.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.map((exp) =>
                    exp._id === action.payload._id ? action.payload : exp
                );
            })
            .addCase(removeExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((exp) => exp._id !== action.payload);
            });


    },
});

export default expensesSlice.reducer;
