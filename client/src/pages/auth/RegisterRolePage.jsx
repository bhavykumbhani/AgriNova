import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Store, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RoleSelectionCard } from '../../components/auth/RoleSelectionCard';

export const RegisterRolePage = () => {
  const { t } = useTranslation(['auth']);
  const navigate = useNavigate();

  return (
    <main className="min-h-[85vh] bg-agri-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-agri-softGreen text-agri-dark border border-agri-primary/20 mb-3">
            <Sprout className="w-3.5 h-3.5 text-agri-primary" />
            <span>Registration Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-agri-textDark tracking-tight mb-3">
            {t('join.title', { defaultValue: 'Join AgriNova' })}
          </h1>

          <p className="text-base sm:text-lg text-agri-textSecondary">
            {t('join.subtitle', { defaultValue: 'Choose how you want to use AgriNova.' })}
          </p>
        </div>

        {/* Two Large Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10">
          {/* Farmer Role Card */}
          <RoleSelectionCard
            role="farmer"
            title={t('join.farmerTitle', { defaultValue: 'Farmer' })}
            description={t('join.farmerDesc', {
              defaultValue:
                'Sell your crops, connect with buyers, monitor markets and access agricultural insights.',
            })}
            icon={Sprout}
            badgeText="For Growers & FPOs"
            buttonText={t('join.farmerBtn', { defaultValue: 'Continue as Farmer' })}
            onClick={() => navigate('/register/farmer')}
            accentColor="emerald"
            features={[
              'Direct farmer-to-buyer sales with zero middlemen cuts',
              'Real-time APMC mandi price benchmarks',
              'Hyperlocal agro-meteorological satellite forecasts',
            ]}
          />

          {/* Buyer Role Card */}
          <RoleSelectionCard
            role="buyer"
            title={t('join.buyerTitle', { defaultValue: 'Buyer' })}
            description={t('join.buyerDesc', {
              defaultValue:
                'Discover agricultural produce, connect directly with farmers and manage sourcing opportunities.',
            })}
            icon={Store}
            badgeText="For Traders & Mills"
            buttonText={t('join.buyerBtn', { defaultValue: 'Continue as Buyer' })}
            onClick={() => navigate('/register/buyer')}
            accentColor="blue"
            features={[
              'Source verified crops directly from farm-gates',
              'Filter by moisture, grade, variety and state',
              'Direct negotiation with individual growers and FPOs',
            ]}
          />
        </div>

        {/* Footer Link */}
        <div className="text-center pt-6 border-t border-agri-border/60">
          <p className="text-sm text-agri-textSecondary">
            {t('join.haveAccount', { defaultValue: 'Already have an account?' })}{' '}
            <Link to="/login" className="font-bold text-agri-primary hover:text-agri-dark underline decoration-wavy underline-offset-4">
              {t('join.signIn', { defaultValue: 'Sign In' })}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};
