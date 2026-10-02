import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KeyRound, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { TextInput } from '../../components/common/TextInput';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const ForgotPasswordPage = () => {
  const { t } = useTranslation(['auth']);
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email.trim());
      setSuccessMsg(
        t('forgot.checkEmail', {
          defaultValue: 'Password reset instructions have been sent to your email.',
        })
      );
    } catch (err) {
      setErrorMsg(err.message || 'Unable to process reset request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] bg-agri-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-agri-border">
        {/* Icon & Heading */}
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-agri-orange flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <KeyRound className="w-7 h-7" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-agri-textDark">
            {t('forgot.title', { defaultValue: 'Reset Password' })}
          </h1>
          <p className="text-xs sm:text-sm text-agri-textSecondary mt-1">
            {t('forgot.subtitle', {
              defaultValue: 'Enter your registered email address to receive password reset instructions.',
            })}
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-agri-success shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-agri-danger shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            id="resetEmail"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
            placeholder="farmer@agrinova.in"
            icon={Mail}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full justify-center font-bold py-3.5 shadow-md"
          >
            {t('forgot.sendLink', { defaultValue: 'Send Reset Link' })}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-agri-primary hover:text-agri-dark"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('forgot.backToLogin', { defaultValue: 'Back to Sign In' })}</span>
          </Link>
        </div>
      </div>
    </main>
  );
};
