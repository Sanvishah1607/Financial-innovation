import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  IndianRupee,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Plus,
  X,
  Save
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import { useFinancial } from '../context/FinancialContext';
import { useToast } from '../context/ToastContext';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useFinancial();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [monthlyIncome, setMonthlyIncome] = useState(user.monthlyIncome.toString());
  const [goals, setGoals] = useState<string[]>(user.financialGoals || []);
  const [newGoal, setNewGoal] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddGoal = () => {
    if (newGoal.trim() && !goals.includes(newGoal.trim())) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (tag: string) => {
    setGoals(goals.filter(g => g !== tag));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      updateUser({
        fullName,
        email,
        phone,
        monthlyIncome: parseFloat(monthlyIncome) || user.monthlyIncome,
        financialGoals: goals
      });
      addToast('success', 'Profile details updated successfully.');
    } catch (err) {
      addToast('error', 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl font-black text-[#242424] tracking-tight">
            Account Profile
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Manage your personal credentials, linked financial identifier, and baseline income settings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Profile Summary Card */}
        <div className="md:col-span-4 space-y-4">
          <Card className="p-6 bg-white text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#8B1E3F] text-white font-bold text-2xl flex items-center justify-center shadow-md mb-3 border-4 border-[#F8E9EE]">
              {user.fullName
                .split(' ')
                .map(n => n[0])
                .join('')}
            </div>

            <h2 className="text-base font-bold text-[#242424]">{user.fullName}</h2>
            <p className="text-xs text-[#6B6B6B]">{user.email}</p>

            <div className="mt-4 pt-4 border-t border-[#F0F0F0] w-full space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#6B6B6B]">
                <span>Member Since:</span>
                <span className="font-mono text-[#242424]">August 2024</span>
              </div>
              <div className="flex items-center justify-between text-[#6B6B6B]">
                <span>KYC Status:</span>
                <Badge variant="success">Verified Tier-1</Badge>
              </div>
              <div className="flex items-center justify-between text-[#6B6B6B]">
                <span>2FA Security:</span>
                <Badge variant="primary">Active (App)</Badge>
              </div>
            </div>
          </Card>

          {/* Linked Bank Masked Info */}
          <Card className="p-5 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/70">Linked Salary Bank</span>
              <Building2 className="w-4 h-4 text-white/70" />
            </div>

            <div>
              <p className="text-xs text-white/60 uppercase">Kotak Mahindra Bank</p>
              <p className="font-mono text-base font-bold tracking-wider mt-1">
                {user.accountNumberMasked}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/70 pt-2 border-t border-white/10">
              <span>IFSC: {user.ifscCode}</span>
              <span className="flex items-center gap-1 text-[#4ADE80]">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct IMPS
              </span>
            </div>
          </Card>
        </div>

        {/* Right Form Card */}
        <div className="md:col-span-8">
          <Card className="p-6 bg-white">
            <h3 className="text-sm font-bold text-[#242424] uppercase tracking-wider pb-3 mb-5 border-b border-[#F0F0F0]">
              Personal Details & Parameters
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  leftIcon={<User className="w-4 h-4 text-[#6B6B6B]" />}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    leftIcon={<Mail className="w-4 h-4 text-[#6B6B6B]" />}
                    required
                  />
                </div>

                <div>
                  <Input
                    label="Mobile Number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    leftIcon={<Phone className="w-4 h-4 text-[#6B6B6B]" />}
                    required
                  />
                </div>
              </div>

              <div>
                <Input
                  label="Monthly Base Income (INR ₹)"
                  type="number"
                  value={monthlyIncome}
                  onChange={e => setMonthlyIncome(e.target.value)}
                  leftIcon={<IndianRupee className="w-4 h-4 text-[#8B1E3F]" />}
                  helperText="Used for automated 50-30-20 budget calculation and savings targets."
                  required
                />
              </div>

              {/* Financial Goals Tags */}
              <div className="pt-3 border-t border-[#F0F0F0]">
                <label className="block text-xs font-bold text-[#242424] uppercase tracking-wider mb-2">
                  My Primary Financial Goals
                </label>

                <div className="flex items-center gap-2 mb-3">
                  <Input
                    placeholder="e.g., Build 6-Month Emergency Cushion, Buy MacBook Pro"
                    value={newGoal}
                    onChange={e => setNewGoal(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddGoal();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddGoal}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Add
                  </Button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {goals.map(goal => (
                    <span
                      key={goal}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F8E9EE] text-[#8B1E3F] text-xs font-medium rounded-full border border-[#8B1E3F]/20"
                    >
                      {goal}
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(goal)}
                        className="hover:text-[#64152E]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end pt-5 border-t border-[#F0F0F0]">
                <Button
                  type="submit"
                  isLoading={isSaving}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
