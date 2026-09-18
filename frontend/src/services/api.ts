// FinShield API Service Client
// Configured to return rich mock data for frontend development,
// and structured for clean drop-in integration with FastAPI & PostgreSQL.

import { 
  Transaction, 
  Budget, 
  SavingsGoal, 
  UserProfile, 
  ScamCheckResult,
  CashFlowMonth,
  CategorySpending
} from '../types';

import { initialMockTransactions } from '../data/mockTransactions';
import { initialMockBudgets } from '../data/mockBudget';
import { initialMockSavings } from '../data/mockSavings';
import { initialMockUser } from '../data/mockUser';
import { mockCashFlowData, mockCategoryBreakdown } from '../data/mockAnalytics';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const USE_MOCK_DATA = true; // Toggle to false when connecting to FastAPI backend

// ==========================================
// 1. AUTHENTICATION & USER API
// ==========================================

export async function loginUser(email: string, password: string): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
  if (USE_MOCK_DATA) {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (email && password) {
      return { success: true, user: initialMockUser, token: 'mock_jwt_token_finshield' };
    }
    return { success: false, error: 'Invalid credentials. Please enter valid email & password.' };
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function registerUser(userData: Partial<UserProfile> & { password: string }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newUser: UserProfile = {
      ...initialMockUser,
      fullName: userData.fullName || 'New User',
      email: userData.email || '',
      monthlyIncome: userData.monthlyIncome || 35000,
    };
    return { success: true, user: newUser };
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
}

export async function googleSignIn(googleData?: { name?: string; email?: string; picture?: string; credential?: string }): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
  const fullName = googleData?.name || 'Aarav Sharma';
  const firstName = fullName.split(' ')[0] || 'User';
  const email = googleData?.email || (fullName.toLowerCase().replace(/\s+/g, '.') + '@gmail.com');
  const avatarUrl = googleData?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=8B1E3F&color=fff`;

  const fallbackUser: UserProfile = {
    ...initialMockUser,
    fullName,
    firstName,
    email,
    avatarUrl,
    authProvider: 'google',
  };

  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return { success: true, user: fallbackUser, token: 'google_oauth_jwt_finshield' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googleData || { name: fullName, email, picture: avatarUrl }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn('Backend server offline, using local Google auth session fallback:', e);
  }

  return { success: true, user: fallbackUser, token: 'google_oauth_jwt_fallback' };
}

export async function getUserProfile(): Promise<UserProfile> {
  if (USE_MOCK_DATA) {
    return initialMockUser;
  }
  const response = await fetch(`${API_BASE_URL}/api/user/profile`);
  return response.json();
}

// ==========================================
// 2. TRANSACTIONS API
// ==========================================

export async function getTransactions(): Promise<Transaction[]> {
  if (USE_MOCK_DATA) {
    return initialMockTransactions;
  }
  const response = await fetch(`${API_BASE_URL}/api/transactions`);
  return response.json();
}

export async function createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  if (USE_MOCK_DATA) {
    const newTx: Transaction = {
      ...transaction,
      id: `tx_${Date.now()}`,
    };
    return newTx;
  }
  const response = await fetch(`${API_BASE_URL}/api/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  });
  return response.json();
}

export async function deleteTransaction(id: string): Promise<{ success: boolean }> {
  if (USE_MOCK_DATA) {
    return { success: true };
  }
  const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}

// ==========================================
// 3. BUDGET API
// ==========================================

export async function getBudgets(): Promise<Budget[]> {
  if (USE_MOCK_DATA) {
    return initialMockBudgets;
  }
  const response = await fetch(`${API_BASE_URL}/api/budget`);
  return response.json();
}

export async function createOrUpdateBudget(budget: Omit<Budget, 'id'>): Promise<Budget> {
  if (USE_MOCK_DATA) {
    return { ...budget, id: `bgt_${Date.now()}` };
  }
  const response = await fetch(`${API_BASE_URL}/api/budget`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget),
  });
  return response.json();
}

// ==========================================
// 4. SAVINGS GOALS API
// ==========================================

export async function getSavingsGoals(): Promise<SavingsGoal[]> {
  if (USE_MOCK_DATA) {
    return initialMockSavings;
  }
  const response = await fetch(`${API_BASE_URL}/api/savings`);
  return response.json();
}

export async function createSavingsGoal(goal: Omit<SavingsGoal, 'id'>): Promise<SavingsGoal> {
  if (USE_MOCK_DATA) {
    return { ...goal, id: `svg_${Date.now()}` };
  }
  const response = await fetch(`${API_BASE_URL}/api/savings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  });
  return response.json();
}

// ==========================================
// 5. SPENDING ANALYTICS API
// ==========================================

export async function getAnalytics(): Promise<{ cashFlow: CashFlowMonth[]; categoryBreakdown: CategorySpending[] }> {
  if (USE_MOCK_DATA) {
    return {
      cashFlow: mockCashFlowData,
      categoryBreakdown: mockCategoryBreakdown,
    };
  }
  const response = await fetch(`${API_BASE_URL}/api/analytics`);
  return response.json();
}

// ==========================================
// 6. SCAM CHECKER API
// ==========================================

export async function checkScamMessage(text: string): Promise<ScamCheckResult> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulated analysis
    const lower = text.toLowerCase();
    const flags: string[] = [];

    if (lower.includes('urgent') || lower.includes('immediately') || lower.includes('blocked') || lower.includes('suspended')) {
      flags.push('Artificial Urgency: Message pressures you into rushing an action without independent verification.');
    }
    if (lower.includes('otp') || lower.includes('pin') || lower.includes('cvv') || lower.includes('password')) {
      flags.push('Critical Credential Request: Demands secret authorization credentials (OTP / PIN).');
    }
    if (lower.includes('lottery') || lower.includes('won') || lower.includes('reward') || lower.includes('cashback') || lower.includes('bonus')) {
      flags.push('Unrealistic Financial Reward / Advance Fee Bait.');
    }
    if (lower.includes('bit.ly') || lower.includes('tinyurl') || lower.includes('http') || lower.includes('click here') || lower.includes('.apk')) {
      flags.push('Suspicious or Shortened Link / Unofficial APK download vector.');
    }
    if (lower.includes('qr') || lower.includes('scan')) {
      flags.push('Reverse QR Trap: Scam claiming you need to scan a QR code to receive funds.');
    }

    if (flags.length >= 2) {
      return {
        riskLevel: 'HIGH RISK',
        riskScore: 88,
        verdict: 'High probability of digital financial fraud. Multiple threat indicators detected.',
        warningSigns: flags,
        recommendedAction: 'Do not click any links, do not scan QR codes, and never share OTPs or banking PINs. Block the sender.',
        scannedText: text,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
    } else if (flags.length === 1) {
      return {
        riskLevel: 'SUSPICIOUS',
        riskScore: 55,
        verdict: 'Suspicious elements detected. Proceed with extreme caution.',
        warningSigns: flags,
        recommendedAction: 'Verify directly by opening your official banking app or calling official customer support numbers.',
        scannedText: text,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
    } else {
      return {
        riskLevel: 'SAFE',
        riskScore: 10,
        verdict: 'No recognized common scam or phishing patterns detected in this text.',
        warningSigns: ['No standard urgency hooks or credential harvesting requests found.'],
        recommendedAction: 'Always practice safe digital hygiene and verify sender identity before transferring funds.',
        scannedText: text,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
    }
  }

  const response = await fetch(`${API_BASE_URL}/api/scam-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return response.json();
}
