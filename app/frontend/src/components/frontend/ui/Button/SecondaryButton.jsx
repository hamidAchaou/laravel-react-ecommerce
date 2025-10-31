import React from "react";
import { motion } from "framer-motion";

const SecondaryButton = ({
  children,
  icon: Icon,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3
        font-medium text-[var(--color-text-primary)] text-base sm:text-lg
        bg-white/70 backdrop-blur-xl border border-[var(--color-primary)]/20
        rounded-2xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]
        hover:bg-white shadow-md hover:shadow-[var(--color-primary)]/30
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/20
        disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group
        ${className}`}
    >
      {/* border glow effect */}
      <span className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-primary)]/40 rounded-2xl transition-all duration-500"></span>

      <span className="relative flex items-center gap-2 z-10">
        {Icon && <Icon className="w-5 h-5" />}
        {children}
      </span>
    </motion.button>
  );
};

export default SecondaryButton;
