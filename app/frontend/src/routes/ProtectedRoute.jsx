// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ role }) {
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);

  if (loading) return <div className="p-6 text-center">Checking session...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (role && user?.role !== role) return <Navigate to="/" replace />;

  return <Outlet />;
}
