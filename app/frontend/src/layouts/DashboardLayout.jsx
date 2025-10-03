// src/layouts/DashboardLayout.jsx
import { Outlet, NavLink } from "react-router-dom";

export default function DashboardLayout() {
  const navItems = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/users", label: "Users" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              end={item.to === "/admin"} // important: match only exact /admin
              to={item.to}
              className={({ isActive }) =>
                `px-2 py-1 rounded transition ${
                  isActive ? "bg-gray-700 text-white" : "hover:text-gray-300"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
