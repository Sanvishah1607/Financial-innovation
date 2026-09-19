import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode, useCallback } from 'react';
import { Transaction, Budget, SavingsGoal, UserProfile } from '../types';
import { useToast } from './ToastContext';
import {
  getActiveUser,
  getUserData,
  saveUserData,
  updateUserProfile as persistUserProfile,
  ensureInitialAccount,
  logoutUser,
  setActiveUserId,
} from '../services/storage';
import {
  calculateCurrentMonthSpending,
  calculateBudgetUtilization,
  calculateSavingsProgress,
  calculateFinancialHealthScore,
  generatePersonalizedRecommendations,
  FinancialHealthAnalysis,
  PersonalizedRecommendation,
} from '../utils/calculations';

interface FinancialContextType {
  user: UserProfile;
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  savingsRate: number;
  currentMonthSpending: number;
  budgetUtilizationPercentage: number;
  savingsProgressPercentage: number;
  healthAnalysis: FinancialHealthAnalysis;
  personalizedRecommendations: PersonalizedRecommendation[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (bgt: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, allocatedAmount: number) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, amountToAdd: number) => void;
  depositToSavingsGoal: (id: string, amountToAdd: number) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  updateUser: (updated: Partial<UserProfile>) => void;
  reloadUserData: () => void;
  logout: () => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();

  // Load initial active user from isolated storage
  const [user, setUser] = useState<UserProfile>(() => {
    return ensureInitialAccount();
  });

  // Load isolated data for active user
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return getUserData(user.id).transactions;
  });

  const [rawBudgets, setRawBudgets] = useState<Budget[]>(() => {
    return getUserData(user.id).budgets;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    return getUserData(user.id).savingsGoals;
  });

  // Re-read storage when user switches accounts
  const reloadUserData = useCallback(() => {
    const currentActive = getActiveUser() || ensureInitialAccount();
    setUser(currentActive);
    const data = getUserData(currentActive.id);
    setTransactions(data.transactions);
    setRawBudgets(data.budgets);
    setSavingsGoals(data.savingsGoals);
  }, []);

  // Compute spent amount per budget category dynamically from actual expense transactions
  const budgets = useMemo(() => {
    const expenseByCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      });

    return rawBudgets.map((b) => ({
      ...b,
      spentAmount: expenseByCategory[b.category] || 0,
    }));
  }, [rawBudgets, transactions]);

  // Persist financial data whenever transactions, rawBudgets, or savingsGoals change
  useEffect(() => {
    if (user?.id) {
      saveUserData(user.id, {
        transactions,
        budgets: rawBudgets,
        savingsGoals,
      });
    }
  }, [transactions, rawBudgets, savingsGoals, user?.id]);

  // Dynamic Financial Calculations
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const currentBalance = useMemo(() => {
    return Math.max(0, totalIncome - totalExpenses);
  }, [totalIncome, totalExpenses]);

  const savingsRate = useMemo(() => {
    if (totalIncome === 0) return 0;
    const rate = Math.round(((totalIncome - totalExpenses) / totalIncome) * 100);
    return Math.max(0, rate);
  }, [totalIncome, totalExpenses]);

  const currentMonthSpending = useMemo(() => {
    return calculateCurrentMonthSpending(transactions);
  }, [transactions]);

  const { utilizationPercentage: budgetUtilizationPercentage } = useMemo(() => {
    return calculateBudgetUtilization(budgets, transactions);
  }, [budgets, transactions]);

  const { progressPercentage: savingsProgressPercentage } = useMemo(() => {
    return calculateSavingsProgress(savingsGoals);
  }, [savingsGoals]);

  const healthAnalysis = useMemo(() => {
    return calculateFinancialHealthScore(user, transactions, budgets, savingsGoals);
  }, [user, transactions, budgets, savingsGoals]);

  const personalizedRecommendations = useMemo(() => {
    return generatePersonalizedRecommendations(user, transactions, budgets, savingsGoals);
  }, [user, transactions, budgets, savingsGoals]);

  // Actions
  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id'>) => {
      const newTx: Transaction = {
        ...tx,
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      };
      setTransactions((prev) => [newTx, ...prev]);

      showToast(
        `${tx.type === 'expense' ? 'Expense' : 'Income'} of ₹${tx.amount.toLocaleString('en-IN')} added successfully.`,
        'success'
      );
    },
    [showToast]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showToast('Transaction removed from ledger.', 'info');
    },
    [showToast]
  );

  const addBudget = useCallback(
    (bgt: Omit<Budget, 'id'>) => {
      const newBgt: Budget = {
        ...bgt,
        id: `bgt_${Date.now()}`,
      };
      setRawBudgets((prev) => [...prev, newBgt]);
      showToast(`Budget for ${bgt.category} set to ₹${bgt.allocatedAmount.toLocaleString('en-IN')}`, 'success');
    },
    [showToast]
  );

  const updateBudget = useCallback(
    (id: string, allocatedAmount: number) => {
      setRawBudgets((prev) =>
        prev.map((b) => (b.id === id ? { ...b, allocatedAmount } : b))
      );
      showToast('Budget allocation updated successfully.', 'success');
    },
    [showToast]
  );

  const addSavingsGoal = useCallback(
    (goal: Omit<SavingsGoal, 'id'>) => {
      const newGoal: SavingsGoal = {
        ...goal,
        id: `svg_${Date.now()}`,
        color: goal.color || '#8B1E3F',
      };
      setSavingsGoals((prev) => [...prev, newGoal]);
      showToast(`Savings target "${goal.name}" created!`, 'success');
    },
    [showToast]
  );

  const updateSavingsGoal = useCallback(
    (id: string, amountToAdd: number) => {
      setSavingsGoals((prev) =>
        prev.map((g) =>
          g.id === id ? { ...g, currentAmount: g.currentAmount + amountToAdd } : g
        )
      );
      showToast(`Added ₹${amountToAdd.toLocaleString('en-IN')} to your savings goal!`, 'success');
    },
    [showToast]
  );

  // Alias for updateSavingsGoal
  const depositToSavingsGoal = updateSavingsGoal;

  const updateProfile = useCallback(
    (updated: Partial<UserProfile>) => {
      try {
        const persisted = persistUserProfile(user.id, updated);
        setUser(persisted);
        showToast('Profile details updated successfully.', 'success');
      } catch (err) {
        setUser((prev) => ({ ...prev, ...updated }));
        showToast('Profile details updated.', 'success');
      }
    },
    [user.id, showToast]
  );

  const updateUser = useCallback(
    (updated: Partial<UserProfile>) => {
      try {
        const persisted = persistUserProfile(user.id, updated);
        setUser(persisted);
      } catch {
        setUser((prev) => ({ ...prev, ...updated }));
      }
    },
    [user.id]
  );

  const logout = useCallback(() => {
    logoutUser();
    showToast('Logged out of FinShield.', 'info');
  }, [showToast]);

  return (
    <FinancialContext.Provider
      value={{
        user,
        transactions,
        budgets,
        savingsGoals,
        totalIncome,
        totalExpenses,
        currentBalance,
        savingsRate,
        currentMonthSpending,
        budgetUtilizationPercentage,
        savingsProgressPercentage,
        healthAnalysis,
        personalizedRecommendations,
        addTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        addSavingsGoal,
        updateSavingsGoal,
        depositToSavingsGoal,
        updateProfile,
        updateUser,
        reloadUserData,
        logout,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
}
