// Utility functions for currency and date formatting

/**
 * Format number to Indian Rupee (INR) currency string
 * @param {number} amount
 * @returns {string} e.g. "₹1,250.00"
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

/**
 * Format ISO date string to human-readable date
 * @param {string|Date} date
 * @returns {string} e.g. "18 Sep 2026"
 */
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
