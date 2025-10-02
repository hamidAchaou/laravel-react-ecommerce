// app/frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState("");

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await ensureCsrfToken();
        const res = await api.get("/api/user");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Ensure CSRF token is set
  const ensureCsrfToken = async () => {
    try {
      await api.get("/sanctum/csrf-cookie");
    } catch (error) {
      console.error("CSRF token fetch failed:", error);
    }
  };

  // Login function
  const login = async (email, password) => {
    setAuthenticating(true);
    setError("");
    try {
      // Get CSRF token first
      await ensureCsrfToken();
      
      // Then make login request
      const response = await api.post("/login", { email, password });
      console.log("Login response:", response);
      
      // Fetch user data
      const userRes = await api.get("/api/user");
      setUser(userRes.data);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Login failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setAuthenticating(false);
    }
  };

  // Register function (similar fix)
  const register = async (name, email, password, password_confirmation) => {
    setAuthenticating(true);
    setError("");
    try {
      await ensureCsrfToken();
      await api.post("/register", { name, email, password, password_confirmation });
      const userRes = await api.get("/api/user");
      setUser(userRes.data);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Registration failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
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
    loading,
    authenticating,
    isAuthenticated: !!user,
    error,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}