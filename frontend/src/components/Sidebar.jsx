import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-blue-700 text-white min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-8">TMS</h1>

      <nav className="flex flex-col gap-3">
        {user?.role === "admin" && (
          <>
            <Link to="/admin-dashboard">Dashboard</Link>
            <Link to="/managers">Manager Details</Link>
            <Link to="/create-manager">Create Manager</Link>
            <Link to="/create-project">Create Project</Link>
          </>
        )}

        {user?.role === "manager" && (
          <>
            <Link to="/manager-dashboard">Dashboard</Link>
            <Link to="/members">Member Details</Link>
            <Link to="/create-member">Create Member</Link>
            <Link to="/create-task">Create Task</Link>
          </>
        )}

        {user?.role === "member" && <Link to="/member">Dashboard</Link>}

        <Link to="/projects">Projects</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/activities">Activities</Link>
        <Link to="/notifications">Notifications</Link>

        <button
          onClick={handleLogout}
          className="mt-8 bg-red-500 py-2 rounded"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;