import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { lazy, Suspense } from "react";
import { Loader } from "lucide-react";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));



function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={ <PublicRoute> <Login /> </PublicRoute>} />
        <Route path="/signup" element={ <PublicRoute> <Signup /> </PublicRoute>} />
        <Route path="/" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
      </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
