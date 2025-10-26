// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar.jsx";
import Footer from "../components/common/Footer.jsx";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar - Fixed at top */}
      <Navbar />
      
      {/* Main Content - No max-width or padding constraints */}
      {/* This allows child pages (like Shop) to control their own layout */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}