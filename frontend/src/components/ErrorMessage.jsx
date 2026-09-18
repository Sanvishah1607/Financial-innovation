// Reusable Error Message Banner

import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({
  title = 'An error occurred',
  message,
  onRetry = null,
}) {
  if (!message) return null;

  return (
    <div
      style={{
        backgroundColor: '#fef2f2',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        color: '#b91c1c',
        marginBottom: '1.25rem',
      }}
    >
      <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1 }}>
        <h5 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{title}</h5>
        <p style={{ fontSize: '0.85rem', color: '#dc2626' }}>{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: 'none',
            border: 'none',
            color: '#b91c1c',
            fontWeight: 700,
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
