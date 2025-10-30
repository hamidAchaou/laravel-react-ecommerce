import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

const AppInput = forwardRef(({
  label,
  error,
  success,
  helperText,
  icon: Icon,
  iconPosition = 'left',
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
    focus:outline-none focus:ring-2 focus:ring-offset-1
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

  const inputContent = (
    <div className="relative">
      {Icon && iconPosition === 'left' && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-brand-gray-400" />
        </div>
      )}

      <input
        ref={ref}
        className={`
          ${classes}
          ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
          ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
          ${error || success ? 'pr-10' : ''}
        `}
        {...props}
      />

      {Icon && iconPosition === 'right' && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-brand-gray-400" />
        </div>
      )}

      {/* Status Icons */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        {error && <AlertCircle className="h-5 w-5 text-red-500" />}
        {success && !error && <CheckCircle className="h-5 w-5 text-green-500" />}
      </div>
    </div>
  );

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

      {inputContent}

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

AppInput.displayName = 'AppInput';

export default React.memo(AppInput);