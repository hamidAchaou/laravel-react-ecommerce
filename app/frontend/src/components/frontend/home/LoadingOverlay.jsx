// src/components/LoadingOverlay.jsx
import React from "react";
import { motion } from "framer-motion";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full"
      />
    </div>
  );
}
