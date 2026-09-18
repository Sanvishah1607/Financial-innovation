// Monthly Budget Page
// TODO: Dhanvi to build budget setup form, progress bars, and warning alerts here

import React from 'react';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';

export default function BudgetPage() {
  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--secondary)' }}>
        Monthly Budget
      </h1>

      {/* TODO: Dhanvi - Add monthly budget input, spending vs budget progress bar, and warning alerts */}
      <Card title="Budget Management">
        <EmptyState
          title="No Budget Set"
          description="TODO: Connect to Neev's /api/v1/budgets endpoints to set and monitor monthly spending limits."
        />
      </Card>
    </div>
  );
}
