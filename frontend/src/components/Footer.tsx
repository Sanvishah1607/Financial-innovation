import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E5E5E5] mt-12 py-8 px-4 lg:px-8 text-xs text-[#6B6B6B]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand info */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#8B1E3F] text-white rounded flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold text-[#8B1E3F] text-sm">FinShield</span>
          <span>•</span>
          <span>"Your Money. Your Shield."</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 text-[#4A4A4A]">
          <Link to="/learn" className="hover:text-[#8B1E3F] transition-colors">
            Financial Learning
          </Link>
          <Link to="/scam-checker" className="hover:text-[#8B1E3F] transition-colors">
            Scam Checker
          </Link>
          <Link to="/calculator" className="hover:text-[#8B1E3F] transition-colors">
            Calculators
          </Link>
          <Link to="/settings" className="hover:text-[#8B1E3F] transition-colors">
            Security Notice
          </Link>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-1.5 text-[#218739] font-semibold bg-[#EAF5EC] px-2.5 py-1 rounded">
          <Lock className="w-3.5 h-3.5" />
          <span>Non-Custodial Educational Architecture</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-[#F0F0F0] text-center text-[#9E9E9E] text-[11px]">
        FinShield — Designed for young adults, students & first-time earners. 
        All financial tools use non-custodial architecture prepared for FastAPI & PostgreSQL connection.
      </div>
    </footer>
  );
};

export default Footer;
