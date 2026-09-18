import { CashFlowMonth, CategorySpending, DailySpend } from '../types';

export const mockCashFlowData: CashFlowMonth[] = [
  { month: 'Apr', income: 42000, expenses: 24500, savings: 17500 },
  { month: 'May', income: 42000, expenses: 26100, savings: 15900 },
  { month: 'Jun', income: 45000, expenses: 25400, savings: 19600 },
  { month: 'Jul', income: 45000, expenses: 28900, savings: 16100 },
  { month: 'Aug', income: 45000, expenses: 25400, savings: 19600 },
  { month: 'Sep', income: 53500, expenses: 27450, savings: 26050 },
];

export const mockCategoryBreakdown: CategorySpending[] = [
  { category: 'Bills', amount: 12799, percentage: 46.6, color: '#8B1E3F' }, // Maroon
  { category: 'Food', amount: 6580, percentage: 24.0, color: '#64152E' },
  { category: 'Shopping', amount: 3500, percentage: 12.7, color: '#C88719' }, // Amber
  { category: 'Transport', amount: 2250, percentage: 8.2, color: '#218739' }, // Green
  { category: 'Education', amount: 1450, percentage: 5.3, color: '#4A5568' },
  { category: 'Entertainment', amount: 871, percentage: 3.2, color: '#A0AEC0' },
];

export const mockDailySpending: DailySpend[] = [
  { date: 'Sep 05', day: 'Fri', amount: 420 },
  { date: 'Sep 06', day: 'Sat', amount: 1450 },
  { date: 'Sep 07', day: 'Sun', amount: 890 },
  { date: 'Sep 08', day: 'Mon', amount: 650 },
  { date: 'Sep 09', day: 'Tue', amount: 320 },
  { date: 'Sep 10', day: 'Wed', amount: 720 },
  { date: 'Sep 11', day: 'Thu', amount: 1410 },
  { date: 'Sep 12', day: 'Fri', amount: 530 },
  { date: 'Sep 13', day: 'Sat', amount: 1850 },
  { date: 'Sep 14', day: 'Sun', amount: 940 },
  { date: 'Sep 15', day: 'Mon', amount: 480 },
  { date: 'Sep 16', day: 'Tue', amount: 310 },
  { date: 'Sep 17', day: 'Wed', amount: 620 },
  { date: 'Sep 18', day: 'Thu', amount: 1100 },
];

export interface PaymentMethodShare {
  method: string;
  amount: number;
  percentage: number;
}

export const mockPaymentMethodBreakdown: PaymentMethodShare[] = [
  { method: 'UPI / QR', amount: 18666, percentage: 68 },
  { method: 'Debit Card', amount: 4941, percentage: 18 },
  { method: 'Credit Card', amount: 2745, percentage: 10 },
  { method: 'Cash', amount: 1098, percentage: 4 },
];

export interface FinancialInsightItem {
  id: string;
  type: 'positive' | 'warning' | 'neutral' | 'info';
  title: string;
  description: string;
  category: string;
}

export const mockFinancialInsights: FinancialInsightItem[] = [
  {
    id: 'ins_1',
    type: 'warning',
    title: 'Weekend Food Spikes',
    description: 'Food & dining accounts for 44% of total discretionary spend on Saturdays & Sundays.',
    category: 'Spending Velocity',
  },
  {
    id: 'ins_2',
    type: 'positive',
    title: 'Solid Savings Cushion',
    description: 'Your current 32% savings rate puts you ahead of the national peer benchmark (20%).',
    category: 'Savings Habit',
  },
  {
    id: 'ins_3',
    type: 'info',
    title: 'Upcoming Subscriptions',
    description: '2 recurring entertainment subscriptions (₹1,499) are due for auto-debit in the next 7 days.',
    category: 'Bills Alert',
  },
];
