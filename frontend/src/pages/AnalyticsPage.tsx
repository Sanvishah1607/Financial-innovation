import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  Info,
  ArrowRight
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
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import Card from '../components/Card';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { useFinancial } from '../context/FinancialContext';
import {
  calculateCashFlow,
  calculateCategoryBreakdown,
  calculateDailySpending,
  calculatePaymentMethodBreakdown
} from '../utils/calculations';

export const AnalyticsPage: React.FC = () => {
  const {
    transactions,
    totalIncome,
    totalExpenses,
    savingsRate,
    healthAnalysis,
    personalizedRecommendations
  } = useFinancial();

  const [timeframe, setTimeframe] = useState<'3M' | '6M' | '1Y'>('6M');

  // Dynamic calculations from user's live transactions
  const cashFlowData = useMemo(() => calculateCashFlow(transactions), [transactions]);
  const categoryBreakdown = useMemo(() => calculateCategoryBreakdown(transactions), [transactions]);
  const dailySpending = useMemo(() => calculateDailySpending(transactions), [transactions]);
  const paymentMethodBreakdown = useMemo(() => calculatePaymentMethodBreakdown(transactions), [transactions]);

  const topCategory = categoryBreakdown[0];
  const dominantChannel = paymentMethodBreakdown[0];

  const averageMonthlySpend = useMemo(() => {
    if (cashFlowData.length === 0) return totalExpenses;
    const sum = cashFlowData.reduce((acc, curr) => acc + curr.expenses, 0);
    return Math.round(sum / cashFlowData.length);
  }, [cashFlowData, totalExpenses]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl font-black text-[#242424] tracking-tight">
            Financial Intelligence & Analytics
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Comprehensive data visualizations and machine-driven insights generated purely from your ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-[#E5E5E5] rounded-md p-1 text-xs">
            {(['3M', '6M', '1Y'] as const).map((tf) => (
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

      {/* High Level Metrics Banner (100% Dynamic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white">
          <span className="text-[11px] font-bold text-[#6B6B6B] uppercase">Net Savings Rate</span>
          <p className="text-2xl font-mono font-black text-[#218739] mt-1.5">{savingsRate}%</p>
          <span className="text-[10px] text-[#218739] font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            {savingsRate >= 20 ? 'Optimal (>= 20% benchmark)' : 'Room for improvement (< 20%)'}
          </span>
        </Card>

        <Card className="p-4 bg-white">
          <span className="text-[11px] font-bold text-[#6B6B6B] uppercase">Average Monthly Spend</span>
          <p className="text-2xl font-mono font-black text-[#242424] mt-1.5">
            ₹{averageMonthlySpend.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-[#6B6B6B] font-medium mt-1">
            {cashFlowData.length > 0 ? `Across ${cashFlowData.length} recorded cycle(s)` : 'No historical cycles yet'}
          </span>
        </Card>

        <Card className="p-4 bg-white">
          <span className="text-[11px] font-bold text-[#6B6B6B] uppercase">Top Outflow Category</span>
          <p className="text-2xl font-black text-[#8B1E3F] mt-1.5 truncate">
            {topCategory ? topCategory.category : 'None'}
          </p>
          <span className="text-[10px] text-[#8B1E3F] font-semibold mt-1">
            {topCategory ? `${topCategory.percentage}% of total expenses` : 'No expenses logged'}
          </span>
        </Card>

        <Card className="p-4 bg-white">
          <span className="text-[11px] font-bold text-[#6B6B6B] uppercase">Dominant Channel</span>
          <p className="text-2xl font-black text-[#242424] mt-1.5 truncate">
            {dominantChannel ? dominantChannel.method : 'None'}
          </p>
          <span className="text-[10px] text-[#6B6B6B] font-medium mt-1">
            {dominantChannel ? `${dominantChannel.percentage}% of payment volume` : 'No payment activity'}
          </span>
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
              Monthly breakdown showing consistency in income and expense management.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#218739]">
              <span className="w-3 h-3 rounded-sm bg-[#218739]" /> Inflow (Credit)
            </span>
            <span className="flex items-center gap-1.5 text-[#8B1E3F]">
              <span className="w-3 h-3 rounded-sm bg-[#8B1E3F]" /> Outflow (Debit)
            </span>
          </div>
        </div>

        {cashFlowData.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No Cash Flow Records Found"
              description="Record income and expense transactions to generate dynamic cash flow visualizations."
              actionLabel="Add Transaction"
              onAction={() => window.location.href = '/add-expense'}
            />
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="month" stroke="#6B6B6B" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#6B6B6B"
                  fontSize={11}
                  tickFormatter={(val) => (val >= 1000 ? `₹${val / 1000}k` : `₹${val}`)}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    border: '1px solid #E5E5E5',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="income" name="Income" fill="#218739" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="expenses" name="Expenses" fill="#8B1E3F" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
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
              Category allocation percentage for your recorded transactions.
            </p>

            {categoryBreakdown.length === 0 ? (
              <div className="py-10">
                <EmptyState
                  title="No Expense Data"
                  description="Log your expenses to view visual category proportions."
                  actionLabel="Add Expense"
                  onAction={() => window.location.href = '/add-expense'}
                />
              </div>
            ) : (
              <>
                <div className="h-56 w-full my-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="amount"
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '6px',
                          border: '1px solid #E5E5E5',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 border-t border-[#F0F0F0] pt-4 max-h-40 overflow-y-auto">
                  {categoryBreakdown.slice(0, 5).map((cat) => (
                    <div key={cat.category} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="font-semibold text-[#242424]">{cat.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[#6B6B6B]">₹{cat.amount.toLocaleString('en-IN')}</span>
                        <span className="font-mono font-bold text-[#242424] w-12 text-right">{cat.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Daily Spend Trend & Payment Method Distribution */}
        <Card className="lg:col-span-7 p-6 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-[#242424] uppercase tracking-wider">
                  Spending Velocity (Recent Outflows)
                </h2>
                <p className="text-xs text-[#6B6B6B] mt-0.5">
                  Daily expenditure fluctuations to analyze spending patterns.
                </p>
              </div>
            </div>

            {dailySpending.length === 0 ? (
              <div className="py-10">
                <EmptyState
                  title="No Velocity Data"
                  description="Daily spending curves will appear here as you log transactions over time."
                  actionLabel="Record Outflow"
                  onAction={() => window.location.href = '/add-expense'}
                />
              </div>
            ) : (
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailySpending} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                        fontSize: '12px',
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
            )}
          </div>

          {/* Payment Method Distribution */}
          <div className="mt-6 pt-4 border-t border-[#F0F0F0]">
            <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider mb-3">
              Payment Method Breakdown
            </h3>
            {paymentMethodBreakdown.length === 0 ? (
              <p className="text-xs text-[#6B6B6B]">No payment methods recorded yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {paymentMethodBreakdown.map((method) => (
                  <div key={method.method} className="p-3 bg-[#FAFAFA] rounded-md border border-[#E5E5E5]">
                    <span className="text-[11px] font-semibold text-[#6B6B6B]">{method.method}</span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="font-mono text-sm font-bold text-[#242424]">{method.percentage}%</span>
                      <span className="text-[10px] font-mono text-[#6B6B6B]">₹{method.amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Actionable Financial Insights (Dynamic from User Data) */}
      <div>
        <h2 className="text-xs font-bold text-[#242424] uppercase tracking-wider mb-3">
          Automated Behavioral Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {healthAnalysis.factors.map((factor, idx) => (
            <Card
              key={idx}
              className={`p-4 bg-white border-l-4 ${
                factor.status === 'good'
                  ? 'border-l-[#218739]'
                  : factor.status === 'warning'
                  ? 'border-l-[#C88719]'
                  : 'border-l-[#C62828]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    factor.status === 'good'
                      ? 'bg-[#EAF5EC] text-[#218739]'
                      : factor.status === 'warning'
                      ? 'bg-[#FDF6E9] text-[#C88719]'
                      : 'bg-[#FCE8E8] text-[#C62828]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-[#242424]">{factor.name}</h4>
                    <span className="font-mono text-xs font-bold text-[#6B6B6B]">
                      {factor.score}/{factor.maxScore} pts
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                    {factor.detail}
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
