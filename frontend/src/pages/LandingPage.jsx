// FinGuard Landing Page (Overview & Project Mission)

import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { ShieldCheck, Wallet, PieChart, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '2.5rem 1rem 3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.9rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          <Sparkles size={16} /> FinTech Hackathon 2026 Project Scaffold
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--secondary)', lineHeight: 1.2, marginBottom: '1rem' }}>
          Smart Personal Finance &<br />
          <span style={{ color: 'var(--primary)' }}>Secure Digital Transactions</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 2rem' }}>
          FinGuard is an educational financial management platform designed to help students track expenses,
          plan monthly budgets, and develop digital fraud awareness.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/dashboard">
            <Button variant="primary" icon={<ArrowRight size={18} />}>
              Open Live Dashboard
            </Button>
          </Link>
          <Link to="/fraud">
            <Button variant="secondary" icon={<ShieldAlert size={18} />}>
              Fraud Awareness Guide
            </Button>
          </Link>
        </div>
      </div>

      {/* Problem Statement Card */}
      <Card
        title="Problem Statement & Mission"
        subtitle="Addressing real student financial challenges with transparent software"
      >
        <div style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          <p style={{ marginBottom: '0.75rem' }}>
            Young adults entering university and independent life often struggle with daily expense tracking,
            unexpected recurring subscriptions, and rising digital payment scams (fake UPI reward links, urgent lottery hooks, and phishing).
          </p>
          <p>
            <strong>FinGuard</strong> provides a transparent, non-custodial educational tool where users retain complete control
            without exposing bank passwords or UPI credentials.
          </p>
        </div>
      </Card>

      {/* Planned Feature Pillars */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '2rem 0 1rem' }}>Core Modules Scaffolded</h3>
      <div className="grid-3">
        <Card title="1. Expense Tracking" subtitle="Daily transaction logs">
          <div style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}><Wallet size={24} /></div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Categorize campus meals, stationery, and transit. Calculates instant summaries.
          </p>
        </Card>

        <Card title="2. Monthly Budgeting" subtitle="Spending limits & alerts">
          <div style={{ color: '#059669', marginBottom: '0.75rem' }}><PieChart size={24} /></div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Set monthly allowances, monitor balances, and get automated budget warnings.
          </p>
        </Card>

        <Card title="3. Fraud Awareness" subtitle="Educational safety check">
          <div style={{ color: '#dc2626', marginBottom: '0.75rem' }}><ShieldCheck size={24} /></div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Rule-based detection to spot urgency hooks, fake rewards, and phishing flags.
          </p>
        </Card>
      </div>
    </div>
  );
}
