import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, Store, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export const FarmerBuyerCTA = () => {
  const { t } = useTranslation(['home']);
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-[#071A16] border-t border-agri-border/60 dark:border-[#21453A] relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Context Pill */}
        <div className="text-center mb-10">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-agri-softGreen dark:bg-[#0D241E] text-agri-dark dark:text-[#63DBAE] border border-agri-primary/20 dark:border-[#21453A]">
            {t('cta.pill', { defaultValue: 'Tailored Experiences for Both Sides of the Market' })}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-agri-textDark dark:text-[#F3FAF7] mt-3">
            {t('cta.title', { defaultValue: 'Built for Farmers and Bulk Crop Buyers' })}
          </h2>
        </div>

        {/* Two Side-by-Side Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* LEFT: For Farmers */}
          <div className="bg-gradient-to-br from-agri-softGreen/90 via-white to-agri-softGreen/30 dark:from-[#112D25] dark:via-[#0D241E] dark:to-[#112D25] rounded-2xl p-8 sm:p-10 border-2 border-agri-primary/30 dark:border-[#21453A] shadow-card-subtle flex flex-col justify-between relative overflow-hidden group hover:shadow-card-hover transition-all">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-agri-primary dark:bg-[#27C58B] text-white dark:text-[#071A16] flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
                <Sprout className="w-7 h-7" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-agri-dark dark:text-[#63DBAE]">
                {t('cta.farmerBadge', { defaultValue: 'Grower & Producer Portal' })}
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-agri-textDark dark:text-[#F3FAF7] mt-1 mb-3">
                {t('cta.farmerTitle', { defaultValue: 'For Farmers' })}
              </h3>

              <p className="text-base text-agri-textSecondary dark:text-[#A8C2B8] leading-relaxed mb-6 font-normal">
                {t('cta.farmerDesc', { defaultValue: 'List your crops, receive buyer interest and discover better market opportunities.' })}
              </p>

              {/* Farmer Benefits Checklist */}
              <ul className="space-y-2.5 mb-8">
                {[
                  'Zero middleman commission cuts',
                  'Direct buyer inquiries via phone and chat',
                  'Hyperlocal mandi price intelligence',
                  'Fair payment terms and verified contracts',
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-sm font-medium text-agri-textDark dark:text-[#F3FAF7]">
                    <CheckCircle2 className="w-4 h-4 text-agri-primary dark:text-[#27C58B] shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 pt-4 border-t border-agri-primary/15 dark:border-[#21453A]">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/register/farmer')}
                className="w-full sm:w-auto font-bold py-3.5 px-8 shadow-md dark:bg-[#27C58B] dark:text-[#071A16] dark:hover:bg-[#63DBAE]"
              >
                {t('cta.farmerBtn', { defaultValue: 'Start Selling' })}
              </Button>
            </div>
          </div>

          {/* RIGHT: For Buyers */}
          <div className="bg-gradient-to-br from-agri-softBlue/80 via-white to-agri-softBlue/30 dark:from-[#0D241E] dark:via-[#112D25] dark:to-[#0D241E] rounded-2xl p-8 sm:p-10 border-2 border-blue-200/80 dark:border-[#21453A] shadow-card-subtle flex flex-col justify-between relative overflow-hidden group hover:shadow-card-hover transition-all">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-agri-textDark dark:bg-[#27C58B] text-white dark:text-[#071A16] flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
                <Store className="w-7 h-7" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-[#63DBAE]">
                {t('cta.buyerBadge', { defaultValue: 'Trader, Processor & Retail Portal' })}
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-agri-textDark dark:text-[#F3FAF7] mt-1 mb-3">
                {t('cta.buyerTitle', { defaultValue: 'For Buyers' })}
              </h3>

              <p className="text-base text-agri-textSecondary dark:text-[#A8C2B8] leading-relaxed mb-6 font-normal">
                {t('cta.buyerDesc', { defaultValue: 'Discover crops from farmers and connect with sellers based on location, quantity and requirements.' })}
              </p>

              {/* Buyer Benefits Checklist */}
              <ul className="space-y-2.5 mb-8">
                {[
                  'Direct farm-gate sourcing at transparent rates',
                  'Filter by crop grade, moisture content & location',
                  'Direct negotiation with individual growers and FPOs',
                  'Logistics and mandi arrival coordination',
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-sm font-medium text-agri-textDark dark:text-[#F3FAF7]">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-[#63DBAE] shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 pt-4 border-t border-blue-200/50 dark:border-[#21453A]">
              <Button
                variant="dark"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/marketplace')}
                className="w-full sm:w-auto font-bold py-3.5 px-8 shadow-md dark:bg-[#27C58B] dark:text-[#071A16] dark:hover:bg-[#63DBAE]"
              >
                {t('cta.buyerBtn', { defaultValue: 'Browse Crops' })}
              </Button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
