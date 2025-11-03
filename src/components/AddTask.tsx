// src/components/AddTask.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAddTaskMutation, useUpdateTaskMutation } from "../features/tasks/taskApi";
import toast from "react-hot-toast";

interface AddTaskProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  existingTask?: any; // optional for edit mode
}

const AddTask = ({ isOpen, onClose,existingTask}: AddTaskProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Pending" | "In Progress" | "Done">("Pending");
  const [deadline, setDeadline] = useState("");
  const [addTask, { isLoading: isAdding }] = useAddTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();


  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setDeadline("");
  };

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description);
      setStatus(existingTask.status);
      setDeadline(existingTask.deadline);
    } else {
      setTitle("");
      setDescription("");
      setStatus("Pending");
      setDeadline("");
    }
  }, [existingTask]);

 
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = { title, description, status, deadline };
    try {
      if (existingTask) {
        await updateTask({ id: existingTask._id, ...taskData }).unwrap();
        resetForm();
        toast.success("Task updated successfully!");
      } else {
        await addTask(taskData).unwrap();
        toast.success("Task added successfully!");
      }

      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMsg = err?.data?.message || "Failed to save task.";
      toast.error(errorMsg);
      console.error("Task submit error:", err);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg p-6 backdrop-blur-md"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-2xl font-semibold mb-5 text-gray-800 dark:text-gray-100 text-center">
              {existingTask ? "✏️ Edit Task" : "📝 Add New Task"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter task title"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe your task..."
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "Pending" | "In Progress" | "Done")
                    }
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Deadline
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>

                <button
                    type="submit"
                    disabled={isAdding || isUpdating}
                    className={`px-5 py-2.5 rounded-lg font-medium text-white transition transform active:scale-95
                      ${isAdding || isUpdating
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                  >
                    {isAdding || isUpdating
                      ? existingTask
                        ? "Updating..."
                        : "Adding..."
                      : existingTask
                        ? "Update Task"
                        : "Add Task"}
                  </button>

              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddTask;
