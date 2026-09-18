import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Transaction, Budget, SavingsGoal, UserProfile } from '../types';
import { initialMockTransactions } from '../data/mockTransactions';
import { initialMockBudgets } from '../data/mockBudget';
import { initialMockSavings } from '../data/mockSavings';
import { initialMockUser } from '../data/mockUser';
import { useToast } from './ToastContext';

interface FinancialContextType {
  user: UserProfile;
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  savingsRate: number;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (bgt: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, allocatedAmount: number) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, amountToAdd: number) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(initialMockUser);
  const [transactions, setTransactions] = useState<Transaction[]>(initialMockTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialMockBudgets);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(initialMockSavings);
  const { showToast } = useToast();

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

  // Actions
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // If it's an expense, update budget spentAmount
    if (tx.type === 'expense') {
      setBudgets((prev) =>
        prev.map((b) =>
          b.category === tx.category
            ? { ...b, spentAmount: b.spentAmount + tx.amount }
            : b
        )
      );
    }

    showToast(
      `${tx.type === 'expense' ? 'Expense' : 'Income'} of ₹${tx.amount.toLocaleString('en-IN')} added successfully.`,
      'success'
    );
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    setTransactions((prev) => prev.filter((t) => t.id !== id));

    if (tx.type === 'expense') {
      setBudgets((prev) =>
        prev.map((b) =>
          b.category === tx.category
            ? { ...b, spentAmount: Math.max(0, b.spentAmount - tx.amount) }
            : b
        )
      );
    }

    showToast('Transaction removed from ledger.', 'info');
  };

  const addBudget = (bgt: Omit<Budget, 'id'>) => {
    const newBgt: Budget = {
      ...bgt,
      id: `bgt_${Date.now()}`,
    };
    setBudgets((prev) => [...prev, newBgt]);
    showToast(`Budget for ${bgt.category} set to ₹${bgt.allocatedAmount.toLocaleString('en-IN')}`, 'success');
  };

  const updateBudget = (id: string, allocatedAmount: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, allocatedAmount } : b))
    );
    showToast('Budget allocation updated successfully.', 'success');
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `svg_${Date.now()}`,
      color: goal.color || '#8B1E3F',
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
    showToast(`Savings target "${goal.name}" created!`, 'success');
  };

  const updateSavingsGoal = (id: string, amountToAdd: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, currentAmount: g.currentAmount + amountToAdd } : g
      )
    );
    showToast(`Added ₹${amountToAdd.toLocaleString('en-IN')} to your savings goal!`, 'success');
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
    showToast('Profile details updated successfully.', 'success');
  };

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
        addTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        addSavingsGoal,
        updateSavingsGoal,
        updateProfile,
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
