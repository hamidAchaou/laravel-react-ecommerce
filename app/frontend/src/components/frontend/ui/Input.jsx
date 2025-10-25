// src/components/frontend/ui/Input.jsx
import React from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  success,
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-brand-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-brand-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={isPassword && showPassword ? 'text' : type}
          className={`
            w-full px-4 py-3 border rounded-xl transition-all duration-200
            focus:ring-2 focus:ring-brand-primary focus:border-transparent
            disabled:bg-brand-gray-50 disabled:cursor-not-allowed
            ${LeftIcon ? 'pl-10' : ''}
            ${RightIcon || isPassword ? 'pr-10' : ''}
            ${error 
              ? 'border-error focus:ring-error' 
              : success 
                ? 'border-success focus:ring-success' 
                : 'border-brand-gray-300 focus:ring-brand-primary'
            }
            ${isLoading ? 'animate-pulse' : ''}
            ${className}
          `}
          disabled={isLoading}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-gray-400 hover:text-brand-gray-600 transition-colors"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}

        {!isPassword && RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <RightIcon className="h-5 w-5 text-brand-gray-400" />
          </div>
        )}

        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <AlertCircle className="h-5 w-5 text-error" />
          </div>
        )}

        {success && !error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };