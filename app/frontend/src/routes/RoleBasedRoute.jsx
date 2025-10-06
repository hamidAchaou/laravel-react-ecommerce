// src/routes/RoleBasedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RoleBasedRoute({ allowedRoles }) {
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);

  if (loading) return <div className="p-6 text-center">Checking permissions...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
