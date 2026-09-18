// Reusable Loading State Widget

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading FinGuard data...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
      <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '0.75rem', animation: 'spin 1s linear infinite' }} />
      <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
