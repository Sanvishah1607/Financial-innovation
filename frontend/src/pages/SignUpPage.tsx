import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Mail, Lock, DollarSign, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Card from '../components/Card';
import { useToast } from '../context/ToastContext';
import { useFinancial } from '../context/FinancialContext';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { updateProfile } = useFinancial();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('35000');
  const [currency, setCurrency] = useState('INR (₹)');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const err: { [key: string]: string } = {};
    if (!fullName.trim()) err.fullName = 'Full Name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) err.email = 'Valid email is required';
    if (!password || password.length < 6) err.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) err.confirmPassword = 'Passwords do not match';
    if (!agreedToTerms) err.terms = 'You must agree to the Terms & Conditions';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateProfile({
        fullName,
        email,
        monthlyIncome: parseFloat(monthlyIncome) || 35000,
        currency,
      });
      showToast(`Welcome to FinShield, ${fullName}! Your profile is ready.`, 'success');
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#8B1E3F] text-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-[#242424] tracking-tight">
          Create Your FinShield Account
        </h2>
        <p className="text-xs text-[#6B6B6B] mt-1">
          Take full control of your student finances with non-custodial safety
        </p>
      </div>

      <Card>
        <form onSubmit={handleSignUp} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Aarav Sharma"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. aarav@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <Input
              label="Est. Monthly Income (₹)"
              type="number"
              placeholder="35000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              leftIcon={<DollarSign className="w-4 h-4" />}
              helperText="Stipend, allowance or salary"
            />
            <Select
              label="Preferred Currency"
              options={[
                { value: 'INR (₹)', label: 'INR (₹) - Indian Rupee' },
                { value: 'USD ($)', label: 'USD ($) - US Dollar' },
                { value: 'EUR (€)', label: 'EUR (€) - Euro' },
              ]}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2 cursor-pointer text-xs text-[#4A4A4A]">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-[#E5E5E5] text-[#8B1E3F] focus:ring-[#8B1E3F]"
              />
              <span>
                I agree to the <span className="font-semibold text-[#8B1E3F]">Terms & Conditions</span> and understand that FinShield operates under a non-custodial privacy architecture.
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1 text-xs text-[#C62828] font-medium">{errors.terms}</p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {loading ? 'Setting up Profile...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#F0F0F0] text-center text-xs text-[#6B6B6B]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#8B1E3F] hover:underline">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SignUpPage;
