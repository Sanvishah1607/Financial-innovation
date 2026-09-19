// FinShield Dynamic Financial Calculations & Analytics Engine
// Computes real-time metrics, cash flow, category breakdowns, financial health score,
// and adaptive recommendations purely from the logged-in user's actual data.

import { Transaction, Budget, SavingsGoal, UserProfile, CashFlowMonth, CategorySpending, DailySpend, EducationLesson } from '../types';

export interface FinancialHealthAnalysis {
  score: number; // 0 - 100
  tier: 'Excellent' | 'Good' | 'Moderate' | 'Needs Attention';
  color: string;
  summary: string;
  factors: {
    name: string;
    score: number;
    maxScore: number;
    status: 'good' | 'warning' | 'danger';
    detail: string;
  }[];
}

export interface PersonalizedRecommendation {
  id: string;
  type: 'action' | 'lesson' | 'warning' | 'success';
  title: string;
  description: string;
  actionText?: string;
  actionUrl?: string;
  category: string;
  iconType: 'budget' | 'savings' | 'debt' | 'shield' | 'general';
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#8B1E3F',          // Deep Crimson
  Transport: '#218739',     // Forest Green
  Shopping: '#C88719',      // Amber Gold
  Bills: '#64152E',         // Dark Burgundy
  Education: '#1D4ED8',     // Royal Blue
  Entertainment: '#7C3AED', // Violet
  Healthcare: '#BE185D',    // Rose
  Salary: '#059669',       // Emerald
  Freelance: '#0D9488',    // Teal
  Investment: '#D97706',   // Warm Ochre
  Other: '#4B5563',         // Slate Gray
};

/**
 * Calculate dynamic category breakdown from user's actual expense transactions
 */
export function calculateCategoryBreakdown(transactions: Transaction[]): CategorySpending[] {
  const expenses = transactions.filter((t) => t.type === 'expense');
  if (expenses.length === 0) return [];

  const totalsByCategory: Record<string, number> = {};
  let totalExpenseAmount = 0;

  for (const tx of expenses) {
    totalsByCategory[tx.category] = (totalsByCategory[tx.category] || 0) + tx.amount;
    totalExpenseAmount += tx.amount;
  }

  if (totalExpenseAmount === 0) return [];

  return Object.entries(totalsByCategory)
    .map(([cat, amount]) => {
      const percentage = Math.round((amount / totalExpenseAmount) * 1000) / 10;
      return {
        category: cat as any,
        amount,
        percentage,
        color: CATEGORY_COLORS[cat] || '#6B7280',
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Calculate dynamic monthly cash flow from user's actual transactions
 */
export function calculateCashFlow(transactions: Transaction[]): CashFlowMonth[] {
  if (transactions.length === 0) return [];

  // Group transactions by month key (e.g. "2026-09")
  const monthlyData: Record<string, { income: number; expenses: number; label: string }> = {};

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (const tx of transactions) {
    if (!tx.date) continue;
    const d = new Date(tx.date);
    if (isNaN(d.getTime())) continue;

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${monthNames[d.getMonth()]}`;

    if (!monthlyData[key]) {
      monthlyData[key] = { income: 0, expenses: 0, label };
    }

    if (tx.type === 'income') {
      monthlyData[key].income += tx.amount;
    } else {
      monthlyData[key].expenses += tx.amount;
    }
  }

  // Sort chronologically
  const sortedKeys = Object.keys(monthlyData).sort();

  return sortedKeys.map((key) => {
    const data = monthlyData[key];
    const savings = Math.max(0, data.income - data.expenses);
    return {
      month: data.label,
      income: data.income,
      expenses: data.expenses,
      savings,
    };
  });
}

/**
 * Calculate dynamic 14-day daily spending trend
 */
export function calculateDailySpending(transactions: Transaction[]): DailySpend[] {
  const expenses = transactions.filter((t) => t.type === 'expense');
  if (expenses.length === 0) return [];

  const dailyMap: Record<string, { day: string; amount: number; dateStr: string }> = {};
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Sort expenses by date
  for (const tx of expenses) {
    if (!tx.date) continue;
    const d = new Date(tx.date);
    if (isNaN(d.getTime())) continue;

    const dateKey = tx.date; // YYYY-MM-DD
    const displayDate = `${d.toLocaleDateString('en-US', { month: 'short' })} ${String(d.getDate()).padStart(2, '0')}`;
    const dayLabel = dayNames[d.getDay()];

    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = { day: dayLabel, amount: 0, dateStr: displayDate };
    }
    dailyMap[dateKey].amount += tx.amount;
  }

  const sortedKeys = Object.keys(dailyMap).sort().slice(-14);
  return sortedKeys.map((key) => ({
    date: dailyMap[key].dateStr,
    day: dailyMap[key].day,
    amount: dailyMap[key].amount,
  }));
}

/**
 * Calculate dynamic payment method share
 */
export function calculatePaymentMethodBreakdown(transactions: Transaction[]): { method: string; amount: number; percentage: number }[] {
  const expenses = transactions.filter((t) => t.type === 'expense');
  if (expenses.length === 0) return [];

  const map: Record<string, number> = {};
  let total = 0;

  for (const tx of expenses) {
    map[tx.paymentMethod] = (map[tx.paymentMethod] || 0) + tx.amount;
    total += tx.amount;
  }

  if (total === 0) return [];

  return Object.entries(map).map(([method, amount]) => ({
    method,
    amount,
    percentage: Math.round((amount / total) * 100),
  })).sort((a, b) => b.amount - a.amount);
}

/**
 * Calculate current month's spending from user's expense transactions
 */
export function calculateCurrentMonthSpending(transactions: Transaction[]): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  return transactions
    .filter((t) => {
      if (t.type !== 'expense') return false;
      const d = new Date(t.date);
      if (isNaN(d.getTime())) return true;
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate overall budget utilization percentage
 */
export function calculateBudgetUtilization(budgets: Budget[], transactions: Transaction[]): {
  totalAllocated: number;
  totalSpent: number;
  utilizationPercentage: number;
  remainingCushion: number;
} {
  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocatedAmount, 0);

  // Derive total spent from actual transactions by category
  const expenseMap: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
    });

  const totalSpent = budgets.reduce((sum, b) => {
    return sum + (expenseMap[b.category] || b.spentAmount || 0);
  }, 0);

  const utilizationPercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;
  const remainingCushion = Math.max(0, totalAllocated - totalSpent);

  return {
    totalAllocated,
    totalSpent,
    utilizationPercentage,
    remainingCushion,
  };
}

/**
 * Calculate overall savings progress percentage
 */
export function calculateSavingsProgress(savingsGoals: SavingsGoal[]): {
  totalSaved: number;
  totalTarget: number;
  progressPercentage: number;
  activeGoalsCount: number;
} {
  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const progressPercentage = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  return {
    totalSaved,
    totalTarget,
    progressPercentage,
    activeGoalsCount: savingsGoals.length,
  };
}

/**
 * Calculate dynamic Financial Health Score (0 - 100) based on actual user financial performance
 */
export function calculateFinancialHealthScore(
  user: UserProfile,
  transactions: Transaction[],
  budgets: Budget[],
  savingsGoals: SavingsGoal[]
): FinancialHealthAnalysis {
  let score = 0;
  const factors: FinancialHealthAnalysis['factors'] = [];

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) || user.monthlyIncome || 35000;

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // 1. Savings Rate Factor (Max 30 pts)
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
  let savingsPts = 10;
  let savingsStatus: 'good' | 'warning' | 'danger' = 'warning';
  let savingsDetail = `Savings rate is ${savingsRate}%.`;

  if (savingsRate >= 25) {
    savingsPts = 30;
    savingsStatus = 'good';
    savingsDetail = `Superb savings rate (${savingsRate}%) well above 20% benchmark.`;
  } else if (savingsRate >= 15) {
    savingsPts = 22;
    savingsStatus = 'good';
    savingsDetail = `Healthy savings rate (${savingsRate}%). Target reaching 20%+.`;
  } else if (savingsRate > 0) {
    savingsPts = 14;
    savingsStatus = 'warning';
    savingsDetail = `Modest savings rate (${savingsRate}%). Room to cut discretionary spend.`;
  } else {
    savingsPts = 5;
    savingsStatus = 'danger';
    savingsDetail = `Outflow exceeds or equals income. Immediate budget discipline needed.`;
  }
  score += savingsPts;
  factors.push({
    name: 'Savings Discipline',
    score: savingsPts,
    maxScore: 30,
    status: savingsStatus,
    detail: savingsDetail,
  });

  // 2. Budget Adherence (Max 30 pts)
  const { totalAllocated, utilizationPercentage } = calculateBudgetUtilization(budgets, transactions);
  let budgetPts = 20;
  let budgetStatus: 'good' | 'warning' | 'danger' = 'good';
  let budgetDetail = 'No active budget limits exceeded.';

  if (totalAllocated > 0) {
    if (utilizationPercentage <= 75) {
      budgetPts = 30;
      budgetStatus = 'good';
      budgetDetail = `Optimal consumption (${utilizationPercentage}% of budget allocated).`;
    } else if (utilizationPercentage <= 90) {
      budgetPts = 22;
      budgetStatus = 'warning';
      budgetDetail = `Approaching budget ceilings (${utilizationPercentage}% utilized).`;
    } else if (utilizationPercentage <= 100) {
      budgetPts = 15;
      budgetStatus = 'warning';
      budgetDetail = `Near exhaustion of monthly budget (${utilizationPercentage}% utilized).`;
    } else {
      budgetPts = 6;
      budgetStatus = 'danger';
      budgetDetail = `Budget exceeded (${utilizationPercentage}%). High risk of debt.`;
    }
  }
  score += budgetPts;
  factors.push({
    name: 'Budget Utilization',
    score: budgetPts,
    maxScore: 30,
    status: budgetStatus,
    detail: budgetDetail,
  });

  // 3. Cash Flow Runway / Expense Ratio (Max 25 pts)
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 50;
  let flowPts = 15;
  let flowStatus: 'good' | 'warning' | 'danger' = 'good';
  let flowDetail = 'Balanced cash flow.';

  if (expenseRatio <= 50) {
    flowPts = 25;
    flowStatus = 'good';
    flowDetail = `Extremely strong cash retention (expenses are ${Math.round(expenseRatio)}% of income).`;
  } else if (expenseRatio <= 70) {
    flowPts = 20;
    flowStatus = 'good';
    flowDetail = `Healthy cash cushion (expenses are ${Math.round(expenseRatio)}% of income).`;
  } else if (expenseRatio <= 85) {
    flowPts = 12;
    flowStatus = 'warning';
    flowDetail = `High burn rate (${Math.round(expenseRatio)}% of income).`;
  } else {
    flowPts = 5;
    flowStatus = 'danger';
    flowDetail = `Critical burn rate (${Math.round(expenseRatio)}% of income).`;
  }
  score += flowPts;
  factors.push({
    name: 'Cash Flow Buffer',
    score: flowPts,
    maxScore: 25,
    status: flowStatus,
    detail: flowDetail,
  });

  // 4. Savings Goals & Purpose (Max 15 pts)
  const { progressPercentage, activeGoalsCount } = calculateSavingsProgress(savingsGoals);
  let goalPts = 5;
  let goalStatus: 'good' | 'warning' | 'danger' = 'warning';
  let goalDetail = 'Set your first goal to unlock full score.';

  if (activeGoalsCount > 0) {
    if (progressPercentage >= 50) {
      goalPts = 15;
      goalStatus = 'good';
      goalDetail = `${activeGoalsCount} goals active, ${progressPercentage}% average milestone achieved.`;
    } else {
      goalPts = 10;
      goalStatus = 'good';
      goalDetail = `${activeGoalsCount} goals in progress (${progressPercentage}% saved).`;
    }
  }
  score += goalPts;
  factors.push({
    name: 'Goal Milestones',
    score: goalPts,
    maxScore: 15,
    status: goalStatus,
    detail: goalDetail,
  });

  // Cap between 0 and 100
  const finalScore = Math.min(100, Math.max(0, score));

  let tier: FinancialHealthAnalysis['tier'] = 'Good';
  let color = '#218739';
  let summary = 'Your financial health is stable with healthy baseline discipline.';

  if (finalScore >= 80) {
    tier = 'Excellent';
    color = '#218739';
    summary = 'Outstanding financial discipline! You maintain strong cash cushions and steady savings.';
  } else if (finalScore >= 65) {
    tier = 'Good';
    color = '#218739';
    summary = 'Solid foundation. Keep automating savings to elevate your score to Excellent.';
  } else if (finalScore >= 50) {
    tier = 'Moderate';
    color = '#C88719';
    summary = 'Average performance. Moderate discretionary spending and establish a structured emergency buffer.';
  } else {
    tier = 'Needs Attention';
    color = '#C62828';
    summary = 'Urgent attention required. High outflow ratio detected; implement 50/30/20 budgeting.';
  }

  return {
    score: finalScore,
    tier,
    color,
    summary,
    factors,
  };
}

/**
 * Generate dynamic personalized recommendations based on actual user data
 */
export function generatePersonalizedRecommendations(
  user: UserProfile,
  transactions: Transaction[],
  budgets: Budget[],
  savingsGoals: SavingsGoal[]
): PersonalizedRecommendation[] {
  const recommendations: PersonalizedRecommendation[] = [];

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) || user.monthlyIncome || 35000;

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
  const { utilizationPercentage } = calculateBudgetUtilization(budgets, transactions);
  const categories = calculateCategoryBreakdown(transactions);
  const topCategory = categories[0];

  // 1. High Spending / Budget Rule
  if (utilizationPercentage >= 80 || (totalIncome > 0 && totalExpenses / totalIncome > 0.75)) {
    recommendations.push({
      id: 'rec_budget',
      type: 'warning',
      title: 'High Spending Velocity Detected',
      description: `You have consumed ${utilizationPercentage || Math.round((totalExpenses / totalIncome) * 100)}% of your monthly funds. Explore the 50/30/20 rule to trim discretionary leaks.`,
      actionText: 'Study 50/30/20 Lesson',
      actionUrl: '/learn',
      category: 'Budget Optimization',
      iconType: 'budget',
    });
  }

  // 2. Low Savings Rate
  if (savingsRate < 20) {
    recommendations.push({
      id: 'rec_savings',
      type: 'action',
      title: 'Boost Your Monthly Savings Rate',
      description: `Your current savings rate is ${Math.max(0, savingsRate)}% (target: 20%). Automate a recurring transfer on pay day to build a safety buffer.`,
      actionText: 'Open Savings Vault',
      actionUrl: '/savings',
      category: 'Savings Habit',
      iconType: 'savings',
    });
  }

  // 3. Concentration in single category
  if (topCategory && topCategory.percentage >= 35) {
    recommendations.push({
      id: 'rec_concentration',
      type: 'warning',
      title: `High Outflow in ${topCategory.category}`,
      description: `${topCategory.category} accounts for ${topCategory.percentage}% of all your recorded expenses. Review recent transactions for recurring subscriptions or dining spikes.`,
      actionText: 'Review Category Transactions',
      actionUrl: '/transactions',
      category: 'Expense Audit',
      iconType: 'debt',
    });
  }

  // 4. Missing Savings Goals
  if (savingsGoals.length === 0) {
    recommendations.push({
      id: 'rec_goal',
      type: 'action',
      title: 'Build Your Emergency Fund Milestone',
      description: 'You do not have an active savings target. Setting a 3-month emergency reserve protects against unforeseen financial shocks.',
      actionText: 'Create Emergency Goal',
      actionUrl: '/savings',
      category: 'Safety Net',
      iconType: 'shield',
    });
  }

  // 5. Always include Scam / Safety hygiene
  recommendations.push({
    id: 'rec_safety',
    type: 'success',
    title: 'Digital Banking Shield Active',
    description: 'Always remember: Entering your UPI PIN deducts money from your account. Never enter a PIN or scan a QR code to receive refunds.',
    actionText: 'Run Scam Check',
    actionUrl: '/scam-checker',
    category: 'Cyber Safety',
    iconType: 'shield',
  });

  return recommendations;
}

/**
 * Adaptive Lesson Matching for Financial Learning Section (Requirement 5)
 */
export function getRecommendedLessons(
  lessons: EducationLesson[],
  user: UserProfile,
  transactions: Transaction[],
  budgets: Budget[],
  savingsGoals: SavingsGoal[]
): { lesson: EducationLesson; reason: string; trigger: string }[] {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) || user.monthlyIncome || 35000;

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
  const { utilizationPercentage } = calculateBudgetUtilization(budgets, transactions);

  const results: { lesson: EducationLesson; reason: string; trigger: string }[] = [];

  // Excessive spending trigger -> Budgeting lessons
  if (utilizationPercentage >= 80 || (totalIncome > 0 && totalExpenses / totalIncome >= 0.7)) {
    const budgetLesson = lessons.find((l) => l.category === 'Budgeting') || lessons[0];
    if (budgetLesson) {
      results.push({
        lesson: budgetLesson,
        reason: `Excessive spending detected (${utilizationPercentage || Math.round((totalExpenses / totalIncome) * 100)}% of budget utilized). Mastering the 50/30/20 framework will help curb non-essential leakage.`,
        trigger: 'Excessive Spending Detected',
      });
    }
  }

  // Low savings rate trigger -> Savings strategy lessons
  if (savingsRate < 20 || savingsGoals.length === 0) {
    const savingsLesson = lessons.find((l) => l.category === 'Savings') || lessons[1];
    if (savingsLesson && !results.some((r) => r.lesson.id === savingsLesson.id)) {
      results.push({
        lesson: savingsLesson,
        reason: `Your current savings rate is ${Math.max(0, savingsRate)}% (recommended minimum is 20%). Establishing a 3 to 6-month emergency cushion is vital.`,
        trigger: 'Low Savings Rate Detected',
      });
    }
  }

  // Debt management trigger -> Debt lessons
  const debtLesson = lessons.find((l) => l.title.toLowerCase().includes('debt') || l.category === 'Credit & Debt');
  if (debtLesson && !results.some((r) => r.lesson.id === debtLesson.id)) {
    results.push({
      lesson: debtLesson,
      reason: 'Learn the difference between the Debt Avalanche and Snowball methods to eliminate high-interest liabilities efficiently.',
      trigger: 'Debt & Interest Optimization',
    });
  }

  // Digital Fraud & UPI Safety
  const fraudLesson = lessons.find((l) => l.category === 'Digital Safety');
  if (fraudLesson && !results.some((r) => r.lesson.id === fraudLesson.id)) {
    results.push({
      lesson: fraudLesson,
      reason: 'Critical safety hygiene: Learn how to identify reverse QR traps and fake utility SMS before money leaves your account.',
      trigger: 'Digital Safety Defense',
    });
  }

  return results;
}
