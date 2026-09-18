import React, { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = 'There are no records to display at this moment.',
  icon = <Inbox className="w-8 h-8 text-[#8B1E3F]" />,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`text-center py-10 px-4 bg-[#F7F7F8] border border-dashed border-[#E5E5E5] rounded-lg ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#F8E9EE] flex items-center justify-center mx-auto mb-3 text-[#8B1E3F]">
        {icon}
      </div>
      <h4 className="text-sm font-bold text-[#242424] mb-1">{title}</h4>
      <p className="text-xs text-[#6B6B6B] max-w-sm mx-auto mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
