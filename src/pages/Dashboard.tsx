import type { Expense } from "../features/expenses/expensesSlice";
import AddExpenseForm from "../components/AddExpenseForm";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getExpenses, removeExpense } from "../features/expenses/expensesSlice";
import EditExpenseForm from "../components/EditExpenseForm";
import Navbar from "../components/Navbar";
import { getTotalSpent, getCategoryTotals, } from "../utils/expenseAnalytics";
import AnalyticsCharts from "../components/AnalyticsCharts";
import toast from "react-hot-toast";


type ExpenseFilters = {
    category?: string;
    month?: string;
    sort?: "asc" | "desc";
};



const Dashboard = () => {
    const dispatch = useAppDispatch();
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [filters] = useState<ExpenseFilters>({});
    const [deletingId, setDeletingId] = useState<string | null>(null);


    const { items: expenses, loading, error, page, pages } = useAppSelector(
        (state) => state.expenses
    );

    const [showForm, setShowForm] = useState(false);

    const totalSpent = getTotalSpent(expenses);
    const categoryTotals = getCategoryTotals(expenses);


    useEffect(() => {
        dispatch(getExpenses({ page: 1, filters }));
    }, [dispatch, filters]);

    const handleExport = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("You must be logged in to export expenses");
                return;
            }

            const params = new URLSearchParams();
            if (filters.category) params.append("category", filters.category);
            if (filters.month) params.append("month", filters.month);
            if (filters.sort) params.append("sort", filters.sort);

            const response = await fetch(
                `/api/expenses/export?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Export failed");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "expenses.csv";
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);

            toast.success("Expenses exported successfully");
        } catch (err) {
            toast.error("Failed to export expenses");
        }
    };



    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Total Spent */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-sm text-gray-500">Total Spent</h3>
                    <p className="text-2xl font-bold text-blue-600">
                        ₹ {totalSpent}
                    </p>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white p-4 rounded shadow md:col-span-2">
                    <h3 className="text-sm text-gray-500 mb-2">By Category</h3>

                    {categoryTotals.length === 0 ? (
                        <p className="text-sm text-gray-400">No data</p>
                    ) : (
                        <div className="space-y-2">
                            {categoryTotals.map((cat) => (
                                <div
                                    key={cat.category}
                                    className="flex justify-between text-sm"
                                >
                                    <span>{cat.category}</span>
                                    <span className="font-medium">₹ {cat.total}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AnalyticsCharts expenses={expenses} />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Your Expenses</h1>

                <div className="flex gap-3 mb-4">
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        + Add Expense
                    </button>

                    <button
                        onClick={handleExport}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Export CSV
                    </button>
                </div>



                {loading && <p>Loading expenses...</p>}

                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                        {error}
                    </div>
                )}

                {expenses.length === 0 && !loading && (
                    <p className="text-gray-600">No expenses found. Add your first one!</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {expenses.map((exp) => (
                        <div
                            key={exp._id}
                            className="bg-white p-4 rounded shadow border"
                        >
                            <h2 className="font-semibold text-lg">{exp.title}</h2>
                            <p className="text-gray-700">₹ {exp.amount}</p>
                            <p className="text-sm text-gray-500">{exp.category}</p>
                            <p className="text-xs text-gray-400">
                                {exp.date
                                    ? new Date(exp.date).toLocaleDateString("en-GB")
                                    : "No date"}                        </p>
                            {exp.note && (
                                <p className="text-sm mt-2 text-gray-600">{exp.note}</p>
                            )}
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => setEditingExpense(exp)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={async () => {
                                        if (!confirm("Are you sure you want to delete this expense?")) return;

                                        setDeletingId(exp._id);

                                        try {
                                            await dispatch(removeExpense(exp._id));
                                            toast.success("Expense deleted");
                                        } catch {
                                            toast.error("Failed to delete expense");
                                        } finally {
                                            setDeletingId(null);
                                        }
                                    }}
                                    disabled={deletingId === exp._id}
                                    className="bg-red-600 text-white px-2 py-1 rounded text-sm disabled:opacity-50"
                                >
                                    {deletingId === exp._id ? "Deleting..." : "Delete"}
                                </button>


                            </div>

                        </div>
                    ))}
                </div>

                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() =>
                            dispatch(getExpenses({ page: page - 1, filters }))
                        }
                        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <span className="text-sm">
                        Page {page} of {pages}

                    </span>

                    <button
                        disabled={page === pages}
                        onClick={() =>
                            dispatch(getExpenses({ page: page + 1, filters }))
                        }
                        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

                {showForm && (
                    <AddExpenseForm
                        onClose={() => setShowForm(false)}
                        onSuccess={() => {
                            setShowForm(false);
                            dispatch(getExpenses({ page: 1, filters }));
                            toast.success("Expense added");
                        }}
                    />
                )}

                {editingExpense && (
                    <EditExpenseForm
                        expense={editingExpense}
                        onClose={() => setEditingExpense(null)}
                        onSuccess={() => {
                            setEditingExpense(null);
                            dispatch(getExpenses({ page, filters }));
                        }}
                    />
                )}




            </div>
        </div>
    );
};


export default Dashboard;
