import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../store/hooks";
import { addExpense } from "../features/expenses/expensesSlice";

type Props = {
    onClose: () => void;
    onSuccess: () => void;
};

const AddExpenseForm = ({ onClose, onSuccess }: Props) => {
    const dispatch = useAppDispatch();

    // 🔒 Prevent double submit
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        title: "",
        amount: "",
        category: "",
        date: "",
        note: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            await dispatch(
                addExpense({
                    title: form.title,
                    amount: Number(form.amount),
                    category: form.category,
                    date: form.date,
                    note: form.note || undefined,
                })
            );

            toast.success("Expense added");
            onSuccess(); // parent handles refresh + close
        } catch {
            toast.error("Failed to add expense");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add Expense</h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        name="title"
                        placeholder="Title"
                        className="w-full border p-2 rounded"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="amount"
                        type="number"
                        placeholder="Amount"
                        className="w-full border p-2 rounded"
                        value={form.amount}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="category"
                        placeholder="Category (e.g. Food, Travel)"
                        className="w-full border p-2 rounded"
                        value={form.category}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="date"
                        type="date"
                        className="w-full border p-2 rounded"
                        value={form.date}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="note"
                        placeholder="Note (optional)"
                        className="w-full border p-2 rounded"
                        value={form.note}
                        onChange={handleChange}
                    />

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            {isSubmitting ? "Adding..." : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseForm;
