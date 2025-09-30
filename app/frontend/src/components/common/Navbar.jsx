// Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-brand-primary text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          MyStore
        </Link>

        <ul className="hidden md:flex items-center gap-6 font-medium">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "underline underline-offset-4" : ""
              }
            >
              Home
            </NavLink>
          </li>

          {/* Conditional links */}
          {user?.role === "client" && (
            <>
              <li>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    isActive ? "underline underline-offset-4" : ""
                  }
                >
                  Cart
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/checkout"
                  className={({ isActive }) =>
                    isActive ? "underline underline-offset-4" : ""
                  }
                >
                  Checkout
                </NavLink>
              </li>
            </>
          )}

          {user?.role === "admin" && (
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  isActive ? "underline underline-offset-4" : ""
                }
              >
                Dashboard
              </NavLink>
            </li>
          )}

          {!user ? (
            <>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/register">Register</NavLink>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="bg-brand-accent text-brand-dark px-3 py-1 rounded-lg hover:bg-brand-accent-hover transition"
              >
                Logout
              </button>
            </li>
          )}
        </ul>

        {/* Mobile menu placeholder */}
        <div className="md:hidden">
          {/* Add hamburger menu for mobile if needed */}
        </div>
      </div>
    </nav>
  );
}
