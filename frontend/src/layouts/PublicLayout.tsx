import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import Footer from '../components/Footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F7F8] flex flex-col">
      {/* Public Top Header */}
      <header className="bg-white border-b border-[#E5E5E5] sticky top-0 z-30 h-16 px-4 lg:px-8 flex items-center justify-between shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#8B1E3F] text-white rounded-md flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-[#8B1E3F] text-lg tracking-tight block leading-tight">
              FinShield
            </span>
            <span className="text-[10px] font-semibold text-[#6B6B6B] block uppercase tracking-wider">
              Your Money. Your Shield.
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#242424] hover:text-[#8B1E3F] px-3 py-1.5 rounded transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>

          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 bg-[#8B1E3F] hover:bg-[#731834] text-white text-xs font-semibold px-3.5 py-1.5 rounded-md shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Get Started</span>
          </Link>
        </div>
      </header>

      {/* Public Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
