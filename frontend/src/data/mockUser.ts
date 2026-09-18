import { UserProfile } from '../types';

export const initialMockUser: UserProfile = {
  id: 'usr_finguard_101',
  fullName: 'Aarav Sharma',
  email: 'aarav.sharma@finshield.in',
  phone: '+91 98765 43210',
  monthlyIncome: 45000,
  currency: 'INR (₹)',
  accountNumberMasked: '•••• •••• •••• 4821',
  ifscCode: 'FSHD0001928',
  twoFactorEnabled: true,
  financialGoals: ['Emergency Fund', 'New Laptop', 'Goa Trip'],
  createdAt: '2026-01-15',
};
