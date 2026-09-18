import React, { useState } from 'react';
import {
  Plus,
  PiggyBank,
  Target,
  Calendar,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { SavingsGoal } from '../types';

export const SavingsPage: React.FC = () => {
  const { savingsGoals, addSavingsGoal, depositToSavingsGoal } = useFinancial();
  const { addToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  // New Goal Form State
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [goalCategory, setGoalCategory] = useState('Emergency Fund');

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState('');

  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallPercentage = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(targetAmount);
    if (!goalName.trim() || isNaN(amt) || amt <= 0 || !targetDate) {
      addToast('error', 'Please fill in all goal details correctly.');
      return;
    }

    addSavingsGoal({
      name: goalName.trim(),
      targetAmount: amt,
      currentAmount: 0,
      targetDate,
      category: goalCategory,
      color: '#8B1E3F'
    });

    addToast('success', `Created new goal "${goalName}" with target ₹${amt.toLocaleString('en-IN')}`);
    setIsAddModalOpen(false);
    setGoalName('');
    setTargetAmount('');
    setTargetDate('');
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      addToast('error', 'Please enter a valid deposit amount.');
      return;
    }

    depositToSavingsGoal(selectedGoal.id, amt);
    addToast('success', `Deposited ₹${amt.toLocaleString('en-IN')} to "${selectedGoal.name}"!`);
    setIsDepositModalOpen(false);
    setDepositAmount('');
    setSelectedGoal(null);
  };

  const openDepositModal = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setDepositAmount('');
    setIsDepositModalOpen(true);
  };

  const calculateMonthsLeft = (dateStr: string) => {
    const target = new Date(dateStr);
    const now = new Date();
    const months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
    return Math.max(1, months);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl font-black text-[#242424] tracking-tight">
            Smart Savings Vault
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Set target milestones, automate deposits, and build your emergency safety cushion.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Create New Goal
          </Button>
        </div>
      </div>

      {/* Overview Stat Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-[#8B1E3F] to-[#64152E] text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Total Accumulated</span>
            <PiggyBank className="w-5 h-5 text-white/80" />
          </div>
          <p className="text-2xl font-mono font-black mt-2">
            ₹{totalSaved.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs text-white/80">
            <span>Overall completion:</span>
            <span className="font-bold text-white">{overallPercentage}%</span>
          </div>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Total Targets</span>
            <Target className="w-5 h-5 text-[#8B1E3F]" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#242424] mt-2">
            ₹{totalTarget.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-[#6B6B6B] mt-3">
            Across {savingsGoals.length} active financial goals
          </p>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#218739] uppercase tracking-wider">Remaining to Goal</span>
            <TrendingUp className="w-5 h-5 text-[#218739]" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#218739] mt-2">
            ₹{Math.max(0, totalTarget - totalSaved).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-[#6B6B6B] mt-3">
            Continuous monthly contributions recommended
          </p>
        </Card>
      </div>

      {/* Savings Goals Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
            Active Savings Milestones
          </h2>
          <span className="text-xs text-[#6B6B6B]">{savingsGoals.length} active goals</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savingsGoals.map(goal => {
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            const monthsLeft = calculateMonthsLeft(goal.targetDate);
            const monthlyRequired = Math.round(remaining / monthsLeft);
            const isCompleted = pct >= 100;

            return (
              <Card
                key={goal.id}
                className="p-5 bg-white border border-[#E5E5E5] hover:border-[#8B1E3F] hover:shadow-cardHover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <Badge variant="neutral">{goal.category || 'Personal Goal'}</Badge>
                      <h3 className="text-base font-bold text-[#242424] mt-1.5">{goal.name}</h3>
                    </div>
                    <Badge variant={isCompleted ? 'success' : pct > 50 ? 'primary' : 'warning'}>
                      {isCompleted ? 'Achieved!' : `${pct}%`}
                    </Badge>
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-mono text-lg font-bold text-[#242424]">
                        ₹{goal.currentAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="font-mono text-xs text-[#6B6B6B]">
                        Target: ₹{goal.targetAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-[#218739]'
                            : pct > 50
                            ? 'bg-[#8B1E3F]'
                            : 'bg-[#C88719]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAFAFA] rounded-md text-xs space-y-1.5 border border-[#F0F0F0] mb-4">
                    <div className="flex items-center justify-between text-[#6B6B6B]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Target Date:
                      </span>
                      <span className="font-mono font-semibold text-[#242424]">{goal.targetDate}</span>
                    </div>

                    {!isCompleted && (
                      <div className="flex items-center justify-between text-[#6B6B6B]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Monthly Needed:
                        </span>
                        <span className="font-mono font-bold text-[#8B1E3F]">
                          ₹{monthlyRequired.toLocaleString('en-IN')}/mo
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F0F0F0]">
                  <Button
                    variant={isCompleted ? 'outline' : 'primary'}
                    size="sm"
                    className="w-full"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => openDepositModal(goal)}
                  >
                    {isCompleted ? 'Add Extra Funds' : 'Deposit Funds'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add New Goal Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Savings Milestone"
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div>
            <Input
              label="Goal Name"
              placeholder="e.g. Goa Trip, New Phone, Emergency Fund"
              value={goalName}
              onChange={e => setGoalName(e.target.value)}
              required
            />
          </div>

          <div>
            <Select
              label="Category"
              value={goalCategory}
              onChange={e => setGoalCategory(e.target.value)}
              options={[
                { value: 'Emergency Fund', label: 'Emergency Safety Cushion' },
                { value: 'Tech & Gadgets', label: 'Tech & Gadgets' },
                { value: 'Travel & Vacations', label: 'Travel & Vacations' },
                { value: 'Education & Courses', label: 'Education & Courses' },
                { value: 'Vehicle & Mobility', label: 'Vehicle & Mobility' },
                { value: 'Other', label: 'Other Personal Milestone' }
              ]}
            />
          </div>

          <div>
            <Input
              type="number"
              label="Target Amount (₹)"
              placeholder="e.g. 50000"
              value={targetAmount}
              onChange={e => setTargetAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <Input
              type="date"
              label="Target Date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Goal
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quick Deposit Modal */}
      <Modal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        title={`Deposit to ${selectedGoal?.name}`}
      >
        <form onSubmit={handleDeposit} className="space-y-4">
          <div className="p-3 bg-[#FAFAFA] rounded-lg border border-[#E5E5E5] text-xs">
            <div className="flex justify-between text-[#6B6B6B] mb-1">
              <span>Current Saved:</span>
              <span className="font-mono font-bold text-[#242424]">₹{selectedGoal?.currentAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Target Amount:</span>
              <span className="font-mono font-bold text-[#242424]">₹{selectedGoal?.targetAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div>
            <Input
              type="number"
              label="Deposit Amount (₹)"
              placeholder="e.g. 2000"
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value)}
              required
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6B6B6B] font-semibold">Presets:</span>
            {[500, 1000, 2500, 5000].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setDepositAmount(amt.toString())}
                className="px-2 py-1 text-[11px] font-mono rounded bg-[#FAFAFA] border border-[#E5E5E5] hover:bg-[#F8E9EE] hover:text-[#8B1E3F] hover:border-[#8B1E3F]"
              >
                +₹{amt}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDepositModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Confirm Deposit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SavingsPage;
