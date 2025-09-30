import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";

// Lazy load
const Home = lazy(() => import("../pages/client/Home"));
const Shop = lazy(() => import("../pages/client/Shop"));
const Cart = lazy(() => import("../pages/client/Cart"));
const Profile = lazy(() => import("../pages/client/Profile"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));

// Admin
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("../pages/admin/Products"));
const AdminOrders = lazy(() => import("../pages/admin/Orders"));
const AdminUsers = lazy(() => import("../pages/admin/Users"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Client Protected */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected */}
        <Route
          path="/admin"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminProducts />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminOrders />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </RoleBasedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
