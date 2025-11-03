import { Edit, Trash2 } from 'lucide-react'
import type { Task } from '../pages/Dashboard';


interface TaskCardProps {
  task: Task;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}


const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {

  return (
          <div
            key={task.id}
            className="group relative bg-white dark:bg-gray-900 shadow-md hover:shadow-lg rounded-2xl p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1"
          >
           
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors">
                {task.title}
              </h3>
              <span
                className={`px-3 py-1 text-xs font-semibold whitespace-nowrap rounded-full ${
                  task.status === "Done"
                    ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                    : task.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                    : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                }`}
              >
                {task.status}
              </span>
            </div>


            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {task.description}
            </p>

            {/* Deadline */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Deadline:
                </span>{" "}
                  {new Date(task.deadline).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
              </span>

              {/* Progress indicator */}
              {task.status === "In Progress" && (
                <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
              )}
              {task.status === "Done" && (
                <div className="w-3 h-3 rounded-full bg-green-400" />
              )}
              {task.status === "Pending" && (
                <div className="w-3 h-3 rounded-full bg-red-400" />
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3">
              <button onClick={onEdit} className="flex items-center justify-center gap-1 text-sm font-medium text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-lg transition">
                 <Edit/> Edit
              </button>
              <button onClick={onDelete} className="flex items-center gap-1 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1.5 rounded-lg transition">
                <Trash2/>  Delete
              </button>
            </div>
          </div>
  )
}

export default TaskCard
