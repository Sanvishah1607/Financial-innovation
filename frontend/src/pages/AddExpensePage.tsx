import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Calendar,
  Clock,
  Tag,
  CreditCard,
  FileText,
  TrendingDown,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { TransactionCategory, TransactionType, PaymentMethod } from '../types';

export const AddExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const { addTransaction } = useFinancial();
  const { addToast } = useToast();

  const [type, setType] = useState<TransactionType>('expense');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('Food');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: TransactionCategory[] = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Education',
    'Entertainment',
    'Healthcare',
    'Salary',
    'Freelance',
    'Investment',
    'Other'
  ];

  const paymentMethods: PaymentMethod[] = [
    'UPI',
    'Debit Card',
    'Credit Card',
    'Bank Transfer',
    'Cash'
  ];

  const quickAmounts = [100, 250, 500, 1000, 2000, 5000];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Transaction title / merchant name is required';
    }
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than ₹0';
    }
    if (!date) {
      newErrors.date = 'Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      addTransaction({
        name: name.trim(),
        amount: parseFloat(amount),
        type,
        category,
        date,
        time: time || '12:00',
        paymentMethod,
        notes: notes.trim() || undefined
      });

      addToast(
        'success',
        `Successfully logged ${type === 'expense' ? 'expense' : 'income'} of ₹${parseFloat(amount).toLocaleString('en-IN')} for "${name}".`
      );

      navigate('/transactions');
    } catch (err) {
      addToast('error', 'Failed to save transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAdd = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/transactions"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B6B6B] hover:text-[#8B1E3F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Transactions
        </Link>
        <span className="text-xs text-[#6B6B6B] font-mono">Secure Entry</span>
      </div>

      {/* Main Card */}
      <Card className="bg-white p-6 sm:p-8">
        <div className="pb-4 mb-6 border-b border-[#E5E5E5]">
          <h1 className="text-xl font-black text-[#242424] tracking-tight">
            Record New Transaction
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-1">
            Track your spending with instant category breakdown and automated balance computation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Toggle: Expense vs Income */}
          <div>
            <label className="block text-xs font-bold text-[#242424] uppercase tracking-wider mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-[#F7F7F8] rounded-lg border border-[#E5E5E5]">
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  if (category === 'Salary' || category === 'Freelance') setCategory('Food');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-bold transition-all ${
                  type === 'expense'
                    ? 'bg-[#8B1E3F] text-white shadow-sm'
                    : 'text-[#6B6B6B] hover:text-[#242424]'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                Expense (Outflow)
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setCategory('Salary');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-bold transition-all ${
                  type === 'income'
                    ? 'bg-[#218739] text-white shadow-sm'
                    : 'text-[#6B6B6B] hover:text-[#242424]'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Income (Inflow)
              </button>
            </div>
          </div>

          {/* Amount Field with Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-[#242424] uppercase tracking-wider mb-1.5">
              Amount (INR ₹) <span className="text-[#C62828]">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base font-bold text-[#8B1E3F]">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
                }}
                className={`w-full pl-9 pr-4 py-3 bg-white border rounded-md font-mono text-xl font-bold text-[#242424] focus:outline-none focus:ring-1 transition-colors ${
                  errors.amount
                    ? 'border-[#C62828] focus:border-[#C62828] focus:ring-[#C62828]'
                    : 'border-[#E5E5E5] focus:border-[#8B1E3F] focus:ring-[#8B1E3F]'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-[#C62828] flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.amount}
              </p>
            )}

            {/* Quick Add Pill Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
              <span className="text-[11px] text-[#6B6B6B] font-semibold mr-1">Quick Add:</span>
              {quickAmounts.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAdd(val)}
                  className="px-2.5 py-1 text-[11px] font-mono font-medium rounded border border-[#E5E5E5] bg-[#FAFAFA] hover:bg-[#F8E9EE] hover:border-[#8B1E3F] hover:text-[#8B1E3F] text-[#242424] transition-colors"
                >
                  +₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* Title / Merchant Name */}
          <div>
            <Input
              label="Transaction Title / Merchant"
              placeholder={type === 'expense' ? 'e.g., Swiggy, Uber, Electricity Bill' : 'e.g., Monthly Stipend, Client Invoice'}
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              error={errors.name}
              leftIcon={<Tag className="w-4 h-4 text-[#6B6B6B]" />}
              required
            />
          </div>

          {/* Category & Payment Method in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Select
                label="Category"
                value={category}
                onChange={e => setCategory(e.target.value as TransactionCategory)}
                options={categories.map(c => ({ value: c, label: c }))}
                required
              />
            </div>

            <div>
              <Select
                label="Payment Method"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                options={paymentMethods.map(p => ({ value: p, label: p }))}
                required
              />
            </div>
          </div>

          {/* Date & Time in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                type="date"
                label="Transaction Date"
                value={date}
                onChange={e => setDate(e.target.value)}
                error={errors.date}
                required
              />
            </div>

            <div>
              <Input
                type="time"
                label="Transaction Time"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-[#242424] uppercase tracking-wider mb-1.5">
              Notes / Tags (Optional)
            </label>
            <div className="relative">
              <textarea
                rows={3}
                placeholder="Add receipt number, tax tag, split note or reason..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-md text-xs text-[#242424] placeholder-[#6B6B6B] focus:outline-none focus:border-[#8B1E3F] focus:ring-1 focus:ring-[#8B1E3F] transition-colors"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E5E5]">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/transactions')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Save Transaction
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddExpensePage;
