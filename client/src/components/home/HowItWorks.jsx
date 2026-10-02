import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserCheck, Search, MessageSquareShare, Truck } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

export const HowItWorks = () => {
  const { t } = useTranslation(['home']);

  const steps = [
    {
      step: 1,
      title: t('howItWorks.step1Title', { defaultValue: 'Create Your Account' }),
      description: t('howItWorks.step1Desc', { defaultValue: 'Join AgriNova as a farmer or buyer in minutes with secure verification.' }),
      tag: t('howItWorks.step1Tag', { defaultValue: 'Quick Onboarding' }),
      icon: UserCheck,
    },
    {
      step: 2,
      title: t('howItWorks.step2Title', { defaultValue: 'List or Search Crops' }),
      description: t('howItWorks.step2Desc', { defaultValue: 'Farmers publish available produce with photos and grade, while buyers discover verified crops.' }),
      tag: t('howItWorks.step2Tag', { defaultValue: 'Direct Discovery' }),
      icon: Search,
    },
    {
      step: 3,
      title: t('howItWorks.step3Title', { defaultValue: 'Connect & Negotiate' }),
      description: t('howItWorks.step3Desc', { defaultValue: 'Discuss quantity, quality specs, delivery terms, and fair pricing without intermediaries.' }),
      tag: t('howItWorks.step3Tag', { defaultValue: 'Transparent Chat' }),
      icon: MessageSquareShare,
    },
    {
      step: 4,
      title: t('howItWorks.step4Title', { defaultValue: 'Trade & Deliver' }),
      description: t('howItWorks.step4Desc', { defaultValue: 'Finalize the deal with verified agreements and arrange convenient transport or farm pickup.' }),
      tag: t('howItWorks.step4Tag', { defaultValue: 'Secure Settlement' }),
      icon: Truck,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#071A16] border-y border-agri-border/60 dark:border-[#21453A] relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Heading */}
        <SectionHeading
          badgeText={t('howItWorks.badge', { defaultValue: 'Simple & Direct' })}
          title={t('howItWorks.title', { defaultValue: 'How AgriNova' })}
          highlightWord={t('howItWorks.titleHighlight', { defaultValue: 'Works' })}
          subtitle={t('howItWorks.subtitle', { defaultValue: 'A simple and transparent journey from farm to market.' })}
          align="center"
        />

        {/* 4-Step Process: Horizontal on Desktop, Vertical on Mobile */}
        <div className="relative mt-12">
          
          {/* Connecting Line on Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-agri-primary/30 via-agri-teal/40 to-agri-primary/30 dark:from-[#21453A] dark:via-[#27C58B]/30 dark:to-[#21453A] -translate-y-12 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((stepItem) => {
              const IconComponent = stepItem.icon;
              return (
                <div key={stepItem.step} className="flex flex-col items-center text-center group">
                  {/* Number Circle and Icon Container */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-agri-softGreen to-white dark:from-[#112D25] dark:to-[#0D241E] border-2 border-agri-primary/30 dark:border-[#21453A] shadow-card-subtle flex items-center justify-center text-agri-primary dark:text-[#27C58B] group-hover:scale-110 group-hover:border-agri-primary dark:group-hover:border-[#63DBAE] transition-all duration-300">
                      <IconComponent className="w-9 h-9 stroke-[2.1]" />
                    </div>

                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-agri-primary dark:bg-[#27C58B] text-white dark:text-[#071A16] text-xs font-black flex items-center justify-center shadow-md">
                      {stepItem.step}
                    </div>
                  </div>

                  {/* Step Title & Tag */}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-agri-teal dark:text-[#63DBAE] mb-1.5">
                    STEP {stepItem.step} • {stepItem.tag}
                  </span>

                  <h3 className="text-lg font-bold text-agri-textDark dark:text-[#F3FAF7] mb-2.5">
                    {stepItem.title}
                  </h3>

                  <p className="text-sm text-agri-textSecondary dark:text-[#A8C2B8] leading-relaxed max-w-xs font-normal">
                    {stepItem.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
