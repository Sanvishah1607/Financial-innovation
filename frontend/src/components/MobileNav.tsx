import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  PieChart,
  ShieldAlert,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const items = [
    { to: '/dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/transactions', label: 'Expenses', icon: <Receipt className="w-5 h-5" /> },
    { to: '/add-expense', label: 'Add', icon: <PlusCircle className="w-6 h-6 text-[#8B1E3F]" />, highlight: true },
    { to: '/budget', label: 'Budget', icon: <PieChart className="w-5 h-5" /> },
    { to: '/scam-checker', label: 'Shield', icon: <ShieldAlert className="w-5 h-5" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E5E5E5] px-2 py-1.5 capacitor-bottom-safe shadow-[0_-2px_6px_rgba(0,0,0,0.03)] flex items-center justify-around">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-1 min-w-[54px] rounded transition-colors ${
              item.highlight
                ? 'text-[#8B1E3F]'
                : isActive
                ? 'text-[#8B1E3F] font-bold'
                : 'text-[#6B6B6B] hover:text-[#242424]'
            }`
          }
        >
          {item.icon}
          <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default MobileNav;
