import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light text-brand-dark">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
  