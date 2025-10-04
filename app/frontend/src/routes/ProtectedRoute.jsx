// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();

  // 🟡 While loading user => DON'T redirect yet!
  if (loading) return <div className="p-6 text-center">Checking session...</div>;

  // 🔴 Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // 🔴 Unauthorized role → redirect to home
  if (role && user.role !== role) return <Navigate to="/" replace />;

  // ✅ Allowed → render route
  return <Outlet />;
}
