import { SavingsGoal } from '../types';

export const initialMockSavings: SavingsGoal[] = [
  {
    id: 'svg_1',
    name: 'Emergency Fund',
    targetAmount: 50000,
    currentAmount: 35000,
    targetDate: '2026-12-31',
    category: 'Safety',
    color: '#8B1E3F',
  },
  {
    id: 'svg_2',
    name: 'New Laptop for Coding',
    targetAmount: 80000,
    currentAmount: 40000,
    targetDate: '2027-03-31',
    category: 'Electronics',
    color: '#218739',
  },
  {
    id: 'svg_3',
    name: 'Goa Hackathon Trip',
    targetAmount: 30000,
    currentAmount: 12000,
    targetDate: '2026-11-15',
    category: 'Travel',
    color: '#C88719',
  },
];
