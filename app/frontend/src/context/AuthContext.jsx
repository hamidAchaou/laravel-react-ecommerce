// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

// 1. Create context
const AuthContext = createContext(null);

// 2. Hook for using auth
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = not logged in
  const [loading, setLoading] = useState(true);

  // Simulate fetching user session (replace with API call later)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
