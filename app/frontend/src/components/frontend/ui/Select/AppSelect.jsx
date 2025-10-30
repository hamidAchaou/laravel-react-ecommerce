import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, AlertCircle, CheckCircle } from 'lucide-react';

const AppSelect = forwardRef(({
  label,
  options = [],
  error,
  success,
  helperText,
  placeholder = 'Select an option',
  fullWidth = true,
  className = '',
  size = 'medium',
  ...props
}, ref) => {
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-5 py-4 text-lg'
  };

  const baseClasses = `
    w-full border rounded-xl transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses[size]}
  `;

  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50'
    : success
    ? 'border-green-300 focus:border-green-500 focus:ring-green-500 bg-green-50'
    : 'border-brand-gray-300 focus:border-brand-primary focus:ring-brand-primary bg-white';

  const classes = `${baseClasses} ${stateClasses} ${className}`.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${fullWidth ? 'w-full' : ''}`}
    >
      {label && (
        <label className="block text-sm font-medium text-brand-text-primary">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          className={`${classes} pr-10`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option
              key={option.value ?? option.id ?? option}
              value={option.value ?? option.id ?? option}
            >
              {option.label ?? option.name ?? option}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown className="h-5 w-5 text-brand-gray-400" />
        </div>

        {/* Status Icons */}
        <div className="absolute inset-y-0 right-7 flex items-center">
          {error && <AlertCircle className="h-5 w-5 text-red-500" />}
          {success && !error && <CheckCircle className="h-5 w-5 text-green-500" />}
        </div>
      </div>

      {(error || helperText) && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-sm ${
            error ? 'text-red-600' : 'text-brand-text-secondary'
          }`}
        >
          {error || helperText}
        </motion.p>
      )}
    </motion.div>
  );
});

AppSelect.displayName = 'AppSelect';

export default React.memo(AppSelect);