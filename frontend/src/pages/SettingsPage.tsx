import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Shield,
  Bell,
  Lock,
  Globe,
  Smartphone,
  Download,
  Trash2,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Key
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Select from '../components/Select';
import Badge from '../components/Badge';
import { useToast } from '../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [budgetWarnings, setBudgetWarnings] = useState(true);
  const [scamInterception, setScamInterception] = useState(true);
  const [currency, setCurrency] = useState('INR');

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean, label: string) => {
    setter(!current);
    addToast('info', `${label} ${!current ? 'enabled' : 'disabled'}`);
  };

  const handleExportData = () => {
    addToast('success', 'Your complete financial data export (JSON & CSV) has been generated.');
  };

  const handleLogout = () => {
    addToast('info', 'Logged out successfully.');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl font-black text-[#242424] tracking-tight">
            Security & System Settings
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Configure transaction notifications, multi-factor authorization, and privacy preferences.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Security & Access Section */}
        <Card className="p-6 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0F0F0]">
            <Shield className="w-4 h-4 text-[#8B1E3F]" />
            <h2 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
              Security & Authentication
            </h2>
          </div>

          <div className="divide-y divide-[#F0F0F0] text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#242424]">Two-Factor Authentication (2FA)</p>
                <p className="text-[#6B6B6B] mt-0.5">Require TOTP authentication code on new device login.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setTwoFactor, twoFactor, 'Two-Factor Authentication')}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  twoFactor ? 'bg-[#8B1E3F]' : 'bg-[#E5E5E5]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    twoFactor ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#242424]">Biometric App Passcode / FaceID</p>
                <p className="text-[#6B6B6B] mt-0.5">Prompt biometric confirmation before viewing sensitive balances.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setBiometric, biometric, 'Biometric Lock')}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  biometric ? 'bg-[#8B1E3F]' : 'bg-[#E5E5E5]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    biometric ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#242424]">Automated Scam SMS Interceptor</p>
                <p className="text-[#6B6B6B] mt-0.5">Silently analyze incoming transaction SMS for known deceptive sender handles.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setScamInterception, scamInterception, 'Scam Interceptor')}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  scamInterception ? 'bg-[#8B1E3F]' : 'bg-[#E5E5E5]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    scamInterception ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="p-6 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0F0F0]">
            <Bell className="w-4 h-4 text-[#8B1E3F]" />
            <h2 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
              Alerts & Notifications
            </h2>
          </div>

          <div className="divide-y divide-[#F0F0F0] text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#242424]">Instant SMS Transaction Alerts</p>
                <p className="text-[#6B6B6B] mt-0.5">Receive instantaneous SMS notification for transactions &gt; ₹500.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setSmsAlerts, smsAlerts, 'SMS Alerts')}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  smsAlerts ? 'bg-[#8B1E3F]' : 'bg-[#E5E5E5]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    smsAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#242424]">Budget Overdraft Warning</p>
                <p className="text-[#6B6B6B] mt-0.5">Notify when category spending crosses 80% of allocated monthly limit.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setBudgetWarnings, budgetWarnings, 'Budget Warnings')}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  budgetWarnings ? 'bg-[#8B1E3F]' : 'bg-[#E5E5E5]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    budgetWarnings ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Preferences & Regional */}
        <Card className="p-6 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F0F0F0]">
            <Globe className="w-4 h-4 text-[#8B1E3F]" />
            <h2 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
              Preferences & Regional Format
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Select
                label="Base Display Currency"
                value={currency}
                onChange={e => {
                  setCurrency(e.target.value);
                  addToast('info', `Currency set to ${e.target.value}`);
                }}
                options={[
                  { value: 'INR', label: 'INR (₹) — Indian Rupee' },
                  { value: 'USD', label: 'USD ($) — US Dollar' },
                  { value: 'EUR', label: 'EUR (€) — Euro' }
                ]}
              />
            </div>

            <div>
              <Select
                label="Number Formatting Standard"
                value="lakhs"
                onChange={() => {}}
                options={[
                  { value: 'lakhs', label: 'Indian (Lakhs & Crores: 1,00,000)' },
                  { value: 'millions', label: 'International (Millions: 100,000)' }
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Data & Session Actions */}
        <Card className="p-6 bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
            <div>
              <h2 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                Data Management & Session
              </h2>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#242424]">Export Complete Vault Archive</p>
              <p className="text-xs text-[#6B6B6B] mt-0.5">Download your encrypted transaction, savings, and budget ledger.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportData}
            >
              Export JSON Archive
            </Button>
          </div>

          <div className="pt-4 border-t border-[#F0F0F0] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#C62828]">Sign Out of FinShield</p>
              <p className="text-xs text-[#6B6B6B]">Terminates active session on this device.</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={<LogOut className="w-4 h-4" />}
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
