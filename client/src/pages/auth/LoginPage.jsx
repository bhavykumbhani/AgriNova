import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, LogIn, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { TextInput } from '../../components/common/TextInput';
import { PasswordInput } from '../../components/common/PasswordInput';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const { t } = useTranslation(['auth']);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAuthenticated, role } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already logged in, redirect to appropriate role dashboard
  React.useEffect(() => {
    if (isAuthenticated && role) {
      const redirectPath =
        location.state?.from?.pathname ||
        (role === 'buyer' ? '/buyer/dashboard' : '/farmer/dashboard');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, role, location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await signIn(email.trim(), password);

      if (res?.error) {
        setErrorMessage(res.error.message || 'Invalid email or password. Please verify credentials.');
        return;
      }

      // Check role from returned profile
      const userRole = res?.data?.profile?.role || (email.includes('buyer') ? 'buyer' : 'farmer');
      const targetPath =
        location.state?.from?.pathname ||
        (userRole === 'buyer' ? '/buyer/dashboard' : '/farmer/dashboard');

      navigate(targetPath, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] bg-agri-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-agri-border relative overflow-hidden">
        {/* Top subtle glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 rounded-full bg-agri-softGreen/60 blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center mb-8 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-agri-primary to-agri-dark flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-agri-textDark">
              Agri<span className="text-agri-primary">Nova</span>
            </span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-textDark tracking-tight">
            {t('login.title', { defaultValue: 'Welcome Back' })}
          </h1>
          <p className="text-xs sm:text-sm text-agri-textSecondary mt-1">
            {t('login.subtitle', { defaultValue: 'Sign in to continue to AgriNova.' })}
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-agri-danger shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Single Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <TextInput
            id="loginEmail"
            label={t('login.emailLabel', { defaultValue: 'Email Address' })}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
            autoComplete="email"
            placeholder={t('login.emailPlaceholder', { defaultValue: 'name@example.com' })}
          />

          <PasswordInput
            id="loginPassword"
            label={t('login.passwordLabel', { defaultValue: 'Password' })}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={true}
            autoComplete="current-password"
            placeholder={t('login.passwordPlaceholder', { defaultValue: 'Enter your password' })}
          />

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-agri-textDark font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-agri-primary focus:ring-agri-primary border-gray-300"
              />
              <span>{t('login.rememberMe', { defaultValue: 'Remember Me' })}</span>
            </label>

            <Link
              to="/forgot-password"
              className="font-semibold text-agri-primary hover:text-agri-dark transition-colors"
            >
              {t('login.forgotPassword', { defaultValue: 'Forgot Password?' })}
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={LogIn}
            loading={loading}
            className="w-full justify-center font-bold py-3.5 shadow-md mt-2"
          >
            {t('login.signInBtn', { defaultValue: 'Sign In' })}
          </Button>
        </form>

        {/* Footer Link: Create Account */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-agri-textSecondary">
          <span>{t('login.noAccount', { defaultValue: "Don't have an account?" })} </span>
          <Link
            to="/register"
            className="font-bold text-agri-primary hover:text-agri-dark underline decoration-wavy underline-offset-4"
          >
            {t('login.createAccount', { defaultValue: 'Create Account' })}
          </Link>
        </div>

        {/* Automatic role detection note */}
        <div className="mt-4 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-500 text-center flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-agri-primary" />
          <span>Role is automatically detected (Farmer or Buyer)</span>
        </div>
      </div>
    </main>
  );
};
