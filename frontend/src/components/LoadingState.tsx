import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading financial data...',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-[#6B6B6B] ${className}`}
    >
      <Loader2 className="w-8 h-8 text-[#8B1E3F] animate-spin mb-3" />
      <p className="text-xs font-semibold uppercase tracking-wider">{message}</p>
    </div>
  );
};

export default LoadingState;
