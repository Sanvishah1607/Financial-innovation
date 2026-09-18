// Register Page
// TODO: Dhanvi to build registration form UI here

import React from 'react';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';

export default function RegisterPage() {
  return (
    <div style={{ maxWidth: '440px', margin: '2rem auto' }}>
      <Card title="Register">
        {/* TODO: Dhanvi - Build name, email, and password registration inputs */}
        {/* TODO: Sanvi & Neev - Connect to Supabase Auth */}
        <EmptyState
          title="Registration Form Placeholder"
          description="TODO: Build registration inputs and connect to auth service."
        />
      </Card>
    </div>
  );
}
