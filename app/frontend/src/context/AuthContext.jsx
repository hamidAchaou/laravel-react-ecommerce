// app/frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios"; // Axios instance

const AuthContext = createContext(null);

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);          // Logged-in user
  const [loading, setLoading] = useState(true);    // App loading state (fetching user)
  const [authenticating, setAuthenticating] = useState(false); // Login/register in progress
  const [error, setError] = useState("");          // Last auth error

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await api.get("/sanctum/csrf-cookie");    // CSRF token
        const res = await api.get("/api/user");   // Fetch user
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    setAuthenticating(true);
    setError("");
    try {
      await api.get("/sanctum/csrf-cookie");     // CSRF cookie
      await api.post("/login", { email, password });
      const res = await api.get("/api/user");    // Fetch logged-in user
      setUser(res.data);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return { success: false, message: err.response?.data?.message || "Login failed" };
    } finally {
      setAuthenticating(false);
    }
  };

  // Register function
  const register = async (name, email, password, password_confirmation) => {
    setAuthenticating(true);
    setError("");
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/register", { name, email, password, password_confirmation });
      const res = await api.get("/api/user");
      setUser(res.data);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      return { success: false, message: err.response?.data?.message || "Registration failed" };
    } finally {
      setAuthenticating(false);
    }
  };

  // Logout function
  const logout = async () => {
    setAuthenticating(true);
    try {
      await api.post("/logout");
      setUser(null);
    } catch (err) {
      console.warn("Logout failed", err);
    } finally {
      setAuthenticating(false);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,            // true while fetching current user
    authenticating,     // true while login/register/logout
    isAuthenticated: !!user,
    error,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
