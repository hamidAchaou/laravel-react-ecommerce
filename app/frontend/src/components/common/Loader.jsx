// src/components/common/Loader.jsx
import React from "react";

export default function Loader({ text = "Loading...", fullscreen = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullscreen ? "min-h-screen" : "py-10"
      }`}
    >
      {/* Spinner */}
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-brand-primary animate-spin"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-brand-accent animate-spin-slow"></div>
      </div>

      {/* Optional text */}
      {text && (
        <p className="mt-4 text-gray-700 font-medium text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
