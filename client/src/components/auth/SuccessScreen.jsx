import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sprout, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../common/Button';

export const SuccessScreen = ({
  role = 'farmer',
  title,
  message,
  primaryBtnText,
  primaryBtnPath,
  secondaryBtnText,
  secondaryBtnPath,
}) => {
  const { t } = useTranslation(['auth']);
  const navigate = useNavigate();

  const isFarmer = role === 'farmer';

  return (
    <div className="text-center py-6 sm:py-8 max-w-md mx-auto animate-fadeIn">
      {/* Success Animated Icon */}
      <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-agri-success mx-auto flex items-center justify-center mb-6 shadow-sm">
        <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
      </div>

      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-agri-dark border border-emerald-200 mb-3">
        {t('success.title', { defaultValue: '✓ Registration Successful' })}
      </span>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-agri-textDark mb-3">
        {title || t('success.welcome', { defaultValue: 'Welcome to AgriNova!' })}
      </h2>

      <p className="text-sm sm:text-base text-agri-textSecondary leading-relaxed mb-8">
        {message ||
          (isFarmer
            ? t('success.farmerMessage', { defaultValue: 'Your farmer account has been created successfully.' })
            : t('success.buyerMessage', { defaultValue: 'Your buyer account has been created successfully.' }))}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          icon={ArrowRight}
          iconPosition="right"
          onClick={() => navigate(primaryBtnPath || (isFarmer ? '/farmer/dashboard' : '/buyer/dashboard'))}
          className="w-full justify-center font-bold py-3.5 shadow-md"
        >
          {primaryBtnText || (isFarmer ? t('success.farmerDashboard', { defaultValue: 'Go to Farmer Dashboard' }) : t('success.buyerDashboard', { defaultValue: 'Go to Buyer Dashboard' }))}
        </Button>

        <Button
          variant="outline"
          size="md"
          icon={isFarmer ? Sprout : Store}
          onClick={() => navigate(secondaryBtnPath || (isFarmer ? '/profile' : '/marketplace'))}
          className="w-full justify-center font-bold py-3"
        >
          {secondaryBtnText || (isFarmer ? t('success.completeProfile', { defaultValue: 'Complete Profile' }) : t('success.browseMarket', { defaultValue: 'Browse Marketplace' }))}
        </Button>
      </div>
    </div>
  );
};
