import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          TryTab
        </Link>

        <div className="space-x-4">
          <Link to="/jobs" className="hover:underline">
            Jobs
          </Link>
          <Link to="/my-applications" className="hover:underline">
            My Applications
          </Link>
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>

          {user?.role === "company" && (
            <Link to="/dashboard" className="hover:underline">
              My Jobs
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
