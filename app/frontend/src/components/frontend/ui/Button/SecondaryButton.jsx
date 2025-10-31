import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

/**
 * SecondaryButton — elegant variant for secondary actions
 */
const SecondaryButton = ({
  fullWidth = false,
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) => {
  const baseClasses =
    "relative inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm select-none overflow-hidden";

  const styles = `
    bg-[var(--color-secondary)]
    text-white
    hover:bg-[color-mix(in srgb,var(--color-secondary)_90%,black)]
    focus:ring-[var(--color-secondary)]
  `;

  const width = fullWidth ? "w-full" : "";
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type="button"
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      className={clsx(
        baseClasses,
        styles,
        width,
        className,
        isDisabled &&
          "opacity-60 cursor-not-allowed transform-none shadow-none"
      )}
      {...props}
    >
      {loading && (
        <span className="absolute left-4 inline-block w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
      )}
      <span className={clsx(loading ? "opacity-70 ml-4" : "")}>{children}</span>
    </motion.button>
  );
};

export default React.memo(SecondaryButton);
