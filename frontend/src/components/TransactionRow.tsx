import React from 'react';
import { Transaction } from '../types';
import { 
  Coffee, 
  Utensils, 
  Car, 
  ShoppingBag, 
  FileText, 
  GraduationCap, 
  Film, 
  HeartPulse, 
  Briefcase, 
  TrendingUp, 
  Layers, 
  Trash2,
  Calendar,
  CreditCard
} from 'lucide-react';

interface TransactionRowProps {
  transaction: Transaction;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Food':
      return <Utensils className="w-4 h-4" />;
    case 'Transport':
      return <Car className="w-4 h-4" />;
    case 'Shopping':
      return <ShoppingBag className="w-4 h-4" />;
    case 'Bills':
      return <FileText className="w-4 h-4" />;
    case 'Education':
      return <GraduationCap className="w-4 h-4" />;
    case 'Entertainment':
      return <Film className="w-4 h-4" />;
    case 'Healthcare':
      return <HeartPulse className="w-4 h-4" />;
    case 'Salary':
      return <Briefcase className="w-4 h-4" />;
    case 'Freelance':
      return <TrendingUp className="w-4 h-4" />;
    case 'Investment':
      return <TrendingUp className="w-4 h-4" />;
    default:
      return <Layers className="w-4 h-4" />;
  }
};

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  onDelete,
  showActions = true,
}) => {
  const isIncome = transaction.type === 'income';

  return (
    <div className="flex items-center justify-between p-3.5 hover:bg-[#F7F7F8] rounded-md transition-colors border-b border-[#F0F0F0] last:border-b-0 group">
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${
            isIncome
              ? 'bg-[#EAF5EC] text-[#218739]'
              : 'bg-[#F8E9EE] text-[#8B1E3F]'
          }`}
        >
          {getCategoryIcon(transaction.category)}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-[#242424] truncate">
              {transaction.name}
            </h4>
            {transaction.isRecurring && (
              <span className="text-[10px] bg-[#F7F7F8] text-[#6B6B6B] border border-[#E5E5E5] px-1.5 py-0.2 rounded font-medium">
                Recurring
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#6B6B6B] mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#9E9E9E]" />
              {transaction.date} {transaction.time && `• ${transaction.time}`}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-[#9E9E9E]" />
              {transaction.paymentMethod}
            </span>
            <span>•</span>
            <span className="font-medium text-[#4A4A4A]">{transaction.category}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span
          className={`text-sm font-bold tracking-tight ${
            isIncome ? 'text-[#218739]' : 'text-[#242424]'
          }`}
        >
          {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
        </span>

        {showActions && onDelete && (
          <button
            onClick={() => onDelete(transaction.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-[#6B6B6B] hover:text-[#C62828] hover:bg-[#FCE8E8] rounded transition-all cursor-pointer"
            title="Delete transaction"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionRow;
