import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/admin-dashboard" replace />;
    if (user.role === "manager") return <Navigate to="/manager-dashboard" replace />;
    if (user.role === "member") return <Navigate to="/member-dashboard" replace />;

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleRoute;