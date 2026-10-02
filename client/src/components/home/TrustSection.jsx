import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserCheck, Lock, Eye, Shield, Headphones } from 'lucide-react';

export const TrustSection = () => {
  const { t } = useTranslation(['home']);

  const items = [
    {
      title: t('trust.item1Title', { defaultValue: 'Verified Users' }),
      description: t('trust.item1Desc', { defaultValue: 'Designed for verified farmer and buyer accounts with identity validation.' }),
      icon: UserCheck,
    },
    {
      title: t('trust.item2Title', { defaultValue: 'Secure Platform' }),
      description: t('trust.item2Desc', { defaultValue: 'End-to-end data encryption and protected negotiation channels.' }),
      icon: Lock,
    },
    {
      title: t('trust.item3Title', { defaultValue: 'Transparent Marketplace' }),
      description: t('trust.item3Desc', { defaultValue: 'Clear pricing, verified produce grading, and open market records.' }),
      icon: Eye,
    },
    {
      title: t('trust.item4Title', { defaultValue: 'Data Privacy' }),
      description: t('trust.item4Desc', { defaultValue: 'Strict adherence to user data protection standards without third-party sharing.' }),
      icon: Shield,
    },
    {
      title: t('trust.item5Title', { defaultValue: 'Community Support' }),
      description: t('trust.item5Desc', { defaultValue: 'Dedicated assistance in regional Indian languages for farmers and buyers.' }),
      icon: Headphones,
    },
  ];

  return (
    <section className="py-14 sm:py-16 bg-white dark:bg-[#071A16] border-t border-agri-border/60 dark:border-[#21453A] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact trust header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-agri-teal dark:text-[#63DBAE]">
            {t('trust.badge', { defaultValue: 'Trust & Platform Integrity' })}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-agri-textDark dark:text-[#F3FAF7] mt-1">
            {t('trust.title', { defaultValue: 'Built on Transparency, Security and Farmer Respect' })}
          </h2>
        </div>

        {/* 5 Compact Trust Items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {items.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-agri-bg dark:hover:bg-[#112D25] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-agri-softGreen/80 dark:bg-[#0D241E] flex items-center justify-center mb-3">
                  <IconComponent className="w-5 h-5 text-agri-primary dark:text-[#27C58B]" />
                </div>
                <h3 className="text-sm font-bold text-agri-textDark dark:text-[#F3FAF7] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-agri-textSecondary dark:text-[#A8C2B8] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
