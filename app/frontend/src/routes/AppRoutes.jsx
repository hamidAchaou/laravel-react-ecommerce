// src/routes/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";

// Layouts
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// ===================== Client Pages =====================
const Home = lazy(() => import("../pages/client/Home/Home"));
const Shop = lazy(() => import("../pages/client/Shop/Shop"));
const Cart = lazy(() => import("../pages/client/Cart/Cart"));
const Profile = lazy(() => import("../pages/client/Profile/Profile"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const NotFound = lazy(() => import("../pages/NotFound"));

// ===================== Admin Pages =====================
// Dashboard
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard/Dashboard"));

// Products / Categories
const AdminProducts = lazy(() => import("../pages/admin/Products/Products"));
const ProductDetails = lazy(() => import("../pages/admin/Products/ProductDetails"));
const ProductCreate = lazy(() => import("../pages/admin/Products/ProductCreate"));
const ProductEdit = lazy(() => import("../pages/admin/Products/ProductEdit"));

// Orders
const AdminOrders = lazy(() => import("../pages/admin/Orders/Orders"));
const OrderDetails = lazy(() => import("../pages/admin/Orders/OrderDetails"));
const OrderEdit = lazy(() => import("../pages/admin/Orders/OrderEdit.jsx"));

// Users
const AdminUsers = lazy(() => import("../pages/admin/Users/Users"));
import UsersCreate from "../pages/admin/Users/UsersCreate.jsx";
import UsersEdit from "../pages/admin/Users/UsersEdit.jsx";
import UsersDetails from "../pages/admin/Users/UsersDetails.jsx";

// Categories
const AdminCategories = lazy(() => import("../pages/admin/categories/Categories"));
const CategoryCreate = lazy(() => import("../pages/admin/Categories/CategoryCreate"));
const CategoryEdit = lazy(() => import("../pages/admin/Categories/CategoryEdit"));
const CategoryDetails = lazy(() => import("../pages/admin/Categories/CategoryDetails"));

// Roles & Permissions
const ManageRoles = lazy(() => import("../pages/admin/Roles/ManageRoles"));
const RoleCreate = lazy(() => import("../pages/admin/Roles/RoleCreate"));
const RoleEdit = lazy(() => import("../pages/admin/Roles/RoleEdit"));
const RoleDetails = lazy(() => import("../pages/admin/Roles/RoleDetails"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <Routes>

        {/* ================= Public Client Routes ================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Client Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* ================= Admin Routes (Role-Based) ================= */}
        <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />

            {/* Products */}
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/create" element={<ProductCreate />} />
            <Route path="products/edit/:id" element={<ProductEdit />} />
            <Route path="products/:id" element={<ProductDetails />} />

            {/* Categories */}
            <Route path="categories" element={<AdminCategories />} />
            <Route path="categories/create" element={<CategoryCreate />} />
            <Route path="categories/edit/:id" element={<CategoryEdit />} />
            <Route path="categories/:id" element={<CategoryDetails />} />

            {/* Orders */}
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/edit/:id" element={<OrderEdit />} />
            <Route path="orders/:id" element={<OrderDetails />} />

            {/* Users */}
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/create" element={<UsersCreate />} />
            <Route path="users/edit/:id" element={<UsersEdit />} />
            <Route path="users/:id" element={<UsersDetails />} />

            {/* Roles & Permissions */}
            <Route path="roles" element={<ManageRoles />} />
            <Route path="roles/create" element={<RoleCreate />} />
            <Route path="roles/edit/:id" element={<RoleEdit />} />
            <Route path="roles/:id" element={<RoleDetails />} />
          </Route>
        </Route>

        {/* ================= Catch-all 404 ================= */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}