import { ButtonHTMLAttributes } from 'react';

export default function SecondaryButton({
  type = 'button',
  className = '',
  disabled,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={`
        btn btn-outline btn-secondary
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
