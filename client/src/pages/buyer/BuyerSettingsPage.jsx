import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Globe,
  Sun,
  Lock,
  Bell,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { useToast } from '../../context/ToastContext';

export const BuyerSettingsPage = () => {
  const { user, profile, resetPassword, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const toast = useToast();

  const [sendingReset, setSendingReset] = useState(false);
  const [notifSound, setNotifSound] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handlePasswordReset = async () => {
    try {
      setSendingReset(true);
      await resetPassword(user.email);
      toast.success(`Password reset email sent to ${user.email}. Check your inbox.`);
    } catch (err) {
      toast.error('Failed to send reset link: ' + err.message);
    } finally {
      setSendingReset(false);
    }
  };

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-16 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Procurement Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure language preferences, visual theme, and verified credentials.
        </p>
      </div>

      <div className="space-y-6">
        <Card padding="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Platform Language
              </h3>
              <p className="text-xs text-slate-400">
                Choose your preferred language across AgriNova.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  i18n.changeLanguage(l.code);
                  toast.success(`Language set to ${l.native}`);
                }}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold transition-all ${
                  i18n.language === l.code
                    ? 'border-teal-600 bg-teal-50 dark:bg-emerald-950/40 text-teal-700 dark:text-teal-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{l.native}</span>
                {i18n.language === l.code && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
              </button>
            ))}
          </div>
        </Card>

        <Card padding="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Appearance & Theme
                </h3>
                <p className="text-xs text-slate-400">
                  Switch between Light and Dark modes.
                </p>
              </div>
            </div>

            <ThemeToggle />
          </div>
        </Card>

        <Card padding="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Security & Authentication
              </h3>
              <p className="text-xs text-slate-400">
                Change password using verified Supabase Auth.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Reset Account Password
              </span>
              <span className="text-[11px] text-slate-400">
                We will send a secure link to {user?.email}.
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={sendingReset}
              onClick={handlePasswordReset}
              className="text-xs shrink-0"
            >
              {sendingReset ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </div>
        </Card>

        <Card padding="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Notifications
              </h3>
              <p className="text-xs text-slate-400">
                Set sound and email notifications for contract updates.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Order status change alerts
              </span>
              <input
                type="checkbox"
                checked={notifSound}
                onChange={(e) => setNotifSound(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Direct dispatch email notifications
              </span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
};
