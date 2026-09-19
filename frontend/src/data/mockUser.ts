import { UserProfile } from '../types';

export const initialMockUser: UserProfile = {
  id: 'usr_default',
  fullName: 'FinShield User',
  email: 'user@finshield.in',
  phone: '+91 98765 00000',
  monthlyIncome: 35000,
  currency: 'INR (₹)',
  accountNumberMasked: '•••• •••• •••• 4821',
  ifscCode: 'FSHD0001928',
  twoFactorEnabled: true,
  financialGoals: ['Emergency Fund'],
  createdAt: new Date().toISOString(),
};
