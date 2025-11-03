import { Plus, Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { toggleTheme } from "../features/theme/themeSlice";

interface NavbarProps {
  onAddTaskClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAddTaskClick }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <header
      className="bg-white dark:bg-gray-900 backdrop-blur-md shadow-sm 
                 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 
                 transition-colors duration-300 mb-12"
    >
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <h1
          className=" text-lg sm:text-xl md:text-2xl font-bold tracking-tight 
                     text-[#0c9d6d] dark:text-[#10b981] 
                     select-none"
        >
          Task Manager
        </h1>
        <div className="flex items-center gap-4">
          {/* Add Task Button */}
          <button
            onClick={onAddTaskClick}
            className="flex items-center gap-2 px-2 sm:px-5 py-2.5 cursor-pointer
                       text-white font-semibold rounded-xl shadow-md
                       bg-[#0c9d6d] hover:bg-[#0b8c63] 
                       dark:bg-[#10b981] dark:hover:bg-[#059669]
                       transition-all duration-300 transform hover:scale-[1.03] 
                       focus:outline-none focus:ring-2 focus:ring-[#0c9d6d]/50"
          >
            <Plus size={15} />
            <span className="text-sm">Add Task</span>
          </button>

          <button
            onClick={()=>dispatch(toggleTheme())}
            className="relative w-8 h-8 cursor-pointer flex items-center justify-center rounded-xl 
                       bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 
                       hover:bg-gray-200 dark:hover:bg-gray-700 
                       shadow-md hover:shadow-lg
                       transition-all duration-300 focus:outline-none 
                       focus:ring-2 focus:ring-[#0c9d6d]/40"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={18} className="transition-transform duration-300 scale-110" />
            ) : (
              <Moon size={18} className="transition-transform duration-300 scale-110" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
