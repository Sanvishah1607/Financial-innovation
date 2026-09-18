import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  User, 
  Menu, 
  X, 
  Plus, 
  LogOut, 
  Settings as SettingsIcon,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, currentBalance } = useFinancial();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 1,
      title: 'Salary Credited',
      desc: '₹45,000 credited from Software Dev Internship.',
      time: '2h ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Budget Alert',
      desc: 'Shopping category is currently over monthly budget.',
      time: 'Yesterday',
      unread: false,
    },
    {
      id: 3,
      title: 'Security Advisory',
      desc: 'Never share your UPI PIN or banking passwords with anyone.',
      time: '2 days ago',
      unread: false,
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/transactions?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E5E5E5] h-16 px-4 lg:px-6 flex items-center justify-between shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
      {/* Left: Mobile Toggle & Brand (on mobile) or Search */}
      <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-lg">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-[#6B6B6B] hover:text-[#242424] hover:bg-[#F7F7F8] rounded-md"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo */}
        <Link to="/dashboard" className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 bg-[#8B1E3F] text-white rounded flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-[#8B1E3F] text-base tracking-tight">
            FinShield
          </span>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden lg:block w-full">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9E9E9E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses, budgets, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-[#F7F7F8] border border-[#E5E5E5] rounded-md text-xs text-[#242424] placeholder-[#9E9E9E] focus:outline-none focus:bg-white focus:border-[#8B1E3F] transition-colors"
            />
          </div>
        </form>
      </div>

      {/* Right: Quick Balance, Add Button, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add Action */}
        <Link
          to="/add-expense"
          className="hidden sm:inline-flex items-center gap-1.5 bg-[#8B1E3F] text-white hover:bg-[#731834] px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Expense</span>
        </Link>

        {/* Balance Badge */}
        <div className="hidden md:flex flex-col text-right px-2.5 py-1 bg-[#F8E9EE]/70 border border-[#E9C8D4] rounded">
          <span className="text-[10px] uppercase font-bold text-[#8B1E3F]">
            Available Balance
          </span>
          <span className="text-xs font-extrabold text-[#64152E]">
            ₹{currentBalance.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 text-[#6B6B6B] hover:text-[#242424] hover:bg-[#F7F7F8] rounded-md transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C62828] rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md border border-[#E5E5E5] shadow-lg py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-[#F0F0F0] flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#242424]">
                  Notifications
                </span>
                <span className="text-[11px] text-[#8B1E3F] font-semibold cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-2.5 hover:bg-[#F7F7F8] cursor-pointer border-b border-[#F5F5F5] last:border-b-0 ${
                      n.unread ? 'bg-[#F8E9EE]/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#242424]">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-[#9E9E9E]">{n.time}</span>
                    </div>
                    <p className="text-xs text-[#6B6B6B] mt-0.5 leading-snug">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-md hover:bg-[#F7F7F8] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#8B1E3F] text-white flex items-center justify-center font-bold text-xs">
              {user.fullName.charAt(0)}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-[#242424] leading-tight">
                {user.fullName}
              </div>
              <div className="text-[10px] text-[#6B6B6B]">Student Account</div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-md border border-[#E5E5E5] shadow-lg py-1.5 z-50 animate-fadeIn text-xs">
              <div className="px-3.5 py-2 border-b border-[#F0F0F0]">
                <p className="font-bold text-[#242424]">{user.fullName}</p>
                <p className="text-[11px] text-[#6B6B6B] truncate">{user.email}</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#F7F7F8] text-[#242424]"
              >
                <User className="w-3.5 h-3.5 text-[#6B6B6B]" />
                Profile & Goals
              </Link>
              <Link
                to="/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#F7F7F8] text-[#242424]"
              >
                <SettingsIcon className="w-3.5 h-3.5 text-[#6B6B6B]" />
                Account Settings
              </Link>
              <Link
                to="/learn"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#F7F7F8] text-[#242424]"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#6B6B6B]" />
                Help & Learning
              </Link>
              <div className="border-t border-[#F0F0F0] my-1"></div>
              <Link
                to="/"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3.5 py-2 hover:bg-[#FCE8E8] text-[#C62828] font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
