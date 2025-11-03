import { useState, useMemo, useRef, useEffect } from "react";
import AddTask from "../components/AddTask";
import "../index.css";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import { useDeleteTaskMutation, useGetTasksQuery } from "../features/tasks/taskApi";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Done";
  deadline: string;
}

const sortOptions = [
  "Newest",
  "Oldest",
  "Deadline (Soonest)",
  "Deadline (Latest)"
];

const Dashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const { data: { tasks = [] } = {}, isLoading, isError, refetch } = useGetTasksQuery();
  const [deleteTask] = useDeleteTaskMutation();
  const [editingTask, setEditingTask] = useState(null);
    console.log(tasks)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEdit = (task:any) => {
      setEditingTask(task);
      setIsDialogOpen(true);
    };
    const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };
 
  const [filter, setFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Newest");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // --- Close dropdown when clicking outside ---
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;

  // --- Filtering + Sorting ---
  const filteredTasks = useMemo(() => {
    const visibleTasks =
      filter === "All" ? tasks : tasks.filter((t:Task) => t.status === filter);

    const sorted = [...visibleTasks].sort((a, b) => {
      if (sortBy === "Deadline (Soonest)")
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (sortBy === "Deadline (Latest)")
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      if (sortBy === "Oldest") return a.id - b.id;
      return b.id - a.id;
    });

    return sorted;
  }, [tasks, filter, sortBy]);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete._id).unwrap();
      toast.success("Task deleted successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to delete task!");
      console.log(error)
    } finally {
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  useEffect(() => {
    if (isLoading) {
      console.log("Fetching tasks...");
    }

    if (isError) {
      toast.error("Failed to fetch tasks. Please try again later.");
    }
  }, [isLoading, isError]);

  return (
    <>
      <Navbar onAddTaskClick={() => setIsDialogOpen(true)} />
      <div className="min-h-screen text-gray-800 px-4 sm:px-8 md:px-16 py-2 transition">

        <div className="flex flex-wrap items-center justify-between mt-6 mb-8 gap-4">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-900">Your Tasks</h1>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {["All", "Pending", "In Progress", "Done"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm font-medium rounded-full border transition ${
                  filter === status
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between w-48 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg 
              bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 
              hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <span>{sortBy}</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                rounded-lg shadow-lg z-10 overflow-hidden"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm transition 
                    ${
                      sortBy === option
                        ? "bg-emerald-600 text-white"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
   

        {/* Task Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {paginatedTasks.length > 0 ? (
            paginatedTasks.map((task) => <TaskCard
                  key={task.id} task={task} 
                  onEdit={() => handleEdit(task)}
                  onDelete={() => handleDeleteClick(task)}
             />)
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center col-span-full py-10">
              No tasks found.
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 items-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-1.5 rounded-lg border text-sm font-medium
                border-gray-300 dark:border-gray-600
                text-gray-700 dark:text-gray-200
                bg-white dark:bg-gray-800
                hover:bg-gray-100 dark:hover:bg-gray-700
                focus:ring-2 focus:ring-emerald-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition"
            >
              Prev
            </button>

            <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
              Page{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                {totalPages}
              </span>
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-1.5 rounded-lg border text-sm font-medium
                border-gray-300 dark:border-gray-600
                text-gray-700 dark:text-gray-200
                bg-white dark:bg-gray-800
                hover:bg-gray-100 dark:hover:bg-gray-700
                focus:ring-2 focus:ring-emerald-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition"
            >
              Next
            </button>
          </div>
        )}

        {/* Add Task Modal */}
        <AddTask
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingTask(null); 
          }}
          existingTask={editingTask}
          
        />
         
         {/* Delete Confirm  */}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title="Delete Task"
          message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />

      </div>
    </>
  );
};

export default Dashboard;
