import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAdminStats, fetchAdminUsers, deleteAdminUser, } from "../../features/admin/adminSlice";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import Navbar from "../../components/Navbar";

const AdminDashboard = () => {
    const dispatch = useAppDispatch();

    const { stats, users, loading, error } = useAppSelector(
        (state) => state.admin
    );

    const categoryData =
        stats && stats.categoryTotals
            ? Object.entries(stats.categoryTotals).map(
                ([category, total]) => ({
                    name: category,
                    value: total,
                })
            )
            : [];


    const monthlyData = stats?.monthlyTrends ?? [];




    useEffect(() => {
        dispatch(fetchAdminStats());
        dispatch(fetchAdminUsers());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

                {loading && <p>Loading admin stats...</p>}

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {stats && (
                    <>
                        {/* Stat cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded shadow">
                                <p className="text-sm text-gray-500">Total Users</p>
                                <p className="text-2xl font-bold">
                                    {stats.totalUsers}
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded shadow">
                                <p className="text-sm text-gray-500">
                                    Total Expenses
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.totalExpenses}
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded shadow">
                                <p className="text-sm text-gray-500">
                                    Categories
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.categoryTotals
                                        ? Object.keys(stats.categoryTotals).length
                                        : 0}
                                </p>

                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {/* Monthly Trends */}
                            <div className="bg-white p-4 rounded shadow">
                                <h3 className="text-sm text-gray-500 mb-4">
                                    Monthly Expense Trends
                                </h3>

                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={monthlyData}>
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Category Distribution */}
                            <div className="bg-white p-4 rounded shadow">
                                <h3 className="text-sm text-gray-500 mb-4">
                                    Expense Distribution by Category
                                </h3>

                                {categoryData.length === 0 ? (
                                    <p className="text-sm text-gray-400">No data</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                dataKey="value"
                                                nameKey="name"
                                                outerRadius={100}
                                                label
                                            >
                                                {categoryData.map((_, index) => (
                                                    <Cell
                                                        key={index}
                                                        fill={[
                                                            "#3b82f6",
                                                            "#22c55e",
                                                            "#f97316",
                                                            "#a855f7",
                                                            "#ef4444",
                                                        ][index % 5]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                        {/* User Management */}
                        <div className="mt-12">
                            <h2 className="text-xl font-semibold mb-4">
                                User Management
                            </h2>

                            {users.length === 0 ? (
                                <p className="text-sm text-gray-500">No users found.</p>
                            ) : (
                                <div className="overflow-x-auto bg-white rounded shadow">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-gray-100 text-gray-600">
                                            <tr>
                                                <th className="text-left px-4 py-2">Name</th>
                                                <th className="text-left px-4 py-2">Email</th>
                                                <th className="text-left px-4 py-2">Role</th>
                                                <th className="text-right px-4 py-2">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {Array.isArray(users) && users.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="border-t"
                                                >
                                                    <td className="px-4 py-2">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs ${user.role === "ADMIN"
                                                                ? "bg-purple-100 text-purple-700"
                                                                : "bg-blue-100 text-blue-700"
                                                                }`}
                                                        >
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-right">
                                                        {user.role === "ADMIN" ? (
                                                            <span className="text-xs text-gray-400">
                                                                —
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            `Delete user ${user.email}?`
                                                                        )
                                                                    ) {
                                                                        dispatch(
                                                                            deleteAdminUser(
                                                                                user.id
                                                                            )
                                                                        );
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:underline text-sm"
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                    </>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;