import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  id,
  className = '',
  containerClassName = '',
  required,
  disabled,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-[#242424] mb-1.5 uppercase tracking-wide"
        >
          {label} {required && <span className="text-[#C62828]">*</span>}
        </label>
      )}

      <div className="relative rounded-md">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B6B6B]">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          required={required}
          disabled={disabled}
          className={`block w-full rounded-md border text-sm text-[#242424] bg-white placeholder-[#9E9E9E] transition-colors focus:outline-none focus:ring-1 focus:ring-[#8B1E3F] focus:border-[#8B1E3F] disabled:bg-[#F7F7F8] disabled:text-[#9E9E9E] ${
            leftIcon ? 'pl-9' : 'pl-3.5'
          } ${rightIcon ? 'pr-9' : 'pr-3.5'} py-2 ${
            error ? 'border-[#C62828]' : 'border-[#E5E5E5]'
          } ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6B6B6B]">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-[#C62828] font-medium">{error}</p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-xs text-[#6B6B6B]">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
