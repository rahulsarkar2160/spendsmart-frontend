import type { Expense } from "../features/expenses/expensesSlice";

export const getTotalSpent = (expenses: Expense[]) => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
};

export const getCategoryTotals = (expenses: Expense[]) => {
    const map: Record<string, number> = {};

    expenses.forEach((exp) => {
        map[exp.category] = (map[exp.category] || 0) + exp.amount;
    });

    return Object.entries(map).map(([category, total]) => ({
        category,
        total,
    }));
};
