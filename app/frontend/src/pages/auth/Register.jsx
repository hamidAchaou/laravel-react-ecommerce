// src/pages/auth/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register, error, setError, authenticating } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await register(name, email, password, passwordConfirmation);

    if (res.success) {
      const userRole = res.user?.role;
      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "seller") {
        navigate("/seller");
      } else {
        navigate("/");
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-brand-primary mb-6 text-center">
          Register
        </h2>

        {error && (
          <div className="mb-4 text-red-600 font-medium text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
          />

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

          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
          />

          <button
            type="submit"
            disabled={authenticating}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              authenticating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-brand-primary hover:bg-brand-secondary"
            }`}
          >
            {authenticating ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-accent hover:text-brand-accent-hover font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
