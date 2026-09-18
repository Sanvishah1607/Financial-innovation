import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { useFinancial } from '../context/FinancialContext';
import {
  mockCashFlowData,
  mockCategoryBreakdown,
  mockDailySpending,
  mockPaymentMethodBreakdown,
  mockFinancialInsights
} from '../data/mockAnalytics';

export const AnalyticsPage: React.FC = () => {
  const { totalIncome, totalExpenses, savingsRate } = useFinancial();
  const [timeframe, setTimeframe] = useState<'3M' | '6M' | '1Y'>('6M');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl font-black text-[#242424] tracking-tight">
            Financial Intelligence & Analytics
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Comprehensive data visualizations and machine-driven insights into your cash flow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-[#E5E5E5] rounded-md p-1 text-xs">
            {(['3M', '6M', '1Y'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-[#8B1E3F] text-white shadow-sm'
                    : 'text-[#6B6B6B] hover:text-[#242424]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* High Level Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white">
          <span className="text-[11px] font-bold text-[#6B6B6B] uppercase">Net Savings Rate</span>
          <p className="text-2xl font-mono font-black text-[#218739] mt-1.5">{savingsRate}%</p>
          <span className="text-[10px] text-[#218739] font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> Healthy threshold (&gt; 20%)
          </span>
        </Card>

        <Card className="p-4 bg-white">
          <span className="text-[11px] font-bold text-[#6B6B6B] uppercase">Average Monthly Spend</span>
          <p className="text-2xl font-mono font-black text-[#242424] mt-1.5">₹21,800</p>
          <span className="text-[10px] text-[#6B6B6B] font-medium mt-1">Across 6 recorded months</span>
        </Card>

        <Card className="p-4 bg-white">
          <span className="text-[11px] font-bold text-[#6B6B6B] uppercase">Top Outflow Category</span>
          <p className="text-2xl font-black text-[#8B1E3F] mt-1.5">Food & Dining</p>
          <span className="text-[10px] text-[#8B1E3F] font-semibold mt-1">29.8% of total expenses</span>
        </Card>

        <Card className="p-4 bg-white">
          <span className="text-[11px] font-bold text-[#6B6B6B] uppercase">Dominant Channel</span>
          <p className="text-2xl font-black text-[#242424] mt-1.5">UPI / QR</p>
          <span className="text-[10px] text-[#6B6B6B] font-medium mt-1">68% of transaction volume</span>
        </Card>
      </div>

      {/* Main Cash Flow Chart */}
      <Card className="p-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-sm font-bold text-[#242424] uppercase tracking-wider">
              Cash Flow Dynamics (Income vs. Expenses)
            </h2>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              Monthly breakdown showing consistency in income and expense moderation.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#218739]">
              <span className="w-3 h-3 rounded-sm bg-[#218739]" /> Income
            </span>
            <span className="flex items-center gap-1.5 text-[#8B1E3F]">
              <span className="w-3 h-3 rounded-sm bg-[#8B1E3F]" /> Expenses
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockCashFlowData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
              <XAxis dataKey="month" stroke="#6B6B6B" fontSize={12} tickLine={false} />
              <YAxis stroke="#6B6B6B" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  border: '1px solid #E5E5E5',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="income" name="Income" fill="#218739" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="expenses" name="Expenses" fill="#8B1E3F" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Row 2: Category Donut & Daily Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Donut */}
        <Card className="lg:col-span-5 p-6 bg-white flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#242424] uppercase tracking-wider">
              Expense Distribution
            </h2>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              Category allocation percentage for current cycle.
            </p>

            <div className="h-56 w-full my-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockCategoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {mockCategoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '6px',
                      border: '1px solid #E5E5E5',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 border-t border-[#F0F0F0] pt-4">
            {mockCategoryBreakdown.slice(0, 5).map(cat => (
              <div key={cat.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="font-semibold text-[#242424]">{cat.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[#6B6B6B]">₹{cat.amount.toLocaleString('en-IN')}</span>
                  <span className="font-mono font-bold text-[#242424] w-10 text-right">{cat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 14-Day Daily Spend Trend */}
        <Card className="lg:col-span-7 p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#242424] uppercase tracking-wider">
                14-Day Spending Velocity
              </h2>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                Daily expenditure fluctuations to identify weekend spikes.
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockDailySpending} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B1E3F" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8B1E3F" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="day" stroke="#6B6B6B" fontSize={11} tickLine={false} />
                <YAxis stroke="#6B6B6B" fontSize={11} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Daily Spend']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    border: '1px solid #E5E5E5',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#8B1E3F"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#spendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Method Distribution */}
          <div className="mt-6 pt-4 border-t border-[#F0F0F0]">
            <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider mb-3">
              Payment Method Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {mockPaymentMethodBreakdown.map(method => (
                <div key={method.method} className="p-3 bg-[#FAFAFA] rounded-md border border-[#E5E5E5]">
                  <span className="text-[11px] font-semibold text-[#6B6B6B]">{method.method}</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-mono text-sm font-bold text-[#242424]">{method.percentage}%</span>
                    <span className="text-[10px] font-mono text-[#6B6B6B]">₹{method.amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Actionable Financial Insights */}
      <div>
        <h2 className="text-xs font-bold text-[#242424] uppercase tracking-wider mb-3">
          Automated Behavioral Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockFinancialInsights.map((insight, idx) => (
            <Card
              key={idx}
              className={`p-4 bg-white border-l-4 ${
                insight.type === 'positive'
                  ? 'border-l-[#218739]'
                  : insight.type === 'warning'
                  ? 'border-l-[#C88719]'
                  : 'border-l-[#8B1E3F]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    insight.type === 'positive'
                      ? 'bg-[#EAF5EC] text-[#218739]'
                      : insight.type === 'warning'
                      ? 'bg-[#FDF6E9] text-[#C88719]'
                      : 'bg-[#F8E9EE] text-[#8B1E3F]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#242424]">{insight.title}</h4>
                  <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
