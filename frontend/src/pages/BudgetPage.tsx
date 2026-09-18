import React, { useState } from 'react';
import {
  Plus,
  Target,
  AlertTriangle,
  CheckCircle,
  PieChart,
  ShieldCheck,
  TrendingUp,
  Info,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { Budget, TransactionCategory } from '../types';

export const BudgetPage: React.FC = () => {
  const { budgets, updateBudget, totalExpenses } = useFinancial();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory>('Food');
  const [newAllocation, setNewAllocation] = useState('');

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const overallPercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;
  const totalRemaining = Math.max(0, totalAllocated - totalSpent);

  const categories: TransactionCategory[] = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Education',
    'Entertainment',
    'Healthcare',
    'Other'
  ];

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newAllocation);
    if (!newAllocation || isNaN(amount) || amount <= 0) {
      addToast('error', 'Please enter a valid positive budget amount');
      return;
    }

    const existing = budgets.find(b => b.category === selectedCategory);
    if (existing) {
      updateBudget(existing.id, amount);
      addToast('success', `Updated ${selectedCategory} budget to ₹${amount.toLocaleString('en-IN')}`);
    } else {
      addToast('info', `Set budget for ${selectedCategory}`);
    }

    setIsModalOpen(false);
    setNewAllocation('');
  };

  const openEditModal = (budget: Budget) => {
    setSelectedCategory(budget.category);
    setNewAllocation(budget.allocatedAmount.toString());
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl font-black text-[#242424] tracking-tight">
            Monthly Budget Control
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Set spending thresholds per category and track real-time consumption.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setSelectedCategory('Food');
              setNewAllocation('');
              setIsModalOpen(true);
            }}
          >
            Adjust Budget Limit
          </Button>
        </div>
      </div>

      {/* Main Budget Health Card */}
      <Card className="p-6 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#F0F0F0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">
                Overall Budget Health ({new Date().toLocaleString('default', { month: 'long', year: 'numeric' })})
              </span>
              <Badge variant={overallPercentage > 90 ? 'danger' : overallPercentage > 75 ? 'warning' : 'success'}>
                {overallPercentage}% Utilized
              </Badge>
            </div>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-3xl font-mono font-black text-[#242424]">
                ₹{totalSpent.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-mono text-[#6B6B6B]">
                of ₹{totalAllocated.toLocaleString('en-IN')} allocated
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5]">
              <span className="text-[11px] font-semibold text-[#6B6B6B] uppercase">Remaining Cushion</span>
              <p className="text-base font-mono font-bold text-[#218739] mt-0.5">
                ₹{totalRemaining.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-[#FAFAFA] border border-[#E5E5E5]">
              <span className="text-[11px] font-semibold text-[#6B6B6B] uppercase">Active Limits</span>
              <p className="text-base font-mono font-bold text-[#8B1E3F] mt-0.5">
                {budgets.length} Categories
              </p>
            </div>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#242424]">Monthly Outflow Progress</span>
            <span className="font-mono font-bold text-[#6B6B6B]">
              ₹{totalRemaining.toLocaleString('en-IN')} left for {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()} days
            </span>
          </div>
          <div className="w-full h-3 bg-[#F0F0F0] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallPercentage > 90
                  ? 'bg-[#C62828]'
                  : overallPercentage > 75
                  ? 'bg-[#C88719]'
                  : 'bg-[#8B1E3F]'
              }`}
              style={{ width: `${Math.min(100, overallPercentage)}%` }}
            />
          </div>
        </div>
      </Card>

      {/* 50-30-20 Rule Financial Tip */}
      <Card className="p-4 bg-[#F8E9EE]/40 border border-[#F8E9EE]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#8B1E3F] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <h3 className="font-bold text-[#8B1E3F]">
              Smart Rule of Thumb: 50 / 30 / 20 Budgeting Rule
            </h3>
            <p className="text-[#242424] mt-0.5 leading-relaxed">
              Aim to allocate <strong>50% of income to Needs</strong> (Rent, Food, Bills), <strong>30% to Wants</strong> (Dining out, Shopping, Entertainment), and at least <strong>20% to Savings & Investments</strong>.
            </p>
          </div>
        </div>
      </Card>

      {/* Category Budgets Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
            Category Breakdown & Utilization
          </h2>
          <span className="text-xs text-[#6B6B6B]">Click any category to edit limit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(b => {
            const pct = Math.round((b.spentAmount / b.allocatedAmount) * 100);
            const remaining = b.allocatedAmount - b.spentAmount;
            const isExceeded = remaining < 0;
            const isNearLimit = pct >= 80 && !isExceeded;

            return (
              <Card
                key={b.id}
                onClick={() => openEditModal(b)}
                className="p-4.5 bg-white hover:border-[#8B1E3F] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#242424] group-hover:text-[#8B1E3F] transition-colors">
                      {b.category}
                    </span>
                  </div>
                  <Badge
                    variant={isExceeded ? 'danger' : isNearLimit ? 'warning' : 'success'}
                  >
                    {isExceeded ? 'Exceeded' : `${pct}%`}
                  </Badge>
                </div>

                <div className="flex items-baseline justify-between text-xs mb-2">
                  <span className="font-mono text-sm font-bold text-[#242424]">
                    ₹{b.spentAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[#6B6B6B] font-mono">
                    Limit: ₹{b.allocatedAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-[#F0F0F0] rounded-full overflow-hidden mb-2.5">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isExceeded
                        ? 'bg-[#C62828]'
                        : isNearLimit
                        ? 'bg-[#C88719]'
                        : 'bg-[#218739]'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className={isExceeded ? 'text-[#C62828] font-bold' : 'text-[#6B6B6B]'}>
                    {isExceeded
                      ? `Exceeded by ₹${Math.abs(remaining).toLocaleString('en-IN')}`
                      : `₹${remaining.toLocaleString('en-IN')} remaining`}
                  </span>
                  <span className="text-[#8B1E3F] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Edit <Sliders className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Edit / Add Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adjust Category Budget"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <div>
            <Select
              label="Select Category"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as TransactionCategory)}
              options={categories.map(c => ({ value: c, label: c }))}
            />
          </div>

          <div>
            <Input
              type="number"
              label="Monthly Allocation (₹)"
              placeholder="e.g. 5000"
              value={newAllocation}
              onChange={e => setNewAllocation(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Budget
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BudgetPage;
