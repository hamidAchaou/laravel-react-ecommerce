// NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-light px-4 text-center">
      <h1 className="text-6xl font-extrabold text-brand-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-brand-dark mb-6">
        Oops! Page not found
      </h2>
      <p className="text-gray-600 mb-8">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="inline-block px-6 py-3 rounded-lg bg-brand-accent text-brand-dark font-medium hover:bg-brand-accent-hover transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
