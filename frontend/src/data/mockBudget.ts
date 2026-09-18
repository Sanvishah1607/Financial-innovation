import { Budget } from '../types';

export const initialMockBudgets: Budget[] = [
  {
    id: 'bgt_1',
    category: 'Food',
    allocatedAmount: 6000,
    spentAmount: 4500,
    month: '2026-09',
  },
  {
    id: 'bgt_2',
    category: 'Transport',
    allocatedAmount: 3000,
    spentAmount: 2000,
    month: '2026-09',
  },
  {
    id: 'bgt_3',
    category: 'Shopping',
    allocatedAmount: 5000,
    spentAmount: 5500, // Over budget
    month: '2026-09',
  },
  {
    id: 'bgt_4',
    category: 'Entertainment',
    allocatedAmount: 3000,
    spentAmount: 1500,
    month: '2026-09',
  },
  {
    id: 'bgt_5',
    category: 'Bills',
    allocatedAmount: 14000,
    spentAmount: 12799,
    month: '2026-09',
  },
  {
    id: 'bgt_6',
    category: 'Education',
    allocatedAmount: 2500,
    spentAmount: 1900,
    month: '2026-09',
  },
];
