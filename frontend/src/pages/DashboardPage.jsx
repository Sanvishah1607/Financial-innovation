// Dashboard Page
// TODO: Dhanvi to build student finance summary cards and charts here

import React from 'react';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';

export default function DashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--secondary)' }}>
        Dashboard
      </h1>

      {/* TODO: Dhanvi - Add balance, monthly spend, savings, and health score widgets */}
      <Card title="Overview">
        <EmptyState
          title="Dashboard Under Construction"
          description="TODO: Implement summary widgets, spending graphs, and quick actions."
        />
      </Card>
    </div>
  );
}
