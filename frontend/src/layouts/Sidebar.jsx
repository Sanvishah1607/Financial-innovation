// Dashboard Navigation Sidebar

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Receipt,
  PiggyBank,
  PieChart,
  BookOpen,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  LogIn
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/', label: 'Overview', icon: <Home size={18} /> },
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/transactions', label: 'Transactions', icon: <Receipt size={18} /> },
    { to: '/budget', label: 'Monthly Budget', icon: <PieChart size={18} /> },
    { to: '/savings', label: 'Savings Goals', icon: <PiggyBank size={18} /> },
    { to: '/education', label: 'Financial Education', icon: <BookOpen size={18} /> },
    { to: '/fraud', label: 'Fraud Awareness', icon: <ShieldAlert size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <ShieldCheck size={28} color="#3b82f6" />
        <div className="brand-title">FinGuard</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div style={{ margin: '1rem 0 0.5rem', padding: '0 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
          Account UI
        </div>
        <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LogIn size={18} />
          <span>Login</span>
        </NavLink>
        <NavLink to="/register" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <UserPlus size={18} />
          <span>Register</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div><strong>FinTech Hackathon 2026</strong></div>
        <div>Built by Dhanvi, Neev & Sanvi</div>
      </div>
    </aside>
  );
}
