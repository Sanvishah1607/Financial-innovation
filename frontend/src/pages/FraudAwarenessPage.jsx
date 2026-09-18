// Fraud Awareness Page
// TODO: Dhanvi to build suspicious message input box, rule indicators list, and safety tips here

import React from 'react';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';

export default function FraudAwarenessPage() {
  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--secondary)' }}>
        Fraud Awareness & Digital Safety
      </h1>

      {/* TODO: Dhanvi - Build text scanner form to test suspicious SMS/UPI messages */}
      {/* TODO: Dhanvi - Display detected warning signs and safety checklist */}
      <Card title="Digital Safety Assistant">
        <EmptyState
          title="Fraud Awareness Module"
          description="TODO: Connect to Neev's /api/v1/fraud/check endpoint to scan message text for risk indicators."
        />
      </Card>
    </div>
  );
}
