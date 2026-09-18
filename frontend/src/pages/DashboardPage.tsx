import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Plus,
  ArrowRight,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Receipt,
  PieChart as PieChartIcon
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
  Cell
} from 'recharts';
import { useFinancial } from '../context/FinancialContext';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import Button from '../components/Button';
import TransactionRow from '../components/TransactionRow';
import { mockCashFlowData, mockCategoryBreakdown } from '../data/mockAnalytics';

export const DashboardPage: React.FC = () => {
  const {
    user,
    transactions,
    totalIncome,
    totalExpenses,
    currentBalance,
    savingsRate,
    deleteTransaction
  } = useFinancial();

  const recentTransactions = transactions.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Greeting & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl font-black text-[#242424] tracking-tight">
            Good evening, {user.fullName.split(' ')[0]}
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Here's your real-time financial overview and digital transaction shield.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/add-expense">
            <Button icon={<Plus className="w-4 h-4" />}>
              Add Expense
            </Button>
          </Link>
          <Link to="/scam-checker">
            <Button variant="secondary" icon={<ShieldCheck className="w-4 h-4 text-[#8B1E3F]" />}>
              Scam Shield
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          amount={`₹${totalIncome.toLocaleString('en-IN')}`}
          icon={<Wallet className="w-5 h-5" />}
          trend="up"
          trendValue="+12.5%"
          isPositive={true}
          comparisonText="vs previous month"
        />

        <StatCard
          title="Total Expenses"
          amount={`₹${totalExpenses.toLocaleString('en-IN')}`}
          icon={<CreditCard className="w-5 h-5" />}
          trend="up"
          trendValue="+8.2%"
          isPositive={false}
          comparisonText="vs previous month"
        />

        <StatCard
          title="Current Balance"
          amount={`₹${currentBalance.toLocaleString('en-IN')}`}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="up"
          trendValue="Healthy"
          isPositive={true}
          comparisonText="Liquid available"
        />

        <StatCard
          title="Savings Rate"
          amount={`${savingsRate}%`}
          icon={<PiggyBank className="w-5 h-5" />}
          trend="up"
          trendValue="+5%"
          isPositive={true}
          comparisonText="Target: 20%"
        />
      </div>

      {/* Charts Section: Cash Flow & Spending Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Cash Flow Chart (2 cols) */}
        <Card
          title="Cash Flow Overview"
          subtitle="Income vs. Expenses over the last 6 months (INR ₹)"
          className="lg:col-span-2"
          action={
            <Link to="/analytics" className="text-xs font-bold text-[#8B1E3F] hover:underline flex items-center gap-1">
              <span>Detailed Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockCashFlowData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B6B6B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B6B6B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #E5E5E5', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="income" name="Income" fill="#218739" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="expenses" name="Expenses" fill="#8B1E3F" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Spending Breakdown Donut Chart (1 col) */}
        <Card
          title="Spending Breakdown"
          subtitle="Category distribution this month"
          action={
            <Link to="/budget" className="text-xs font-bold text-[#8B1E3F] hover:underline">
              Budgets
            </Link>
          }
        >
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {mockCategoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #E5E5E5', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-2 max-h-28 overflow-y-auto pr-1">
            {mockCategoryBreakdown.slice(0, 4).map((c) => (
              <div key={c.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-[#4A4A4A]">{c.category}</span>
                </div>
                <div className="font-bold text-[#242424]">
                  ₹{c.amount.toLocaleString('en-IN')} <span className="text-[10px] text-[#6B6B6B] font-normal">({c.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Grid: Recent Expenses & Security Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List (2 cols) */}
        <Card
          title="Recent Transactions"
          subtitle="Latest debits and credit entries"
          className="lg:col-span-2"
          action={
            <Link
              to="/transactions"
              className="text-xs font-bold text-[#8B1E3F] hover:underline inline-flex items-center gap-1"
            >
              <span>View All Transactions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="divide-y divide-[#F0F0F0] -mx-5 -my-2">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="px-5">
                <TransactionRow
                  transaction={tx}
                  onDelete={deleteTransaction}
                  showActions={true}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Security Center Widget (1 col) */}
        <div className="space-y-4">
          <Card
            title="Digital Security Center"
            subtitle="Safety health & protection tips"
          >
            <div className="space-y-3.5">
              <div className="p-3 bg-[#EAF5EC] border border-[#CDE5D2] rounded-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#218739]" />
                  <span className="text-xs font-bold text-[#218739]">
                    2FA Security Enabled
                  </span>
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-[#218739] text-white px-2 py-0.5 rounded">
                  Active
                </span>
              </div>

              <div className="text-xs space-y-2 text-[#4A4A4A]">
                <div className="flex justify-between py-1 border-b border-[#F0F0F0]">
                  <span className="text-[#6B6B6B]">Recent Auth Login:</span>
                  <span className="font-semibold">Today, 04:30 PM (Chrome on Mac)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F0F0F0]">
                  <span className="text-[#6B6B6B]">Password Strength:</span>
                  <span className="font-semibold text-[#218739]">Strong (14 chars)</span>
                </div>
              </div>

              <div className="p-3 bg-[#F8E9EE] border border-[#E9C8D4] rounded-md text-xs space-y-1">
                <div className="font-bold text-[#8B1E3F] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Important Safety Reminders:</span>
                </div>
                <ul className="text-[11px] text-[#64152E] space-y-1 list-disc pl-4 pt-1">
                  <li>Never share OTPs or UPI PINs with callers.</li>
                  <li>Verify payment requests before tapping approve.</li>
                  <li>Do not click unverified APK download links.</li>
                </ul>
              </div>

              <Link to="/scam-checker" className="block w-full">
                <Button variant="outline" fullWidth size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                  Run Scam Message Audit
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
