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
    <nav className="bg-[var(--color-brand-primary)] text-[var(--color-brand-light)] shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          MyStore
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6 font-medium">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "underline underline-offset-4 text-[var(--color-brand-accent)]"
                  : "hover:text-[var(--color-brand-accent-hover)] transition"
              }
            >
              Home
            </NavLink>
          </li>

          {/* Client links */}
          {user?.role === "client" && (
            <>
              <li>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    isActive
                      ? "underline underline-offset-4 text-[var(--color-brand-accent)]"
                      : "hover:text-[var(--color-brand-accent-hover)] transition"
                  }
                >
                  Cart
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/checkout"
                  className={({ isActive }) =>
                    isActive
                      ? "underline underline-offset-4 text-[var(--color-brand-accent)]"
                      : "hover:text-[var(--color-brand-accent-hover)] transition"
                  }
                >
                  Checkout
                </NavLink>
              </li>
            </>
          )}

          {/* Admin links */}
          {user?.role === "admin" && (
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "underline underline-offset-4 text-[var(--color-brand-accent)]"
                    : "hover:text-[var(--color-brand-accent-hover)] transition"
                }
              >
                Dashboard
              </NavLink>
            </li>
          )}

          {/* Auth Links */}
          {!user ? (
            <>
              <li>
                <NavLink
                  to="/login"
                  className="hover:text-[var(--color-brand-accent-hover)] transition"
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className="hover:text-[var(--color-brand-accent-hover)] transition"
                >
                  Register
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="bg-[var(--color-primary-button)] text-[var(--color-brand-dark)] px-3 py-1 rounded-lg hover:bg-[var(--color-primary-button-hover)] transition"
              >
                Logout
              </button>
            </li>
          )}
        </ul>

        {/* Mobile menu placeholder */}
        <div className="md:hidden">
          {/* TODO: Add hamburger menu */}
        </div>
      </div>
    </nav>
  );
}
