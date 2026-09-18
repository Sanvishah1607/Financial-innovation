import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 font-bold',
    md: 'text-xs px-2 py-0.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-[#F8E9EE] text-[#8B1E3F] border border-[#E9C8D4]',
    success: 'bg-[#EAF5EC] text-[#218739] border border-[#CDE5D2]',
    warning: 'bg-[#FDF6E9] text-[#C88719] border border-[#F6E1BA]',
    danger: 'bg-[#FCE8E8] text-[#C62828] border border-[#F6C6C6]',
    neutral: 'bg-[#F7F7F8] text-[#4A4A4A] border border-[#E5E5E5]',
    outline: 'bg-transparent text-[#6B6B6B] border border-[#E5E5E5]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
