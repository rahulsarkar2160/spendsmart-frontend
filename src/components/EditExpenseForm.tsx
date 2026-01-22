import React, { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { editExpense } from "../features/expenses/expensesSlice";
import toast from "react-hot-toast";

interface Props {
    expense: {
        _id: string;
        title: string;
        amount: number;
        category: string;
        date: string;
        note?: string;
    };
    onClose: () => void;
    onSuccess: () => void;
}

const EditExpenseForm = ({ expense, onClose, onSuccess }: Props) => {
    const dispatch = useAppDispatch();

    // 🔒 Prevent double submit
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 📸 Initial snapshot (for dirty check)
    const initialForm = {
        title: expense.title,
        amount: String(expense.amount),
        category: expense.category,
        date: expense.date.slice(0, 10),
        note: expense.note || "",
    };

    // 📝 Editable form state
    const [form, setForm] = useState(initialForm);

    // 🧠 Dirty-state detection
    const isDirty =
        form.title !== initialForm.title ||
        form.amount !== initialForm.amount ||
        form.category !== initialForm.category ||
        form.date !== initialForm.date ||
        form.note !== initialForm.note;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isDirty || isSubmitting) return;

        setIsSubmitting(true);

        try {
            await dispatch(
                editExpense({
                    id: expense._id,
                    data: {
                        title: form.title,
                        amount: Number(form.amount),
                        category: form.category,
                        date: form.date,
                        note: form.note || undefined,
                    },
                })
            );

            toast.success("Expense updated");
            onSuccess();
        } catch {
            toast.error("Failed to update expense");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Expense</h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        name="title"
                        className="w-full border p-2 rounded"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="amount"
                        type="number"
                        className="w-full border p-2 rounded"
                        value={form.amount}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="category"
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
                            disabled={!isDirty || isSubmitting}
                            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : isDirty
                                    ? "Save Changes"
                                    : "No Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditExpenseForm;
