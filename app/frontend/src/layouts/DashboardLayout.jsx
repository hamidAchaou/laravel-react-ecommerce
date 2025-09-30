import React from "react";
import { Link } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/admin" className="hover:text-brand-accent">Dashboard</Link>
          <Link to="/admin/products" className="hover:text-brand-accent">Products</Link>
          <Link to="/admin/orders" className="hover:text-brand-accent">Orders</Link>
          <Link to="/admin/users" className="hover:text-brand-accent">Users</Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
