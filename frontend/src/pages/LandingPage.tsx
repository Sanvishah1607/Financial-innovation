import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Receipt,
  PieChart,
  PiggyBank,
  ShieldAlert,
  BookOpen,
  Calculator,
  Lock,
  CheckCircle2,
  Wallet,
  Smartphone,
  CreditCard
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Receipt className="w-5 h-5 text-[#8B1E3F]" />,
      title: 'Track Daily Expenses',
      desc: 'Record campus meals, transit, groceries and retail spends with payment tags (UPI, Debit Card).',
    },
    {
      icon: <Wallet className="w-5 h-5 text-[#218739]" />,
      title: 'Monitor Total Income & Balance',
      desc: 'Track stipends, freelance projects, and calculate real-time savings rates with zero hassle.',
    },
    {
      icon: <PieChart className="w-5 h-5 text-[#8B1E3F]" />,
      title: 'Set Monthly Category Budgets',
      desc: 'Allocate spending limits for Food, Transport, and Shopping with automatic over-budget warnings.',
    },
    {
      icon: <PiggyBank className="w-5 h-5 text-[#C88719]" />,
      title: 'Build Purpose-Driven Savings',
      desc: 'Set goals for emergency reserves, laptops, or exams with visual milestone tracking.',
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-[#C62828]" />,
      title: 'Check Suspicious Messages & Links',
      desc: 'Rule-based educational scanner detecting urgency hooks, fake lottery bait, and reverse QR traps.',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-[#8B1E3F]" />,
      title: 'Learn Financial Basics',
      desc: 'Bite-sized guides demystifying UPI safety, credit scores, compounding interest, and loan traps.',
    },
  ];

  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center pt-8 pb-12">


        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#242424] tracking-tight leading-tight max-w-4xl mx-auto">
          Smart Personal Finance & <br />
          <span className="text-[#8B1E3F]">Secure Digital Transactions</span>
        </h1>

        <p className="text-lg sm:text-xl font-medium text-[#64152E] mt-3">
          "Your Money. Your Shield."
        </p>

        <p className="mt-4 text-sm sm:text-base text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed">
          Manage your money, understand your spending, build better saving habits, 
          and stay protected from digital scams with an authentic, non-custodial banking companion.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link to="/signup">
            <Button size="lg" icon={<ArrowRight className="w-4 h-4" />}>
              Get Started Free
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Sign In to FinShield
            </Button>
          </Link>
        </div>
      </section>



      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#8B1E3F] uppercase tracking-wider">
            Comprehensive Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#242424] mt-1">
            Built for Young Adults & First-Time Earners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card key={i} className="hover:border-[#8B1E3F]/30 transition-all">
              <div className="w-10 h-10 rounded-md bg-[#F8E9EE] flex items-center justify-center mb-3">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-[#242424] mb-1.5">{f.title}</h3>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Educational Callout */}
      <section className="bg-white border border-[#E5E5E5] rounded-xl p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#EAF5EC] text-[#218739] flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-extrabold text-[#242424]">
          Non-Custodial & Privacy-First
        </h3>
        <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-xl mx-auto leading-relaxed">
          FinShield never asks for bank account passwords, debit PINs, CVVs, or OTPs. 
          Your financial autonomy and data security remain 100% under your control.
        </p>
        <div className="pt-2">
          <Link to="/signup">
            <Button size="md">
              Create Your Shield Profile
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
