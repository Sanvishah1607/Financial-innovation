import React, { useMemo } from 'react';
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
  PieChart as PieChartIcon,
  Sparkles,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Camera
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
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import TransactionRow from '../components/TransactionRow';
import {
  calculateCashFlow,
  calculateCategoryBreakdown
} from '../utils/calculations';

export const DashboardPage: React.FC = () => {
  const {
    user,
    transactions,
    totalIncome,
    totalExpenses,
    currentBalance,
    savingsRate,
    currentMonthSpending,
    budgetUtilizationPercentage,
    savingsProgressPercentage,
    healthAnalysis,
    personalizedRecommendations,
    deleteTransaction,
    budgets,
    savingsGoals
  } = useFinancial();

  // Dynamic Cash Flow and Category Breakdown from logged-in user's actual transactions
  const cashFlowData = useMemo(() => calculateCashFlow(transactions), [transactions]);
  const categoryBreakdown = useMemo(() => calculateCategoryBreakdown(transactions), [transactions]);

  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

  return (
    <div className="space-y-6">
      {/* 1. Greeting & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl font-black text-[#242424] tracking-tight">
            Welcome back, {user.fullName}
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Real-time financial telemetry, dynamic ledger insights, and non-custodial transaction shield.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link to="/receipt-scanner">
            <Button variant="outline" icon={<Camera className="w-4 h-4 text-[#8B1E3F]" />}>
              Scan Receipt
            </Button>
          </Link>
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

      {/* 2. Four Main Dynamic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Current Month's Spending */}
        <StatCard
          title="Current Month Spend"
          amount={`₹${currentMonthSpending.toLocaleString('en-IN')}`}
          icon={<CreditCard className="w-5 h-5" />}
          trend={currentMonthSpending > totalIncome * 0.75 && totalIncome > 0 ? 'down' : 'up'}
          trendValue={`${transactions.filter((t) => t.type === 'expense').length} debits`}
          isPositive={totalIncome === 0 || currentMonthSpending <= totalIncome * 0.75}
          comparisonText={totalIncome > 0 ? `of ₹${totalIncome.toLocaleString('en-IN')} total inflow` : 'Total expenses to date'}
        />

        {/* Metric 2: Budget Utilization % */}
        <StatCard
          title="Budget Utilization"
          amount={`${budgetUtilizationPercentage}%`}
          icon={<PieChartIcon className="w-5 h-5" />}
          trend={budgetUtilizationPercentage > 85 ? 'down' : 'up'}
          trendValue={budgetUtilizationPercentage > 100 ? 'Exceeded' : budgetUtilizationPercentage > 80 ? 'Warning' : 'Within Budget'}
          isPositive={budgetUtilizationPercentage <= 80}
          comparisonText={`${budgets.length} configured limits`}
        />

        {/* Metric 3: Savings Progress */}
        <StatCard
          title="Savings Progress"
          amount={`${savingsProgressPercentage}%`}
          icon={<PiggyBank className="w-5 h-5" />}
          trend="up"
          trendValue={`${savingsGoals.length} Active Goals`}
          isPositive={true}
          comparisonText={`${savingsRate}% of income saved`}
        />

        {/* Metric 4: Financial Health Score */}
        <StatCard
          title="Financial Health Score"
          amount={`${healthAnalysis.score}/100`}
          icon={<Activity className="w-5 h-5" />}
          trend={healthAnalysis.score >= 65 ? 'up' : 'down'}
          trendValue={healthAnalysis.tier}
          isPositive={healthAnalysis.score >= 65}
          comparisonText="Telemetry score"
        />
      </div>

      {/* 3. Dynamic Charts: Cash Flow & Spending Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Cash Flow Chart (2 cols) */}
        <Card
          title="Cash Flow Dynamics"
          subtitle="Monthly income vs. expense outlays based on your ledger (INR ₹)"
          className="lg:col-span-2"
          action={
            <Link to="/analytics" className="text-xs font-bold text-[#8B1E3F] hover:underline flex items-center gap-1">
              <span>Detailed Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          {cashFlowData.length === 0 ? (
            <div className="py-12">
              <EmptyState
                title="No Cash Flow Recorded Yet"
                description="Start logging income and expenses to generate your personal cash flow visualization."
                actionLabel="Record Your First Expense"
                onAction={() => window.location.href = '/add-expense'}
              />
            </div>
          ) : (
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cashFlowData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B6B6B' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6B6B6B' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => (v >= 1000 ? `₹${v / 1000}k` : `₹${v}`)}
                  />
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
          )}
        </Card>

        {/* Spending Breakdown Donut Chart (1 col) */}
        <Card
          title="Spending by Category"
          subtitle="Dynamic expense distribution this cycle"
          action={
            <Link to="/budget" className="text-xs font-bold text-[#8B1E3F] hover:underline">
              Manage Budgets
            </Link>
          }
        >
          {categoryBreakdown.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="No Expenses Logged"
                description="Record expenses to see category proportions and spending patterns."
                actionLabel="Add Expense"
                onAction={() => window.location.href = '/add-expense'}
              />
            </div>
          ) : (
            <>
              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {categoryBreakdown.map((entry, index) => (
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

              <div className="space-y-1.5 mt-2 max-h-32 overflow-y-auto pr-1">
                {categoryBreakdown.slice(0, 5).map((c) => (
                  <div key={c.category} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-[#4A4A4A] truncate">{c.category}</span>
                    </div>
                    <div className="font-bold text-[#242424] shrink-0">
                      ₹{c.amount.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-[#6B6B6B] font-normal">({c.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* 4. Bottom Grid: Recent Transactions & Personalized Financial Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List (2 cols) */}
        <Card
          title="Recent Transactions"
          subtitle="Your recorded incoming and outgoing transaction entries"
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
          {recentTransactions.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="No Transactions Found"
                description="Your transaction ledger is currently empty. Record your first payment or income entry."
                actionLabel="Record Transaction"
                onAction={() => window.location.href = '/add-expense'}
              />
            </div>
          ) : (
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
          )}
        </Card>

        {/* Personalized Recommendations & Financial Health Widget (1 col) */}
        <div className="space-y-4">
          <Card
            title="Personalized Insights"
            subtitle="Adaptive guidance from your data"
            action={
              <Link to="/learn" className="text-xs font-bold text-[#8B1E3F] hover:underline">
                Academy
              </Link>
            }
          >
            <div className="space-y-3">
              {/* Financial Health Snapshot */}
              <div
                className="p-3 rounded-md border flex items-center justify-between"
                style={{
                  backgroundColor: healthAnalysis.score >= 70 ? '#EAF5EC' : healthAnalysis.score >= 50 ? '#FDF6E9' : '#FCE8E8',
                  borderColor: healthAnalysis.score >= 70 ? '#CDE5D2' : healthAnalysis.score >= 50 ? '#F5E0B7' : '#F8B4B4',
                }}
              >
                <div className="flex items-center gap-2">
                  <Activity
                    className="w-4 h-4"
                    style={{ color: healthAnalysis.color }}
                  />
                  <span className="text-xs font-bold" style={{ color: healthAnalysis.color }}>
                    Health: {healthAnalysis.tier} ({healthAnalysis.score}/100)
                  </span>
                </div>
                <span
                  className="text-[10px] font-extrabold uppercase text-white px-2 py-0.5 rounded"
                  style={{ backgroundColor: healthAnalysis.color }}
                >
                  Live
                </span>
              </div>

              {/* Dynamic Recommendations List */}
              <div className="space-y-2.5">
                {personalizedRecommendations.slice(0, 3).map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-md text-xs space-y-1 hover:border-[#8B1E3F]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#242424] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#8B1E3F]" />
                        {rec.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B6B6B] leading-relaxed">
                      {rec.description}
                    </p>
                    {rec.actionUrl && (
                      <Link
                        to={rec.actionUrl}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8B1E3F] hover:underline pt-0.5"
                      >
                        <span>{rec.actionText || 'Learn More'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Digital Safety Reminder Banner */}
              <div className="p-3 bg-[#F8E9EE] border border-[#E9C8D4] rounded-md text-xs space-y-1">
                <div className="font-bold text-[#8B1E3F] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Fraud Defense Shield:</span>
                </div>
                <p className="text-[11px] text-[#64152E]">
                  Never enter a UPI PIN or scan a QR code to receive a payment or refund.
                </p>
                <Link to="/scam-checker" className="block pt-1">
                  <Button variant="outline" fullWidth size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                    Test Message with Scam Shield
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
