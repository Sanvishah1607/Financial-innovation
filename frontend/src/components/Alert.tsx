import React, { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const typeConfig = {
    info: {
      bg: 'bg-[#F8E9EE]/60',
      border: 'border-[#8B1E3F]/30',
      text: 'text-[#8B1E3F]',
      icon: <Info className="w-4 h-4 text-[#8B1E3F]" />,
    },
    success: {
      bg: 'bg-[#EAF5EC]',
      border: 'border-[#218739]/30',
      text: 'text-[#218739]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#218739]" />,
    },
    warning: {
      bg: 'bg-[#FDF6E9]',
      border: 'border-[#C88719]/30',
      text: 'text-[#C88719]',
      icon: <AlertTriangle className="w-4 h-4 text-[#C88719]" />,
    },
    danger: {
      bg: 'bg-[#FCE8E8]',
      border: 'border-[#C62828]/30',
      text: 'text-[#C62828]',
      icon: <AlertCircle className="w-4 h-4 text-[#C62828]" />,
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-md border ${config.bg} ${config.border} ${className}`}
    >
      <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1">
        {title && (
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${config.text}`}>
            {title}
          </h4>
        )}
        <div className="text-xs text-[#242424] leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-[#6B6B6B] hover:text-[#242424] p-0.5 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
