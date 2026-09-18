import React, { useState } from 'react';
import {
  Calculator as CalcIcon,
  TrendingUp,
  Percent,
  PiggyBank,
  DollarSign,
  ArrowRight,
  Info,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Badge from '../components/Badge';

type CalculatorTab = 'emi' | 'compound' | 'simple' | 'sip' | 'gst';

export const CalculatorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('emi');

  // EMI State
  const [emiPrincipal, setEmiPrincipal] = useState<number>(500000);
  const [emiRate, setEmiRate] = useState<number>(9.5);
  const [emiTenureYears, setEmiTenureYears] = useState<number>(3);

  // Compound Interest State
  const [ciPrincipal, setCiPrincipal] = useState<number>(100000);
  const [ciRate, setCiRate] = useState<number>(12);
  const [ciYears, setCiYears] = useState<number>(5);
  const [ciFrequency, setCiFrequency] = useState<number>(1); // 1 = Annual, 4 = Quarterly, 12 = Monthly

  // Simple Interest State
  const [siPrincipal, setSiPrincipal] = useState<number>(50000);
  const [siRate, setSiRate] = useState<number>(7);
  const [siYears, setSiYears] = useState<number>(3);

  // SIP / Savings Target State
  const [sipTarget, setSipTarget] = useState<number>(500000);
  const [sipYears, setSipYears] = useState<number>(3);
  const [sipExpectedRate, setSipExpectedRate] = useState<number>(12);

  // GST & Discount State
  const [gstAmount, setGstAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');

  // Calculations
  // 1. EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = emiRate / 12 / 100;
  const totalMonths = emiTenureYears * 12;
  const emiMonthly =
    monthlyRate > 0 && totalMonths > 0
      ? (emiPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : 0;
  const emiTotalPayable = emiMonthly * totalMonths;
  const emiTotalInterest = emiTotalPayable - emiPrincipal;

  // 2. Compound Interest: A = P(1 + r/n)^(nt)
  const ciAmount =
    ciPrincipal * Math.pow(1 + ciRate / 100 / ciFrequency, ciFrequency * ciYears);
  const ciInterest = ciAmount - ciPrincipal;

  // 3. Simple Interest: SI = (P * R * T) / 100
  const siInterest = (siPrincipal * siRate * siYears) / 100;
  const siTotalAmount = siPrincipal + siInterest;

  // 4. SIP Target: PMT = FV * i / ((1 + i)^n - 1)
  const sipMonthlyRate = sipExpectedRate / 12 / 100;
  const sipTotalMonths = sipYears * 12;
  const sipMonthlyNeeded =
    sipMonthlyRate > 0 && sipTotalMonths > 0
      ? (sipTarget * sipMonthlyRate) / (Math.pow(1 + sipMonthlyRate, sipTotalMonths) - 1)
      : sipTarget / (sipTotalMonths || 1);
  const sipTotalInvested = sipMonthlyNeeded * sipTotalMonths;
  const sipWealthGain = Math.max(0, sipTarget - sipTotalInvested);

  // 5. GST Calculations
  const calculatedGst =
    gstType === 'exclusive'
      ? (gstAmount * gstRate) / 100
      : gstAmount - gstAmount / (1 + gstRate / 100);
  const calculatedGstTotal =
    gstType === 'exclusive' ? gstAmount + calculatedGst : gstAmount;
  const basePriceInclusive = gstAmount - calculatedGst;

  const tabs = [
    { id: 'emi', label: 'Loan EMI' },
    { id: 'compound', label: 'Compound Growth' },
    { id: 'simple', label: 'Simple Interest' },
    { id: 'sip', label: 'SIP & Goal Target' },
    { id: 'gst', label: 'GST & Tax' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl font-black text-[#242424] tracking-tight">
            Financial Precision Tools
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Interactive calculators for loans, compound wealth multiplication, and savings planning.
          </p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-lg border border-[#E5E5E5] overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CalculatorTab)}
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

      {/* Tab 1: EMI Calculator */}
      {activeTab === 'emi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-6 bg-white space-y-5">
            <h2 className="text-sm font-bold text-[#242424] uppercase tracking-wider pb-3 border-b border-[#F0F0F0]">
              Loan Parameters
            </h2>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-[#242424]">Principal Loan Amount (₹)</span>
                <span className="font-mono text-[#8B1E3F] font-bold">₹{emiPrincipal.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={5000000}
                step={10000}
                value={emiPrincipal}
                onChange={e => setEmiPrincipal(Number(e.target.value))}
                className="w-full accent-[#8B1E3F]"
              />
              <Input
                type="number"
                value={emiPrincipal.toString()}
                onChange={e => setEmiPrincipal(Number(e.target.value) || 0)}
                className="mt-2"
              />
            </div>

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
                onChange={e => setEmiRate(Number(e.target.value))}
                className="w-full accent-[#8B1E3F]"
              />
              <Input
                type="number"
                step="0.1"
                value={emiRate.toString()}
                onChange={e => setEmiRate(Number(e.target.value) || 0)}
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-[#242424]">Loan Tenure (Years)</span>
                <span className="font-mono text-[#8B1E3F] font-bold">{emiTenureYears} Years ({totalMonths} Months)</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={emiTenureYears}
                onChange={e => setEmiTenureYears(Number(e.target.value))}
                className="w-full accent-[#8B1E3F]"
              />
            </div>
          </Card>

          <Card className="lg:col-span-5 p-6 bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase">Monthly EMI Payment</span>
              <p className="text-3xl font-mono font-black text-[#8B1E3F] mt-1">
                ₹{Math.round(emiMonthly).toLocaleString('en-IN')}
                <span className="text-xs text-[#6B6B6B] font-normal"> / month</span>
              </p>

              <div className="space-y-3 mt-6 pt-6 border-t border-[#F0F0F0] text-xs">
                <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B]">Principal Loan:</span>
                  <span className="font-mono font-bold text-[#242424]">₹{emiPrincipal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B]">Total Interest Cost:</span>
                  <span className="font-mono font-bold text-[#C62828]">₹{Math.round(emiTotalInterest).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#F8E9EE] text-[#8B1E3F]">
                  <span className="font-bold">Total Amount Payable:</span>
                  <span className="font-mono font-black text-sm">₹{Math.round(emiTotalPayable).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-[#FAFAFA] rounded-md border border-[#E5E5E5] text-[11px] text-[#6B6B6B]">
              <p className="flex items-center gap-1 font-semibold text-[#242424] mb-0.5">
                <Info className="w-3.5 h-3.5 text-[#8B1E3F]" /> Bank Tip
              </p>
              Prepaying even 5% extra every year can reduce your total loan tenure by up to 18%.
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Compound Interest Calculator */}
      {activeTab === 'compound' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-6 bg-white space-y-5">
            <h2 className="text-sm font-bold text-[#242424] uppercase tracking-wider pb-3 border-b border-[#F0F0F0]">
              Compound Growth Inputs
            </h2>

            <div>
              <Input
                label="Initial Principal Amount (₹)"
                type="number"
                value={ciPrincipal.toString()}
                onChange={e => setCiPrincipal(Number(e.target.value) || 0)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Annual Return Rate (%)"
                  type="number"
                  step="0.1"
                  value={ciRate.toString()}
                  onChange={e => setCiRate(Number(e.target.value) || 0)}
                />
              </div>

              <div>
                <Input
                  label="Investment Time (Years)"
                  type="number"
                  value={ciYears.toString()}
                  onChange={e => setCiYears(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <Select
                label="Compounding Frequency"
                value={ciFrequency.toString()}
                onChange={e => setCiFrequency(Number(e.target.value))}
                options={[
                  { value: '1', label: 'Annually (1x per year)' },
                  { value: '4', label: 'Quarterly (4x per year)' },
                  { value: '12', label: 'Monthly (12x per year)' }
                ]}
              />
            </div>
          </Card>

          <Card className="lg:col-span-5 p-6 bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase">Maturity Value</span>
              <p className="text-3xl font-mono font-black text-[#218739] mt-1">
                ₹{Math.round(ciAmount).toLocaleString('en-IN')}
              </p>

              <div className="space-y-3 mt-6 pt-6 border-t border-[#F0F0F0] text-xs">
                <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B]">Initial Investment:</span>
                  <span className="font-mono font-bold text-[#242424]">₹{ciPrincipal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#EAF5EC] text-[#218739]">
                  <span className="font-bold">Total Compound Interest Earned:</span>
                  <span className="font-mono font-black">₹{Math.round(ciInterest).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-[#FAFAFA] rounded-md border border-[#E5E5E5] text-[11px] text-[#6B6B6B]">
              <p className="font-bold text-[#242424] mb-0.5">The 8th Wonder of the World</p>
              "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it."
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Simple Interest */}
      {activeTab === 'simple' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-6 bg-white space-y-5">
            <h2 className="text-sm font-bold text-[#242424] uppercase tracking-wider pb-3 border-b border-[#F0F0F0]">
              Simple Interest Parameters
            </h2>

            <div>
              <Input
                label="Principal Amount (₹)"
                type="number"
                value={siPrincipal.toString()}
                onChange={e => setSiPrincipal(Number(e.target.value) || 0)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Interest Rate (% p.a.)"
                  type="number"
                  step="0.1"
                  value={siRate.toString()}
                  onChange={e => setSiRate(Number(e.target.value) || 0)}
                />
              </div>

              <div>
                <Input
                  label="Time Period (Years)"
                  type="number"
                  value={siYears.toString()}
                  onChange={e => setSiYears(Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-5 p-6 bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase">Total Maturity Amount</span>
              <p className="text-3xl font-mono font-black text-[#242424] mt-1">
                ₹{Math.round(siTotalAmount).toLocaleString('en-IN')}
              </p>

              <div className="space-y-3 mt-6 pt-6 border-t border-[#F0F0F0] text-xs">
                <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B]">Principal:</span>
                  <span className="font-mono font-bold text-[#242424]">₹{siPrincipal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B]">Simple Interest:</span>
                  <span className="font-mono font-bold text-[#218739]">₹{Math.round(siInterest).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-[#FAFAFA] rounded-md border border-[#E5E5E5] text-[11px] text-[#6B6B6B]">
              <p className="font-bold text-[#242424] mb-0.5">Formula Applied</p>
              SI = (Principal × Rate × Time) / 100
            </div>
          </Card>
        </div>
      )}

      {/* Tab 4: SIP & Target Savings */}
      {activeTab === 'sip' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 p-6 bg-white space-y-5">
            <h2 className="text-sm font-bold text-[#242424] uppercase tracking-wider pb-3 border-b border-[#F0F0F0]">
              Goal Target Parameters
            </h2>

            <div>
              <Input
                label="Target Goal Wealth (₹)"
                type="number"
                value={sipTarget.toString()}
                onChange={e => setSipTarget(Number(e.target.value) || 0)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Expected Return (% p.a.)"
                  type="number"
                  step="0.5"
                  value={sipExpectedRate.toString()}
                  onChange={e => setSipExpectedRate(Number(e.target.value) || 0)}
                />
              </div>

              <div>
                <Input
                  label="Target Time Frame (Years)"
                  type="number"
                  value={sipYears.toString()}
                  onChange={e => setSipYears(Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-5 p-6 bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase">Required Monthly SIP</span>
              <p className="text-3xl font-mono font-black text-[#8B1E3F] mt-1">
                ₹{Math.round(sipMonthlyNeeded).toLocaleString('en-IN')}
                <span className="text-xs text-[#6B6B6B] font-normal"> / month</span>
              </p>

              <div className="space-y-3 mt-6 pt-6 border-t border-[#F0F0F0] text-xs">
                <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B]">Total Amount You Deposit:</span>
                  <span className="font-mono font-bold text-[#242424]">₹{Math.round(sipTotalInvested).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#EAF5EC] text-[#218739]">
                  <span className="font-bold">Estimated Returns / Growth:</span>
                  <span className="font-mono font-black">₹{Math.round(sipWealthGain).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-[#FAFAFA] rounded-md border border-[#E5E5E5] text-[11px] text-[#6B6B6B]">
              <p className="font-bold text-[#242424] mb-0.5">Automated Discipline</p>
              Setting up an auto-debit on the 1st of every month ensures you pay yourself first before spending.
            </div>
          </Card>
        </div>
      )}

      {/* Tab 5: GST Calculator */}
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
                onChange={e => setGstAmount(Number(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#242424] uppercase tracking-wider mb-2">
                Standard GST Slabs
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 12, 18, 28].map(slab => (
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
                onChange={e => setGstType(e.target.value as any)}
                options={[
                  { value: 'exclusive', label: 'GST Exclusive (Add GST to base price)' },
                  { value: 'inclusive', label: 'GST Inclusive (Extract GST from total MRP)' }
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
                    ₹{Math.round(gstType === 'exclusive' ? gstAmount : basePriceInclusive).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B]">CGST ({(gstRate / 2)}%):</span>
                  <span className="font-mono font-bold text-[#6B6B6B]">
                    ₹{Math.round(calculatedGst / 2).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#FAFAFA]">
                  <span className="text-[#6B6B6B]">SGST ({(gstRate / 2)}%):</span>
                  <span className="font-mono font-bold text-[#6B6B6B]">
                    ₹{Math.round(calculatedGst / 2).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#F8E9EE] text-[#8B1E3F]">
                  <span className="font-bold">Total GST Component ({gstRate}%):</span>
                  <span className="font-mono font-black">₹{Math.round(calculatedGst).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-[#FAFAFA] rounded-md border border-[#E5E5E5] text-[11px] text-[#6B6B6B]">
              <p className="font-bold text-[#242424] mb-0.5">Indian GST Compliance</p>
              Applies equal division between Central (CGST) and State (SGST) for intra-state supply.
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CalculatorPage;
