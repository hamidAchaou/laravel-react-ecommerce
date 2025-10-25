// src/components/frontend/ui/Button.jsx
import React from 'react';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  ...props
}, ref) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-brand-primary text-white hover:bg-brand-primary/90
      focus:ring-brand-primary shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-brand-secondary text-white hover:bg-brand-secondary/90
      focus:ring-brand-secondary shadow-lg hover:shadow-xl
    `,
    outline: `
      border-2 border-brand-gray-300 text-brand-gray-700 hover:border-brand-primary
      hover:text-brand-primary focus:ring-brand-primary bg-transparent
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      ref={ref}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      
      {!isLoading && LeftIcon && <LeftIcon className="mr-2 h-5 w-5" />}
      
      {children}
      
      {!isLoading && RightIcon && <RightIcon className="ml-2 h-5 w-5" />}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };