import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator as CalcIcon,
  TrendingUp,
  Percent,
  PiggyBank,
  Calendar,
  CheckCircle2,
  Info,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { useFinancial } from '../context/FinancialContext';
import { useToast } from '../context/ToastContext';

type CalculatorTab = 'emi' | 'sip' | 'compound' | 'savings-goal' | 'gst';

export const CalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const { addSavingsGoal } = useFinancial();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<CalculatorTab>('emi');

  // ==========================================
  // 1. EMI Calculator State
  // ==========================================
  const [emiPrincipal, setEmiPrincipal] = useState<number>(500000);
  const [emiRate, setEmiRate] = useState<number>(9.5);
  const [emiTenureYears, setEmiTenureYears] = useState<number>(3);

  // EMI Math: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = emiRate / 12 / 100;
  const totalMonths = emiTenureYears * 12;
  const emiMonthly =
    monthlyRate > 0 && totalMonths > 0
      ? (emiPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : emiPrincipal / (totalMonths || 1);
  const emiTotalPayable = emiMonthly * totalMonths;
  const emiTotalInterest = Math.max(0, emiTotalPayable - emiPrincipal);

  // ==========================================
  // 2. SIP Calculator State
  // Inputs: Monthly Investment, Expected Return %, Investment Period
  // Outputs: Invested Amount, Wealth Generated, Total Value
  // ==========================================
  const [sipMonthlyInvestment, setSipMonthlyInvestment] = useState<number>(5000);
  const [sipExpectedReturn, setSipExpectedReturn] = useState<number>(12);
  const [sipInvestmentPeriodYears, setSipInvestmentPeriodYears] = useState<number>(5);

  // SIP Math: FV = P * [(1+i)^n - 1] / i * (1+i)
  const sipMonthlyRate = sipExpectedReturn / 12 / 100;
  const sipTotalMonths = sipInvestmentPeriodYears * 12;
  const sipTotalValue =
    sipMonthlyRate > 0 && sipTotalMonths > 0
      ? sipMonthlyInvestment *
        ((Math.pow(1 + sipMonthlyRate, sipTotalMonths) - 1) / sipMonthlyRate) *
        (1 + sipMonthlyRate)
      : sipMonthlyInvestment * sipTotalMonths;
  const sipInvestedAmount = sipMonthlyInvestment * sipTotalMonths;
  const sipWealthGenerated = Math.max(0, sipTotalValue - sipInvestedAmount);

  // ==========================================
  // 3. Compound Interest Calculator State
  // Inputs: Principal, Interest Rate, Time Period
  // Outputs: Final Amount, Interest Earned
  // ==========================================
  const [ciPrincipal, setCiPrincipal] = useState<number>(100000);
  const [ciRate, setCiRate] = useState<number>(10.5);
  const [ciTimePeriodYears, setCiTimePeriodYears] = useState<number>(5);
  const [ciFrequency, setCiFrequency] = useState<number>(1); // 1 = Annual, 2 = Semi-annual, 4 = Quarterly, 12 = Monthly

  // Compound Interest: A = P(1 + r/n)^(nt)
  const ciFinalAmount =
    ciPrincipal * Math.pow(1 + ciRate / 100 / ciFrequency, ciFrequency * ciTimePeriodYears);
  const ciInterestEarned = Math.max(0, ciFinalAmount - ciPrincipal);

  // ==========================================
  // 4. Savings Goal Calculator State
  // Inputs: Goal Amount, Target Date
  // Outputs: Required Monthly Savings
  // ==========================================
  // Default target date: 1 year from now
  const defaultTargetDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
  };
  const [goalAmount, setGoalAmount] = useState<number>(120000);
  const [goalTargetDate, setGoalTargetDate] = useState<string>(defaultTargetDate());
  const [goalNameInput, setGoalNameInput] = useState<string>('Emergency Fund Cushion');

  // Compute months until target date
  const computeGoalMonths = () => {
    const target = new Date(goalTargetDate);
    const now = new Date();
    if (isNaN(target.getTime())) return 12;
    const diffMonths = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
    return Math.max(1, diffMonths);
  };
  const goalMonthsRemaining = computeGoalMonths();
  const goalRequiredMonthlySavings = Math.ceil(goalAmount / goalMonthsRemaining);
  const goalDailyEquivalent = Math.ceil(goalRequiredMonthlySavings / 30);

  const handleApplyToSavingsGoals = () => {
    addSavingsGoal({
      name: goalNameInput.trim() || 'Savings Target',
      targetAmount: goalAmount,
      currentAmount: 0,
      targetDate: goalTargetDate,
      category: 'Target Milestone',
      color: '#8B1E3F',
    });
    showToast(`Created new savings goal "${goalNameInput}" in your Vault!`, 'success');
    navigate('/savings');
  };

  // ==========================================
  // 5. GST Calculator State (Bonus)
  // ==========================================
  const [gstAmount, setGstAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');

  const calculatedGst =
    gstType === 'exclusive'
      ? (gstAmount * gstRate) / 100
      : gstAmount - gstAmount / (1 + gstRate / 100);
  const calculatedGstTotal = gstType === 'exclusive' ? gstAmount + calculatedGst : gstAmount;

  const tabs: { id: CalculatorTab; label: string }[] = [
    { id: 'emi', label: 'EMI Calculator' },
    { id: 'sip', label: 'SIP Calculator' },
    { id: 'compound', label: 'Compound Interest' },
    { id: 'savings-goal', label: 'Savings Goal Calculator' },
    { id: 'gst', label: 'GST & Tax' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl font-black text-[#242424] tracking-tight">
            Financial Calculators
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Interactive mathematical tools for loan EMIs, systematic wealth generation, compound interest, and savings goals.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-lg border border-[#E5E5E5] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#8B1E3F] text-white shadow-sm'
                : 'text-[#6B6B6B] hover:text-[#242424] hover:bg-[#F7F7F8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==========================================
          TAB 1: EMI CALCULATOR
          Inputs: Loan Amount, Interest Rate, Loan Tenure
          Outputs: Monthly EMI, Total Interest, Total Payment
          ========================================== */}
      {activeTab === 'emi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-6 bg-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
              <h2 className="text-sm font-bold text-[#242424] uppercase tracking-wider">
                EMI Calculator Inputs
              </h2>
              <Badge variant="neutral">Loan Planning</Badge>
            </div>

            {/* Input 1: Loan Amount */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-[#242424]">Loan Amount (₹)</span>
                <span className="font-mono text-[#8B1E3F] font-bold">₹{emiPrincipal.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={5000000}
                step={10000}
                value={emiPrincipal}
                onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                className="w-full accent-[#8B1E3F]"
              />
              <Input
                type="number"
                value={emiPrincipal.toString()}
                onChange={(e) => setEmiPrincipal(Number(e.target.value) || 0)}
                className="mt-2"
              />
            </div>

            {/* Input 2: Interest Rate */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-[#242424]">Interest Rate (% p.a.)</span>
                <span className="font-mono text-[#8B1E3F] font-bold">{emiRate}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={0.1}
                value={emiRate}
                onChange={(e) => setEmiRate(Number(e.target.value))}
                className="w-full accent-[#8B1E3F]"
              />
              <Input
                type="number"
                step="0.1"
                value={emiRate.toString()}
                onChange={(e) => setEmiRate(Number(e.target.value) || 0)}
                className="mt-2"
              />
            </div>

            {/* Input 3: Loan Tenure */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-[#242424]">Loan Tenure (Years)</span>
                <span className="font-mono text-[#8B1E3F] font-bold">
                  {emiTenureYears} Years ({totalMonths} Months)
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={emiTenureYears}
                onChange={(e) => setEmiTenureYears(Number(e.target.value))}
                className="w-full accent-[#8B1E3F]"
              />
              <div className="flex items-center gap-2 mt-2">
                {[1, 3, 5, 10, 15, 20].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setEmiTenureYears(yr)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      emiTenureYears === yr
                        ? 'bg-[#8B1E3F] text-white border-[#8B1E3F]'
                        : 'bg-[#FAFAFA] text-[#6B6B6B] border-[#E5E5E5] hover:bg-white'
                    }`}
                  >
                    {yr}Y
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* EMI Outputs */}
          <Card className="lg:col-span-5 p-6 bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                Monthly EMI Output
              </span>
              <p className="text-3xl font-mono font-black text-[#8B1E3F] mt-1.5">
                ₹{Math.round(emiMonthly).toLocaleString('en-IN')}
                <span className="text-xs text-[#6B6B6B] font-normal"> / month</span>
              </p>

              <div className="space-y-3 mt-6 pt-6 border-t border-[#F0F0F0] text-xs">
                <div className="flex items-center justify-between p-3 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B] font-medium">Principal Loan Amount:</span>
                  <span className="font-mono font-bold text-[#242424]">₹{emiPrincipal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B] font-medium">Total Interest:</span>
                  <span className="font-mono font-bold text-[#C62828]">₹{Math.round(emiTotalInterest).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-[#F8E9EE] text-[#8B1E3F]">
                  <span className="font-bold">Total Payment:</span>
                  <span className="font-mono font-black text-sm">₹{Math.round(emiTotalPayable).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Progress Bar of Principal vs Interest */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-[#6B6B6B]">
                  <span>Principal: {Math.round((emiPrincipal / (emiTotalPayable || 1)) * 100)}%</span>
                  <span>Interest: {Math.round((emiTotalInterest / (emiTotalPayable || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#FCE8E8] rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#8B1E3F]"
                    style={{ width: `${(emiPrincipal / (emiTotalPayable || 1)) * 100}%` }}
                  />
                  <div
                    className="h-full bg-[#C88719]"
                    style={{ width: `${(emiTotalInterest / (emiTotalPayable || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-[#FAFAFA] rounded-md border border-[#E5E5E5] text-[11px] text-[#6B6B6B]">
              <p className="flex items-center gap-1 font-semibold text-[#242424] mb-0.5">
                <Info className="w-3.5 h-3.5 text-[#8B1E3F]" /> Prepayment Power
              </p>
              Making one extra EMI payment every calendar year can shorten your tenure by over 20%.
            </div>
          </Card>
        </div>
      )}

      {/* ==========================================
          TAB 2: SIP CALCULATOR
          Inputs: Monthly Investment, Expected Return %, Investment Period
          Outputs: Invested Amount, Wealth Generated, Total Value
          ========================================== */}
      {activeTab === 'sip' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-6 bg-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
              <h2 className="text-sm font-bold text-[#242424] uppercase tracking-wider">
                SIP Calculator Inputs
              </h2>
              <Badge variant="success">Wealth Multiplication</Badge>
            </div>

            {/* Input 1: Monthly Investment */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-[#242424]">Monthly Investment (₹)</span>
                <span className="font-mono text-[#218739] font-bold">₹{sipMonthlyInvestment.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={500}
                max={200000}
                step={500}
                value={sipMonthlyInvestment}
                onChange={(e) => setSipMonthlyInvestment(Number(e.target.value))}
                className="w-full accent-[#218739]"
              />
              <Input
                type="number"
                value={sipMonthlyInvestment.toString()}
                onChange={(e) => setSipMonthlyInvestment(Number(e.target.value) || 0)}
                className="mt-2"
              />
            </div>

            {/* Input 2: Expected Return % */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-[#242424]">Expected Return (% p.a.)</span>
                <span className="font-mono text-[#218739] font-bold">{sipExpectedReturn}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={0.5}
                value={sipExpectedReturn}
                onChange={(e) => setSipExpectedReturn(Number(e.target.value))}
                className="w-full accent-[#218739]"
              />
              <Input
                type="number"
                step="0.5"
                value={sipExpectedReturn.toString()}
                onChange={(e) => setSipExpectedReturn(Number(e.target.value) || 0)}
                className="mt-2"
              />
            </div>

            {/* Input 3: Investment Period */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-[#242424]">Investment Period (Years)</span>
                <span className="font-mono text-[#218739] font-bold">
                  {sipInvestmentPeriodYears} Years ({sipTotalMonths} Months)
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={35}
                step={1}
                value={sipInvestmentPeriodYears}
                onChange={(e) => setSipInvestmentPeriodYears(Number(e.target.value))}
                className="w-full accent-[#218739]"
              />
              <div className="flex items-center gap-2 mt-2">
                {[1, 3, 5, 10, 15, 20, 25].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSipInvestmentPeriodYears(yr)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      sipInvestmentPeriodYears === yr
                        ? 'bg-[#218739] text-white border-[#218739]'
                        : 'bg-[#FAFAFA] text-[#6B6B6B] border-[#E5E5E5] hover:bg-white'
                    }`}
                  >
                    {yr}Y
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* SIP Outputs */}
          <Card className="lg:col-span-5 p-6 bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                Total Value (Maturity Wealth)
              </span>
              <p className="text-3xl font-mono font-black text-[#218739] mt-1.5">
                ₹{Math.round(sipTotalValue).toLocaleString('en-IN')}
              </p>

              <div className="space-y-3 mt-6 pt-6 border-t border-[#F0F0F0] text-xs">
                <div className="flex items-center justify-between p-3 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B] font-medium">Invested Amount:</span>
                  <span className="font-mono font-bold text-[#242424]">₹{Math.round(sipInvestedAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-[#EAF5EC] text-[#218739]">
                  <span className="font-bold">Wealth Generated (Gain):</span>
                  <span className="font-mono font-black text-sm">₹{Math.round(sipWealthGenerated).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-[#F8E9EE] text-[#8B1E3F]">
                  <span className="font-bold">Total Value:</span>
                  <span className="font-mono font-black text-sm">₹{Math.round(sipTotalValue).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Progress Bar of Invested vs Wealth Generated */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-[#6B6B6B]">
                  <span>Invested: {Math.round((sipInvestedAmount / (sipTotalValue || 1)) * 100)}%</span>
                  <span>Gain: {Math.round((sipWealthGenerated / (sipTotalValue || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#F0F0F0] rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#8B1E3F]"
                    style={{ width: `${(sipInvestedAmount / (sipTotalValue || 1)) * 100}%` }}
                  />
                  <div
                    className="h-full bg-[#218739]"
                    style={{ width: `${(sipWealthGenerated / (sipTotalValue || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-[#FAFAFA] rounded-md border border-[#E5E5E5] text-[11px] text-[#6B6B6B]">
              <p className="font-bold text-[#242424] mb-0.5">Discipline of Auto-Debit</p>
              Scheduling an auto-SIP deduction on the 1st of every month enforces the "Pay Yourself First" principle.
            </div>
          </Card>
        </div>
      )}

      {/* ==========================================
          TAB 3: COMPOUND INTEREST CALCULATOR
          Inputs: Principal, Interest Rate, Time Period
          Outputs: Final Amount, Interest Earned
          ========================================== */}
      {activeTab === 'compound' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-6 bg-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
              <h2 className="text-sm font-bold text-[#242424] uppercase tracking-wider">
                Compound Interest Inputs
              </h2>
              <Badge variant="primary">Compounding Growth</Badge>
            </div>

            {/* Input 1: Principal */}
            <div>
              <Input
                label="Principal Amount (₹)"
                type="number"
                value={ciPrincipal.toString()}
                onChange={(e) => setCiPrincipal(Number(e.target.value) || 0)}
              />
            </div>

            {/* Input 2: Interest Rate & Input 3: Time Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Interest Rate (% p.a.)"
                  type="number"
                  step="0.1"
                  value={ciRate.toString()}
                  onChange={(e) => setCiRate(Number(e.target.value) || 0)}
                />
              </div>

              <div>
                <Input
                  label="Time Period (Years)"
                  type="number"
                  value={ciTimePeriodYears.toString()}
                  onChange={(e) => setCiTimePeriodYears(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Compounding Frequency */}
            <div>
              <Select
                label="Compounding Frequency"
                value={ciFrequency.toString()}
                onChange={(e) => setCiFrequency(Number(e.target.value))}
                options={[
                  { value: '1', label: 'Annually (1x per year)' },
                  { value: '2', label: 'Semi-annually (2x per year)' },
                  { value: '4', label: 'Quarterly (4x per year)' },
                  { value: '12', label: 'Monthly (12x per year)' },
                ]}
              />
            </div>
          </Card>

          {/* Compound Interest Outputs */}
          <Card className="lg:col-span-5 p-6 bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                Final Amount (Maturity Corpus)
              </span>
              <p className="text-3xl font-mono font-black text-[#218739] mt-1.5">
                ₹{Math.round(ciFinalAmount).toLocaleString('en-IN')}
              </p>

              <div className="space-y-3 mt-6 pt-6 border-t border-[#F0F0F0] text-xs">
                <div className="flex items-center justify-between p-3 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B] font-medium">Initial Principal:</span>
                  <span className="font-mono font-bold text-[#242424]">₹{ciPrincipal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-[#EAF5EC] text-[#218739]">
                  <span className="font-bold">Interest Earned:</span>
                  <span className="font-mono font-black text-sm">₹{Math.round(ciInterestEarned).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-[#F8E9EE] text-[#8B1E3F]">
                  <span className="font-bold">Final Amount:</span>
                  <span className="font-mono font-black text-sm">₹{Math.round(ciFinalAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Progress Bar of Principal vs Interest Earned */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-[#6B6B6B]">
                  <span>Principal: {Math.round((ciPrincipal / (ciFinalAmount || 1)) * 100)}%</span>
                  <span>Interest: {Math.round((ciInterestEarned / (ciFinalAmount || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#F0F0F0] rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#8B1E3F]"
                    style={{ width: `${(ciPrincipal / (ciFinalAmount || 1)) * 100}%` }}
                  />
                  <div
                    className="h-full bg-[#218739]"
                    style={{ width: `${(ciInterestEarned / (ciFinalAmount || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-[#FAFAFA] rounded-md border border-[#E5E5E5] text-[11px] text-[#6B6B6B]">
              <p className="font-bold text-[#242424] mb-0.5">The Rule of 72</p>
              Divide 72 by {ciRate}% to find that your money doubles in approximately {(72 / (ciRate || 1)).toFixed(1)} years.
            </div>
          </Card>
        </div>
      )}

      {/* ==========================================
          TAB 4: SAVINGS GOAL CALCULATOR
          Inputs: Goal Amount, Target Date
          Outputs: Required Monthly Savings
          ========================================== */}
      {activeTab === 'savings-goal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-6 bg-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
              <h2 className="text-sm font-bold text-[#242424] uppercase tracking-wider">
                Savings Goal Calculator Inputs
              </h2>
              <Badge variant="primary">Milestone Planner</Badge>
            </div>

            <div>
              <Input
                label="Goal Milestone Name"
                placeholder="e.g. 6-Month Emergency Cushion, Laptop, Trip"
                value={goalNameInput}
                onChange={(e) => setGoalNameInput(e.target.value)}
              />
            </div>

            {/* Input 1: Goal Amount */}
            <div>
              <Input
                label="Goal Amount (₹)"
                type="number"
                value={goalAmount.toString()}
                onChange={(e) => setGoalAmount(Number(e.target.value) || 0)}
              />
            </div>

            {/* Input 2: Target Date */}
            <div>
              <Input
                label="Target Date"
                type="date"
                value={goalTargetDate}
                onChange={(e) => setGoalTargetDate(e.target.value)}
                helperText={`Timeline duration: ${goalMonthsRemaining} month${goalMonthsRemaining !== 1 ? 's' : ''} from today.`}
              />
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={handleApplyToSavingsGoals}
              >
                Add Directly to Smart Savings Vault
              </Button>
            </div>
          </Card>

          {/* Savings Goal Outputs */}
          <Card className="lg:col-span-5 p-6 bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">
                Required Monthly Savings Output
              </span>
              <p className="text-3xl font-mono font-black text-[#8B1E3F] mt-1.5">
                ₹{goalRequiredMonthlySavings.toLocaleString('en-IN')}
                <span className="text-xs text-[#6B6B6B] font-normal"> / month</span>
              </p>

              <div className="space-y-3 mt-6 pt-6 border-t border-[#F0F0F0] text-xs">
                <div className="flex items-center justify-between p-3 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B] font-medium">Total Goal Target:</span>
                  <span className="font-mono font-bold text-[#242424]">₹{goalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B] font-medium">Months Remaining:</span>
                  <span className="font-mono font-bold text-[#242424]">{goalMonthsRemaining} Months</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-[#EAF5EC] text-[#218739]">
                  <span className="font-bold">Daily Equivalent Savings:</span>
                  <span className="font-mono font-black text-sm">~₹{goalDailyEquivalent}/day</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-[#F8E9EE] text-[#8B1E3F]">
                  <span className="font-bold">Required Monthly Savings:</span>
                  <span className="font-mono font-black text-sm">₹{goalRequiredMonthlySavings.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-[#FAFAFA] rounded-md border border-[#E5E5E5] text-[11px] text-[#6B6B6B]">
              <p className="font-bold text-[#242424] mb-0.5">Goal Automation Advice</p>
              Saving ₹{goalDailyEquivalent} per day equates to skipping just one food delivery or beverage daily.
            </div>
          </Card>
        </div>
      )}

      {/* ==========================================
          TAB 5: GST CALCULATOR (BONUS)
          ========================================== */}
      {activeTab === 'gst' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-6 bg-white space-y-5">
            <h2 className="text-sm font-bold text-[#242424] uppercase tracking-wider pb-3 border-b border-[#F0F0F0]">
              GST Tax Calculator
            </h2>

            <div>
              <Input
                label="Amount (₹)"
                type="number"
                value={gstAmount.toString()}
                onChange={(e) => setGstAmount(Number(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#242424] uppercase tracking-wider mb-2">
                Standard GST Slabs
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 12, 18, 28].map((slab) => (
                  <button
                    key={slab}
                    type="button"
                    onClick={() => setGstRate(slab)}
                    className={`py-2 rounded-md font-mono text-xs font-bold border transition-all ${
                      gstRate === slab
                        ? 'bg-[#8B1E3F] text-white border-[#8B1E3F]'
                        : 'bg-white text-[#242424] border-[#E5E5E5] hover:border-[#8B1E3F]'
                    }`}
                  >
                    {slab}% GST
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Select
                label="GST Inclusion Type"
                value={gstType}
                onChange={(e) => setGstType(e.target.value as any)}
                options={[
                  { value: 'exclusive', label: 'GST Exclusive (Add GST to base amount)' },
                  { value: 'inclusive', label: 'GST Inclusive (Extract GST from total amount)' },
                ]}
              />
            </div>
          </Card>

          <Card className="lg:col-span-5 p-6 bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase">Total Invoice Value</span>
              <p className="text-3xl font-mono font-black text-[#242424] mt-1">
                ₹{Math.round(calculatedGstTotal).toLocaleString('en-IN')}
              </p>

              <div className="space-y-3 mt-6 pt-6 border-t border-[#F0F0F0] text-xs">
                <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B]">Net Base Amount:</span>
                  <span className="font-mono font-bold text-[#242424]">
                    ₹{Math.round(gstType === 'exclusive' ? gstAmount : gstAmount - calculatedGst).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B]">CGST ({(gstRate / 2)}%):</span>
                  <span className="font-mono font-bold text-[#6B6B6B]">₹{Math.round(calculatedGst / 2).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B]">SGST ({(gstRate / 2)}%):</span>
                  <span className="font-mono font-bold text-[#6B6B6B]">₹{Math.round(calculatedGst / 2).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#F8E9EE] text-[#8B1E3F]">
                  <span className="font-bold">Total GST Tax ({gstRate}%):</span>
                  <span className="font-mono font-black">₹{Math.round(calculatedGst).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-[#FAFAFA] rounded-md border border-[#E5E5E5] text-[11px] text-[#6B6B6B]">
              <p className="font-bold text-[#242424] mb-0.5">Indian GST Tax Law</p>
              Splits tax equally between CGST (Central) and SGST (State) on intra-state supplies.
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CalculatorPage;
