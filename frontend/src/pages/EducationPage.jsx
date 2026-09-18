// Financial Education Page
// TODO: Dhanvi to build financial literacy topic cards and quiz UI here

import React from 'react';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';

export default function EducationPage() {
  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--secondary)' }}>
        Financial Education
      </h1>

      {/* TODO: Dhanvi - Display educational guides (budgeting, credit, smart spending) */}
      <Card title="Learning Modules">
        <EmptyState
          title="Education Hub"
          description="TODO: Connect to /api/v1/education to render student-friendly financial guides."
        />
      </Card>
    </div>
  );
}
