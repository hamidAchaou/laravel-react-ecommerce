import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { api, sanctum } from "../../api/axios.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Step 1: Get CSRF cookie
      await sanctum.get("/sanctum/csrf-cookie");

      // Step 2: Post login credentials
      const response = await api.post("/auth/login", { email, password });

      const { user } = response.data;
      login(user); // save user in context
      navigate("/"); // redirect
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-brand-primary mb-6 text-center">
          Login
        </h2>

        {error && (
          <div className="mb-4 text-red-600 font-medium text-center">{error}</div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-secondary transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-brand-accent hover:text-brand-accent-hover font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
