import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
} from "recharts";
import type { Expense } from "../features/expenses/expensesSlice";
import { getCategoryTotals } from "../utils/expenseAnalytics";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"];

const AnalyticsCharts = ({ expenses }: { expenses: Expense[] }) => {
    const categoryData = getCategoryTotals(expenses);

    if (categoryData.length === 0) {
        return (
            <div className="bg-white p-4 rounded shadow text-sm text-gray-500">
                No data for charts
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Pie Chart */}
            <div className="bg-white p-4 rounded shadow h-[350px]">
                <h3 className="text-sm text-gray-500 mb-2">Spending by Category</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            dataKey="total"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {categoryData.map((_, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-4 rounded shadow h-[350px]">
                <h3 className="text-sm text-gray-500 mb-2">Category Comparison</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="#2563eb" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
