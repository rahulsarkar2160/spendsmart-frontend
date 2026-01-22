import api from "./axiosInstance";

export const fetchExpenses = async (
    page = 1,
    limit = 10,
    filters?: {
        category?: string;
        month?: string;
        sort?: "asc" | "desc";
    }
) => {
    const res = await api.get("/expenses", {
        params: {
            page,
            limit,
            ...filters,
        },
    });

    return res.data; // includes expenses, page, pages, total
};



export const createExpense = async (expense: {
    title: string;
    amount: number;
    category: string;
    date: string;
    note?: string;
}) => {
    const res = await api.post("/expenses", expense);
    return res.data;
};

export const updateExpense = async (
    id: string,
    expense: {
        title: string;
        amount: number;
        category: string;
        date: string;
        note?: string;
    }
) => {
    const res = await api.put(`/expenses/${id}`, expense);
    return res.data;
};

export const deleteExpense = async (id: string) => {
    const res = await api.delete(`/expenses/${id}`);
    return res.data;
};
