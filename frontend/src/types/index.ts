// FinShield TypeScript Domain Definitions

export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Education'
  | 'Entertainment'
  | 'Healthcare'
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Other';

export type PaymentMethod =
  | 'UPI'
  | 'Debit Card'
  | 'Credit Card'
  | 'Bank Transfer'
  | 'Cash';

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  paymentMethod: PaymentMethod;
  notes?: string;
  isRecurring?: boolean;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  allocatedAmount: number;
  spentAmount: number;
  month: string; // YYYY-MM
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  category?: string;
  color?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  firstName?: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  authProvider?: 'email' | 'google';
  monthlyIncome: number;
  currency: string;
  accountNumberMasked: string;
  ifscCode: string;
  twoFactorEnabled: boolean;
  financialGoals: string[];
  createdAt: string;
}

export interface CashFlowMonth {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface CategorySpending {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  color: string;
}

export interface DailySpend {
  date: string;
  day: string;
  amount: number;
}

export interface ScamCheckResult {
  riskLevel: 'SAFE' | 'SUSPICIOUS' | 'HIGH RISK';
  riskScore: number; // 0-100
  verdict: string;
  warningSigns: string[];
  recommendedAction: string;
  scannedText: string;
  timestamp: string;
}

export interface EducationLesson {
  id: string;
  title: string;
  category: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Essential';
  summary: string;
  objectives: string[];
  videoUrl: string;
  videoEmbedUrl: string;
  videoTitle?: string;
  videoSource?: string;
  articleUrl?: string;
  articleSource?: string;
  fullContent: string[];
  keyTakeaway: string;
  recommendedTrigger?: 'high_spending' | 'low_savings' | 'high_debt' | 'general';
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ScannedReceiptItem {
  name: string;
  quantity?: number;
  price?: number;
}

export interface ScannedReceipt {
  merchantName?: string | null;
  transactionDate?: string | null; // YYYY-MM-DD
  totalAmount?: number | null;
  currency?: string | null;
  category?: TransactionCategory | null;
  paymentMethod?: PaymentMethod | null;
  items: ScannedReceiptItem[];
  confidenceScore: number;
  rawText?: string | null;
  warnings: string[];
}
