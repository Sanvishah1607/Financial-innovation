import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  PieChart,
  PiggyBank,
  BarChart3,
  Calculator,
  ShieldAlert,
  BookOpen,
  User,
  Settings,
  ShieldCheck,
  Lock,
  ChevronRight,
  Camera
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const financeNav = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/transactions', label: 'Transactions', icon: <Receipt className="w-4 h-4" /> },
    { to: '/add-expense', label: 'Add Expense', icon: <PlusCircle className="w-4 h-4" /> },
    { to: '/budget', label: 'Budget Planning', icon: <PieChart className="w-4 h-4" /> },
    { to: '/savings', label: 'Savings Goals', icon: <PiggyBank className="w-4 h-4" /> },
    { to: '/analytics', label: 'Spending Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const toolsNav = [
    { to: '/receipt-scanner', label: 'Receipt Scanner', icon: <Camera className="w-4 h-4" /> },
    { to: '/calculators', label: 'Financial Calculators', icon: <Calculator className="w-4 h-4" /> },
    { to: '/scam-checker', label: 'Scam Checker', icon: <ShieldAlert className="w-4 h-4 text-[#8B1E3F]" />, badge: 'Shield' },
    { to: '/learn', label: 'Financial Learning', icon: <BookOpen className="w-4 h-4" /> },
  ];

  const accountNav = [
    { to: '/profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-[#E5E5E5] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#E5E5E5] flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#8B1E3F] text-white rounded-md flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-[#8B1E3F] text-lg tracking-tight block leading-tight">
                FinShield
              </span>
              <span className="text-[10px] font-semibold text-[#6B6B6B] block uppercase tracking-wider">
                Banking & Safety
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Section 1: Finances */}
          <div>
            <div className="px-3 text-[10px] font-bold text-[#9E9E9E] uppercase tracking-wider mb-2">
              Financial Management
            </div>
            <nav className="space-y-0.5">
              {financeNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#F8E9EE] text-[#8B1E3F] border-l-3 border-[#8B1E3F]'
                        : 'text-[#4A4A4A] hover:bg-[#F7F7F8] hover:text-[#242424]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Section 2: Tools & Digital Safety */}
          <div>
            <div className="px-3 text-[10px] font-bold text-[#9E9E9E] uppercase tracking-wider mb-2">
              Tools & Digital Safety
            </div>
            <nav className="space-y-0.5">
              {toolsNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#F8E9EE] text-[#8B1E3F] border-l-3 border-[#8B1E3F]'
                        : 'text-[#4A4A4A] hover:bg-[#F7F7F8] hover:text-[#242424]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] bg-[#8B1E3F] text-white font-extrabold px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Section 3: Settings */}
          <div>
            <div className="px-3 text-[10px] font-bold text-[#9E9E9E] uppercase tracking-wider mb-2">
              Account & Preferences
            </div>
            <nav className="space-y-0.5">
              {accountNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#F8E9EE] text-[#8B1E3F] border-l-3 border-[#8B1E3F]'
                        : 'text-[#4A4A4A] hover:bg-[#F7F7F8] hover:text-[#242424]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Security Mini Banner at bottom of sidebar */}
        <div className="p-3 border-t border-[#E5E5E5] bg-[#F7F7F8]">
          <Link
            to="/scam-checker"
            onClick={onClose}
            className="block p-2.5 bg-white border border-[#E5E5E5] rounded-md hover:border-[#8B1E3F]/40 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-3.5 h-3.5 text-[#8B1E3F]" />
              <span className="text-xs font-bold text-[#8B1E3F]">
                Digital Security Tip
              </span>
            </div>
            <p className="text-[11px] text-[#6B6B6B] leading-tight">
              Banks will never ask for your UPI PIN to credit refunds or bonuses.
            </p>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
