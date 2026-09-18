// Login Page
// TODO: Dhanvi to build login form UI here

import React from 'react';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';

export default function LoginPage() {
  return (
    <div style={{ maxWidth: '440px', margin: '2rem auto' }}>
      <Card title="Login">
        {/* TODO: Dhanvi - Build email and password input fields */}
        {/* TODO: Sanvi & Neev - Connect to Supabase Auth */}
        <EmptyState
          title="Sign In Form Placeholder"
          description="TODO: Build login inputs and connect to auth service."
        />
      </Card>
    </div>
  );
}
