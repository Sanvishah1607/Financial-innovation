import React, { SelectHTMLAttributes, ReactNode } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  leftIcon,
  id,
  className = '',
  containerClassName = '',
  required,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
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

        <select
          id={selectId}
          required={required}
          className={`block w-full rounded-md border text-sm text-[#242424] bg-white transition-colors focus:outline-none focus:ring-1 focus:ring-[#8B1E3F] focus:border-[#8B1E3F] ${
            leftIcon ? 'pl-9' : 'pl-3.5'
          } pr-8 py-2 appearance-none cursor-pointer ${
            error ? 'border-[#C62828]' : 'border-[#E5E5E5]'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-[#6B6B6B]">
          <svg
            className="w-4 h-4 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
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

export default Select;
