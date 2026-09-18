// Transactions & Expense Tracking Page
// TODO: Dhanvi to build expense form, transaction table, and category filters here

import React from 'react';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';

export default function TransactionsPage() {
  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--secondary)' }}>
        Transactions
      </h1>

      {/* TODO: Dhanvi - Add expense form (title, amount, category, date) */}
      {/* TODO: Dhanvi - Add transaction list table with delete button */}
      <Card title="Expense Tracker">
        <EmptyState
          title="No Transactions"
          description="TODO: Connect to Neev's /api/v1/transactions endpoints to record and display expenses."
        />
      </Card>
    </div>
  );
}
