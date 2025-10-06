import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authThunks";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerUser(form));

    if (res.meta.requestStatus === "fulfilled") {
      const userRole = res.payload.user.role;
      navigate(userRole === "admin" ? "/admin" : "/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-brand-primary mb-6 text-center">
          Register
        </h2>

        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {["name", "email", "password", "password_confirmation"].map((field) => (
            <input
              key={field}
              type={field.includes("password") ? "password" : "text"}
              name={field}
              placeholder={field.replace("_", " ").toUpperCase()}
              value={form[field]}
              onChange={handleChange}
              required
              className="border rounded-lg px-4 py-3"
            />
          ))}

          <button
            disabled={loading}
            className="bg-brand-primary text-white py-3 rounded-lg"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-accent">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
