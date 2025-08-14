import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <Link to="/dashboard" className="font-bold">
        TryTab
      </Link>
      <div className="space-x-4">
        <Link to="/jobs">Jobs</Link>
        <Link to="/applications">Applications</Link>
      </div>
    </nav>
  );
};

export default Navbar;
