import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Mail, Lock, DollarSign, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Card from '../components/Card';
import { useToast } from '../context/ToastContext';
import { useFinancial } from '../context/FinancialContext';
import { registerUser, googleSignIn } from '../services/api';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { updateUser } = useFinancial();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('35000');
  const [currency, setCurrency] = useState('INR (₹)');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await registerUser({
      fullName,
      email,
      monthlyIncome: parseFloat(monthlyIncome) || 35000,
      currency,
      password,
    });
    setLoading(false);

    if (result.success && result.user) {
      const firstName = fullName.split(' ')[0] || 'User';
      updateUser({
        fullName,
        email,
        monthlyIncome: parseFloat(monthlyIncome) || 35000,
        currency,
      });
      showToast(`Welcome to FinShield, ${firstName}! Your account is ready.`, 'success');
      navigate('/dashboard');
    } else {
      showToast(result.error || 'Failed to create account.', 'error');
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      // Connect to Google Authentication portal
      const result = await googleSignIn();
      setGoogleLoading(false);

      if (result.success && result.user) {
        const firstName = result.user.fullName.split(' ')[0] || 'User';
        updateUser({
          fullName: result.user.fullName,
          email: result.user.email,
          authProvider: 'google',
          monthlyIncome: parseFloat(monthlyIncome) || 35000,
          currency,
        });
        showToast(`Welcome, ${firstName}! Signed up with Google account.`, 'success');
        navigate('/dashboard');
      } else {
        showToast(result.error || 'Google authentication was cancelled or failed.', 'error');
      }
    } catch (err) {
      setGoogleLoading(false);
      showToast('Could not connect to Google Authentication portal.', 'error');
    }
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
          Take full control of your personal finances with non-custodial safety
        </p>
      </div>

      <Card className="p-6 bg-white shadow-sm border border-[#E5E5E5]">
        {/* Google One-Click Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-md border border-[#E5E5E5] bg-white hover:bg-[#FAFAFA] text-xs font-bold text-[#242424] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all disabled:opacity-60"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleLoading ? 'Connecting to Google Portal...' : 'Sign Up with Google Account'}</span>
        </button>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E5E5]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-2.5 text-[#6B6B6B] font-semibold">
              Or register with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Aarav Sharma"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            leftIcon={<User className="w-4 h-4 text-[#6B6B6B]" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. aarav@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4 text-[#6B6B6B]" />}
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
              leftIcon={<Lock className="w-4 h-4 text-[#6B6B6B]" />}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              leftIcon={<Lock className="w-4 h-4 text-[#6B6B6B]" />}
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
              leftIcon={<DollarSign className="w-4 h-4 text-[#6B6B6B]" />}
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
            disabled={loading || googleLoading}
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
