import React from "react";
import { motion } from "framer-motion";

const AppButton = ({
  children,
  icon: Icon,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3
        font-semibold text-white text-base sm:text-lg
        bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]
        rounded-2xl shadow-md shadow-[var(--color-primary)]/20
        hover:shadow-lg hover:shadow-[var(--color-secondary)]/40
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/30
        disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group
        ${className}`}
    >
      {/* subtle animated background on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500"></span>

      <span className="relative flex items-center gap-2 z-10">
        {Icon && <Icon className="w-5 h-5" />}
        {children}
      </span>
    </motion.button>
  );
};

export default AppButton;
