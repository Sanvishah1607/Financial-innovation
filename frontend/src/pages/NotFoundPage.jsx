// 404 Page Not Found Component

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { HelpCircle, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '1.25rem' }}>
        <HelpCircle size={36} />
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--secondary)' }}>Page Not Found (404)</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
        The page you are looking for does not exist or has been moved in the FinGuard app.
      </p>
      <Link to="/">
        <Button variant="primary" icon={<Home size={16} />}>
          Return to Overview
        </Button>
      </Link>
    </div>
  );
}
