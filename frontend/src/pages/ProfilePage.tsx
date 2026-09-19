import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  IndianRupee,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Lock,
  Plus,
  X,
  Save,
  Loader2
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import { useFinancial } from '../context/FinancialContext';
import { useToast } from '../context/ToastContext';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, totalIncome, currentBalance } = useFinancial();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [monthlyIncome, setMonthlyIncome] = useState(user.monthlyIncome ? user.monthlyIncome.toString() : '35000');
  const [goals, setGoals] = useState<string[]>(user.financialGoals || []);
  const [newGoal, setNewGoal] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if user changes
  useEffect(() => {
    setFullName(user.fullName);
    setEmail(user.email);
    setPhone(user.phone || '');
    setMonthlyIncome(user.monthlyIncome ? user.monthlyIncome.toString() : '35000');
    setGoals(user.financialGoals || []);
  }, [user]);

  const userInitials = user.fullName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const memberSinceFormatted = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
      });

  const handleAddGoal = () => {
    if (newGoal.trim() && !goals.includes(newGoal.trim())) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (tag: string) => {
    setGoals(goals.filter((g) => g !== tag));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Please enter your full name.', 'error');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSaving(true);
    // Simulated short async operation for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 350));

    try {
      updateProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        monthlyIncome: parseFloat(monthlyIncome) || user.monthlyIncome,
        financialGoals: goals,
      });
      showToast('Profile information successfully updated!', 'success');
    } catch (err) {
      showToast('Failed to update profile.', 'error');
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
            Manage your personal identity credentials, linked financial parameters, and baseline settings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Profile Summary Card */}
        <div className="md:col-span-4 space-y-4">
          <Card className="p-6 bg-white text-center flex flex-col items-center">
            {/* Dynamic User Initials / Avatar (Requirement 7) */}
            <div className="w-20 h-20 rounded-full bg-[#8B1E3F] text-white font-black text-2xl flex items-center justify-center shadow-md mb-3 border-4 border-[#F8E9EE]">
              {userInitials}
            </div>

            <h2 className="text-base font-bold text-[#242424]">{user.fullName}</h2>
            <p className="text-xs text-[#6B6B6B] truncate max-w-full">{user.email}</p>

            <div className="mt-4 pt-4 border-t border-[#F0F0F0] w-full space-y-2.5 text-xs text-left">
              {/* Dynamic Account Creation Date (Requirement 7) */}
              <div className="flex items-center justify-between text-[#6B6B6B]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8B1E3F]" />
                  <span>Member Since:</span>
                </span>
                <span className="font-mono font-semibold text-[#242424] text-[11px]">
                  {memberSinceFormatted}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#6B6B6B]">
                <span>Account Status:</span>
                <Badge variant="success">Active Verified</Badge>
              </div>

              <div className="flex items-center justify-between text-[#6B6B6B]">
                <span>Two-Factor Auth:</span>
                <Badge variant={user.twoFactorEnabled ? 'primary' : 'neutral'}>
                  {user.twoFactorEnabled ? 'Enabled (App)' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Linked Bank Masked Info (Dynamic) */}
          <Card className="p-5 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/70">Linked Virtual Ledger</span>
              <Building2 className="w-4 h-4 text-white/70" />
            </div>

            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider">Masked Bank Account</p>
              <p className="font-mono text-base font-bold tracking-wider mt-1">
                {user.accountNumberMasked || '•••• •••• •••• 9102'}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/70 pt-2 border-t border-white/10">
              <span>IFSC: {user.ifscCode || 'FSHD0008472'}</span>
              <span className="flex items-center gap-1 text-[#4ADE80]">
                <ShieldCheck className="w-3.5 h-3.5" /> Non-Custodial
              </span>
            </div>
          </Card>
        </div>

        {/* Right Form Card (Requirement 7: Editable profile page, updating name and email) */}
        <div className="md:col-span-8">
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#F0F0F0]">
              <h3 className="text-sm font-bold text-[#242424] uppercase tracking-wider">
                Personal Credentials & Settings
              </h3>
              <Badge variant="neutral">Editable</Badge>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Full Name Input */}
              <div>
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftIcon={<User className="w-4 h-4 text-[#6B6B6B]" />}
                  required
                />
              </div>

              {/* Email Address & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail className="w-4 h-4 text-[#6B6B6B]" />}
                    required
                  />
                </div>

                <div>
                  <Input
                    label="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    leftIcon={<Phone className="w-4 h-4 text-[#6B6B6B]" />}
                  />
                </div>
              </div>

              {/* Monthly Base Income */}
              <div>
                <Input
                  label="Monthly Base Income (INR ₹)"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  leftIcon={<IndianRupee className="w-4 h-4 text-[#8B1E3F]" />}
                  helperText="Used dynamically for 50/30/20 budget telemetry, savings rate computation, and analytics."
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
                    placeholder="e.g. Build 6-Month Emergency Fund, Buy MacBook Pro"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={(e) => {
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
                  {goals.length === 0 ? (
                    <span className="text-xs text-[#6B6B6B] italic">No custom goal tags added yet.</span>
                  ) : (
                    goals.map((goal) => (
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
                    ))
                  )}
                </div>
              </div>

              {/* Save Button with Loading State (Requirement 7) */}
              <div className="flex items-center justify-end pt-5 border-t border-[#F0F0F0]">
                <Button
                  type="submit"
                  isLoading={isSaving}
                  icon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                >
                  {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
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
