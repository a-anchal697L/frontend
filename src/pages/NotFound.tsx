import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center p-6">
      {/* Illustration / Icon */}
      <div className="mb-6">
        <h1 className="text-7xl font-bold text-[#10b981] mb-4">404</h1>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Oops! Page not found.
        </p>
      </div>

      {/* Message */}
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        The page you’re looking for doesn’t exist or has been moved.  
        Let’s get you back on track!
      </p>

      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-[#10b981] hover:bg-[#0ea170] text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300"
      >
        <ArrowLeftCircle size={20} />
        Go Back to your Dashboard
      </button>
    </div>
  );
};

export default NotFound;
