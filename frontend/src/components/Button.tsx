import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#8B1E3F] hover:bg-[#731834] text-white focus:ring-[#8B1E3F] shadow-sm active:bg-[#64152E]',
    secondary:
      'bg-white hover:bg-[#F7F7F8] text-[#242424] border border-[#E5E5E5] focus:ring-[#8B1E3F] active:bg-[#ECECED]',
    outline:
      'bg-transparent border border-[#8B1E3F] text-[#8B1E3F] hover:bg-[#F8E9EE] focus:ring-[#8B1E3F]',
    danger:
      'bg-[#C62828] hover:bg-[#A81E1E] text-white focus:ring-[#C62828] shadow-sm',
    ghost:
      'bg-transparent text-[#6B6B6B] hover:text-[#242424] hover:bg-[#F7F7F8]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default Button;
