// Top Navigation Bar

import React from 'react';
import { useHealth } from '../hooks/useHealth';
import { Shield, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { isOnline, loading, lastChecked, refetch } = useHealth();

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
          <Shield size={24} />
          <span>FinGuard</span>
        </Link>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem' }}>
          Personal Finance & Security
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Backend Health Status Badge */}
        {loading ? (
          <span className="badge badge-placeholder">
            <span>●</span> Checking Backend...
          </span>
        ) : isOnline ? (
          <span className="badge badge-online" title={`Last verified: ${lastChecked}`}>
            <span>●</span> Backend Online (:8000)
          </span>
        ) : (
          <span className="badge badge-offline" title="Backend not responding on port 8000">
            <span>●</span> Backend Offline
          </span>
        )}

        <button
          onClick={refetch}
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
          title="Ping backend"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Check API
        </button>

        <Link to="/login" className="btn btn-outline" style={{ padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}>
          Sign In
        </Link>
      </div>
    </header>
  );
}
