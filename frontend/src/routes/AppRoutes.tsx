import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Jobs from "../pages/Jobs";
import Applications from "../pages/Applications";
import { PrivateRoute } from "../components/PrivateRoute";
import Profile from "../pages/Profile";
import JobDetails from "../pages/JobDetails";
import MyApplications from "../pages/MyApplications";

const AppRoutes = () => {
  const token = localStorage.getItem("token");
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <PrivateRoute>
              <Jobs />
            </PrivateRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <PrivateRoute>
              <Applications />
            </PrivateRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/my-applications" element={<MyApplications />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
