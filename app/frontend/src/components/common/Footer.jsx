// Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-light mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-400 mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} MyStore. All rights reserved.
        </p>

        <div className="flex gap-6">
          <Link to="/" className="hover:text-brand-accent transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-brand-accent transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-brand-accent transition">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-brand-accent transition">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
