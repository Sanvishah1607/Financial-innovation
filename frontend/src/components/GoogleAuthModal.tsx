import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { User, Mail, Check, ShieldCheck, ArrowRight } from 'lucide-react';

interface GoogleAccountOption {
  name: string;
  email: string;
  avatar: string;
}

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: { name: string; email: string; picture: string }) => void;
  isLoading?: boolean;
}

const DEFAULT_ACCOUNTS: GoogleAccountOption[] = [
  {
    name: 'Neev Shah',
    email: 'neev.shah@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Neev+Shah&background=1E88E5&color=fff',
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=8B1E3F&color=fff',
  },
];

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
  isLoading = false,
}) => {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;

    onSelectAccount({
      name: customName.trim(),
      email: customEmail.trim(),
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(customName.trim())}&background=4285F4&color=fff`,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="text-center pb-3">
        {/* Google Logo */}
        <div className="flex justify-center mb-2">
          <svg className="w-9 h-9" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </div>

        <h3 className="text-base font-bold text-[#242424]">Sign in with Google</h3>
        <p className="text-xs text-[#6B6B6B] mt-0.5">
          to continue to <strong className="text-[#8B1E3F]">FinShield Security</strong>
        </p>
      </div>

      {!isCustomMode ? (
        <div className="space-y-2.5 mt-4">
          <div className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider px-1">
            Choose a Google Account
          </div>

          <div className="divide-y divide-[#F0F0F0] border border-[#E5E5E5] rounded-lg overflow-hidden bg-white">
            {DEFAULT_ACCOUNTS.map((acc) => {
              const firstName = acc.name.split(' ')[0];
              return (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() =>
                    onSelectAccount({
                      name: acc.name,
                      email: acc.email,
                      picture: acc.avatar,
                    })
                  }
                  disabled={isLoading}
                  className="w-full flex items-center gap-3.5 p-3.5 text-left hover:bg-[#F8F9FA] transition-colors group"
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full border border-[#E5E5E5] shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-[#242424] group-hover:text-[#4285F4] transition-colors truncate">
                        {acc.name}
                      </p>
                      <span className="text-[10px] font-medium bg-[#E8F0FE] text-[#1A73E8] px-1.5 py-0.2 rounded">
                        {firstName}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B6B6B] truncate">{acc.email}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#BDBDBD] group-hover:text-[#4285F4] group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </div>

          {/* Use another Google account button */}
          <button
            type="button"
            onClick={() => setIsCustomMode(true)}
            className="w-full py-2.5 px-3 text-xs font-semibold text-[#1A73E8] hover:bg-[#F1F3F4] rounded-md transition-colors flex items-center justify-center gap-2 border border-dashed border-[#1A73E8]/30"
          >
            <User className="w-4 h-4" />
            <span>Use another Google account</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleCustomSubmit} className="space-y-3.5 mt-4">
          <div className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">
            Enter Your Google Profile Info
          </div>

          <Input
            label="Google Account Name"
            placeholder="e.g. Neev Shah"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            leftIcon={<User className="w-4 h-4 text-[#6B6B6B]" />}
            required
            autoFocus
          />

          <Input
            label="Google Gmail Address"
            type="email"
            placeholder="e.g. neev.shah@gmail.com"
            value={customEmail}
            onChange={(e) => setCustomEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-[#6B6B6B]" />}
            required
          />

          <div className="flex items-center justify-between pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCustomMode(false)}
            >
              Back to List
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Authorize & Sign In
            </Button>
          </div>
        </form>
      )}

      {/* Google Privacy Footer */}
      <div className="mt-5 pt-3 border-t border-[#F0F0F0] text-[10px] text-[#6B6B6B] text-center leading-relaxed">
        To continue, Google will share your name, email address, and profile picture with FinShield.
      </div>
    </Modal>
  );
};

export default GoogleAuthModal;
