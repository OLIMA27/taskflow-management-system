import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white px-6 py-4 shadow flex justify-between">
      <h2 className="font-bold text-xl">Task Management System</h2>

      <div className="text-right">
        <p className="font-semibold">{user?.name}</p>
        <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
      </div>
    </div>
  );
};

export default Navbar;