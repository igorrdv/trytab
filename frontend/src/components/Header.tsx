import { Link } from "react-router-dom";

export default function Header() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">TryTab</h1>
      <nav className="flex space-x-4">
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
        >
          Dashboard
        </Link>
        <Link
          to="/jobs"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Vagas
        </Link>
        <Link
          to="/applications"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Candidaturas
        </Link>
      </nav>
    </header>
  );
}
