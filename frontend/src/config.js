// FinGuard Frontend Configuration
// Loads environment variables with safe defaults

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const APP_CONFIG = {
  name: 'FinGuard',
  tagline: 'Smart Personal Finance & Secure Digital Transactions',
  version: '1.0.0',
};
