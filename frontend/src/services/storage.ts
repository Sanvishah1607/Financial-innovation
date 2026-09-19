// FinShield Multi-User Dynamic Local Storage Service
// Handles user account creation, credentials, user session state, and per-user isolated data.

import { UserProfile, Transaction, Budget, SavingsGoal } from '../types';

export interface UserAccount extends UserProfile {
  passwordHash?: string;
}

export interface UserFinancialData {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
}

const STORAGE_KEYS = {
  ACCOUNTS: 'finshield_user_accounts',
  ACTIVE_USER_ID: 'finshield_active_user_id',
  USER_DATA_PREFIX: 'finshield_user_data_',
};

// Default budget category template for new user profiles
export const DEFAULT_BUDGET_TEMPLATES: Omit<Budget, 'id'>[] = [
  { category: 'Food', allocatedAmount: 8000, spentAmount: 0, month: new Date().toISOString().slice(0, 7) },
  { category: 'Transport', allocatedAmount: 3000, spentAmount: 0, month: new Date().toISOString().slice(0, 7) },
  { category: 'Shopping', allocatedAmount: 4000, spentAmount: 0, month: new Date().toISOString().slice(0, 7) },
  { category: 'Bills', allocatedAmount: 5000, spentAmount: 0, month: new Date().toISOString().slice(0, 7) },
  { category: 'Education', allocatedAmount: 2500, spentAmount: 0, month: new Date().toISOString().slice(0, 7) },
  { category: 'Entertainment', allocatedAmount: 2000, spentAmount: 0, month: new Date().toISOString().slice(0, 7) },
  { category: 'Healthcare', allocatedAmount: 2000, spentAmount: 0, month: new Date().toISOString().slice(0, 7) },
  { category: 'Other', allocatedAmount: 2000, spentAmount: 0, month: new Date().toISOString().slice(0, 7) },
];

export const DEFAULT_SEED_TRANSACTIONS = (userId: string): Transaction[] => {
  const today = new Date().toISOString().slice(0, 10);
  return [
    {
      id: `tx_${userId}_1`,
      name: 'Software Dev Stipend',
      amount: 45000,
      type: 'income',
      category: 'Salary',
      date: today,
      time: '09:30',
      paymentMethod: 'Bank Transfer',
      notes: 'Monthly corporate stipend',
    },
    {
      id: `tx_${userId}_2`,
      name: 'Swiggy Gourmet Dinner',
      amount: 480,
      type: 'expense',
      category: 'Food',
      date: today,
      time: '19:45',
      paymentMethod: 'UPI',
      notes: 'Dinner with campus team',
    },
    {
      id: `tx_${userId}_3`,
      name: 'Metro Transit Recharge',
      amount: 500,
      type: 'expense',
      category: 'Transport',
      date: today,
      time: '08:15',
      paymentMethod: 'UPI',
      notes: 'Monthly transit commute',
    },
    {
      id: `tx_${userId}_4`,
      name: 'Amazon Prime & Textbooks',
      amount: 1450,
      type: 'expense',
      category: 'Shopping',
      date: today,
      time: '14:20',
      paymentMethod: 'Debit Card',
      notes: 'Finance and coding textbooks',
    },
    {
      id: `tx_${userId}_5`,
      name: 'High-Speed Fiber Wi-Fi',
      amount: 899,
      type: 'expense',
      category: 'Bills',
      date: today,
      time: '11:00',
      paymentMethod: 'UPI',
      notes: 'Broadband internet subscription',
    },
  ];
};

export const DEFAULT_SEED_GOALS = (userId: string): SavingsGoal[] => [
  {
    id: `goal_${userId}_1`,
    name: 'Emergency Shield Fund',
    targetAmount: 50000,
    currentAmount: 25000,
    targetDate: '2026-12-31',
    category: 'Safety',
    color: '#8B1E3F',
  },
  {
    id: `goal_${userId}_2`,
    name: 'M3 MacBook Pro Fund',
    targetAmount: 120000,
    currentAmount: 48000,
    targetDate: '2027-03-31',
    category: 'Hardware',
    color: '#1E88E5',
  },
];

/**
 * Retrieve all registered accounts
 */
export function getRegisteredAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading accounts from localStorage:', err);
    return [];
  }
}

/**
 * Save accounts array to storage
 */
export function saveRegisteredAccounts(accounts: UserAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  } catch (err) {
    console.error('Error saving accounts to localStorage:', err);
  }
}

/**
 * Get the currently active user ID
 */
export function getActiveUserId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
  } catch {
    return null;
  }
}

/**
 * Set the currently active user ID
 */
export function setActiveUserId(userId: string | null): void {
  try {
    if (userId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
    }
  } catch (err) {
    console.error('Error updating active user ID in localStorage:', err);
  }
}

/**
 * Get active user profile
 */
export function getActiveUser(): UserProfile | null {
  const activeId = getActiveUserId();
  const accounts = getRegisteredAccounts();
  if (activeId) {
    const found = accounts.find((a) => a.id === activeId);
    if (found) return found;
  }
  // If accounts exist but no active ID set, pick the first one
  if (accounts.length > 0) {
    setActiveUserId(accounts[0].id);
    return accounts[0];
  }
  return null;
}

/**
 * Register a new user account dynamically
 */
export function registerUser(params: {
  fullName: string;
  email: string;
  password: string;
  monthlyIncome?: number;
  currency?: string;
  phone?: string;
}): { success: boolean; user?: UserProfile; error?: string } {
  const normalizedEmail = params.email.trim().toLowerCase();
  const accounts = getRegisteredAccounts();

  if (accounts.some((a) => a.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email address already exists. Please sign in instead.' };
  }

  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const trimmedName = params.fullName.trim();
  const firstName = trimmedName.split(' ')[0] || 'User';
  const createdAt = new Date().toISOString();

  const newAccount: UserAccount = {
    id: userId,
    fullName: trimmedName,
    firstName,
    email: normalizedEmail,
    passwordHash: params.password, // Plain string stored in user's browser localStorage
    phone: params.phone || '+91 98765 00000',
    monthlyIncome: params.monthlyIncome || 35000,
    currency: params.currency || 'INR (₹)',
    accountNumberMasked: `•••• •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
    ifscCode: `FSHD000${Math.floor(1000 + Math.random() * 9000)}`,
    twoFactorEnabled: true,
    financialGoals: [],
    createdAt,
    authProvider: 'email',
  };

  accounts.push(newAccount);
  saveRegisteredAccounts(accounts);
  setActiveUserId(userId);

  // Initialize fresh, isolated financial data for this user
  const initialData: UserFinancialData = {
    transactions: [],
    budgets: DEFAULT_BUDGET_TEMPLATES.map((b, idx) => ({
      ...b,
      id: `bgt_${userId}_${idx}`,
    })),
    savingsGoals: [],
  };
  saveUserData(userId, initialData);

  return { success: true, user: newAccount };
}

/**
 * Authenticate existing user by email & password
 */
export function loginUser(
  email: string,
  password: string
): { success: boolean; user?: UserProfile; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = getRegisteredAccounts();

  const account = accounts.find((a) => a.email.toLowerCase() === normalizedEmail);
  if (!account) {
    return {
      success: false,
      error: 'Account not found. Please verify your email or click "Create an account" to register.',
    };
  }

  if (account.passwordHash && account.passwordHash !== password) {
    return { success: false, error: 'Incorrect password. Please verify your credentials.' };
  }

  setActiveUserId(account.id);
  return { success: true, user: account };
}

/**
 * Google Sign In / Authorization
 */
export function googleSignIn(googleData?: {
  name?: string;
  email?: string;
  picture?: string;
}): { success: boolean; user: UserProfile } {
  const fullName = googleData?.name?.trim() || 'Google User';
  const email = googleData?.email?.trim().toLowerCase() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
  const accounts = getRegisteredAccounts();

  let account = accounts.find((a) => a.email.toLowerCase() === email);

  if (!account) {
    const userId = `usr_g_${Date.now()}`;
    const firstName = fullName.split(' ')[0] || 'User';
    account = {
      id: userId,
      fullName,
      firstName,
      email,
      avatarUrl: googleData?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=8B1E3F&color=fff`,
      phone: '+91 98000 00000',
      monthlyIncome: 45000,
      currency: 'INR (₹)',
      accountNumberMasked: `•••• •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      ifscCode: `FSHD000${Math.floor(1000 + Math.random() * 9000)}`,
      twoFactorEnabled: true,
      financialGoals: [],
      createdAt: new Date().toISOString(),
      authProvider: 'google',
    };
    accounts.push(account);
    saveRegisteredAccounts(accounts);

    // Initial isolated data
    saveUserData(userId, {
      transactions: [],
      budgets: DEFAULT_BUDGET_TEMPLATES.map((b, idx) => ({
        ...b,
        id: `bgt_${userId}_${idx}`,
      })),
      savingsGoals: [],
    });
  }

  setActiveUserId(account.id);
  return { success: true, user: account };
}

/**
 * Update active user profile
 */
export function updateUserProfile(userId: string, updates: Partial<UserProfile>): UserProfile {
  const accounts = getRegisteredAccounts();
  const index = accounts.findIndex((a) => a.id === userId);
  if (index === -1) {
    throw new Error('User not found');
  }

  const updated: UserAccount = {
    ...accounts[index],
    ...updates,
  };
  if (updates.fullName) {
    updated.firstName = updates.fullName.trim().split(' ')[0];
  }

  accounts[index] = updated;
  saveRegisteredAccounts(accounts);
  return updated;
}

/**
 * Get isolated data for a specific user
 */
export function getUserData(userId: string): UserFinancialData {
  try {
    const key = `${STORAGE_KEYS.USER_DATA_PREFIX}${userId}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial: UserFinancialData = {
        transactions: DEFAULT_SEED_TRANSACTIONS(userId),
        budgets: DEFAULT_BUDGET_TEMPLATES.map((b, idx) => ({
          ...b,
          id: `bgt_${userId}_${idx}`,
        })),
        savingsGoals: DEFAULT_SEED_GOALS(userId),
      };
      saveUserData(userId, initial);
      return initial;
    }
    const parsed: UserFinancialData = JSON.parse(raw);
    if (!parsed.transactions || parsed.transactions.length === 0) {
      parsed.transactions = DEFAULT_SEED_TRANSACTIONS(userId);
      parsed.savingsGoals = parsed.savingsGoals && parsed.savingsGoals.length > 0 ? parsed.savingsGoals : DEFAULT_SEED_GOALS(userId);
      saveUserData(userId, parsed);
    }
    return parsed;
  } catch (err) {
    console.error(`Error loading data for user ${userId}:`, err);
    return {
      transactions: DEFAULT_SEED_TRANSACTIONS(userId),
      budgets: DEFAULT_BUDGET_TEMPLATES.map((b, idx) => ({
        ...b,
        id: `bgt_${userId}_${idx}`,
      })),
      savingsGoals: DEFAULT_SEED_GOALS(userId),
    };
  }
}

/**
 * Save isolated data for a specific user
 */
export function saveUserData(userId: string, data: UserFinancialData): void {
  try {
    const key = `${STORAGE_KEYS.USER_DATA_PREFIX}${userId}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving data for user ${userId}:`, err);
  }
}

/**
 * Clear active session on logout
 */
export function logoutUser(): void {
  setActiveUserId(null);
}

/**
 * Ensures at least one clean user exists if someone navigates directly
 */
export function ensureInitialAccount(): UserProfile {
  const existing = getActiveUser();
  if (existing) return existing;

  // If no accounts exist in browser, create an initial user
  const result = registerUser({
    fullName: 'FinShield User',
    email: 'user@finshield.in',
    password: 'password123',
    monthlyIncome: 35000,
    currency: 'INR (₹)',
  });
  return result.user!;
}
