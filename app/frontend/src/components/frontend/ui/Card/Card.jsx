// app/frontend/src/components/frontend/ui/Card/Card.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Card = React.forwardRef(({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
  bordered = true,
  shadow = 'md',
  onClick,
  ...props
}, ref) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const baseClasses = 'rounded-2xl bg-white transition-all duration-200';
  const borderClass = bordered ? 'border border-gray-200' : '';
  const hoverClass = hoverable ? 'hover:shadow-lg cursor-pointer' : '';

  const classes = `${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${borderClass} ${hoverClass} ${className}`;

  const CardComponent = hoverable ? motion.div : 'div';

  return (
    <CardComponent
      ref={ref}
      className={classes}
      whileHover={hoverable ? { y: -4 } : {}}
      onClick={onClick}
      {...props}
    >
      {children}
    </CardComponent>
  );
});

Card.displayName = 'Card';

export default Card;