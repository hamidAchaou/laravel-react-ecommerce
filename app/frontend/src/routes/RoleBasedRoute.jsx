// src/routes/RoleBasedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleBasedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6 text-center">Checking permissions...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
