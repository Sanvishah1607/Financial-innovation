import React, { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  amount: string;
  icon: ReactNode;
  comparisonText?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  isPositive?: boolean; // whether "up" is good (e.g. for savings) or bad (for expenses)
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  icon,
  comparisonText,
  trend,
  trendValue,
  isPositive = true,
  className = '',
}) => {
  const isGood = (trend === 'up' && isPositive) || (trend === 'down' && !isPositive);

  return (
    <div
      className={`bg-white rounded-lg border border-[#E5E5E5] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:border-[#D0D0D0] transition-colors ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
          {title}
        </span>
        <div className="w-9 h-9 rounded-md bg-[#F8E9EE] text-[#8B1E3F] flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <h2 className="text-2xl font-extrabold text-[#242424] tracking-tight font-sans">
          {amount}
        </h2>
      </div>

      {(trendValue || comparisonText) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          {trendValue && (
            <span
              className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded ${
                isGood
                  ? 'bg-[#EAF5EC] text-[#218739]'
                  : 'bg-[#FCE8E8] text-[#C62828]'
              }`}
            >
              {trend === 'up' ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : trend === 'down' ? (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              ) : null}
              {trendValue}
            </span>
          )}
          {comparisonText && (
            <span className="text-[#6B6B6B]">{comparisonText}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
