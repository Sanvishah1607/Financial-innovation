// Savings Goals Page
// TODO: Dhanvi to build savings goal input form, deadline calculator, and progress bars here

import React from 'react';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';

export default function SavingsPage() {
  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--secondary)' }}>
        Savings Goals
      </h1>

      {/* TODO: Dhanvi - Add savings target form (goal name, target amount, deadline months) */}
      {/* TODO: Dhanvi - Display monthly required savings calculation */}
      <Card title="Savings Goals">
        <EmptyState
          title="No Goals Found"
          description="TODO: Connect to Neev's /api/v1/savings/calculate endpoint to project monthly savings."
        />
      </Card>
    </div>
  );
}
