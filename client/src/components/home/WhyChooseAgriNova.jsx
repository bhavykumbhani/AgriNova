import React from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, BarChart3, ShieldCheck, Users } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';

export const WhyChooseAgriNova = () => {
  const { t } = useTranslation(['home']);

  const items = [
    {
      id: 'better-prices',
      title: t('whyChoose.card1Title', { defaultValue: 'Better Prices' }),
      badge: t('whyChoose.card1Badge', { defaultValue: 'Higher Margins' }),
      description: t('whyChoose.card1Desc', { defaultValue: 'Connect directly with more buyers and discover premium selling opportunities without middleman commissions.' }),
      icon: Leaf,
    },
    {
      id: 'data-driven',
      title: t('whyChoose.card2Title', { defaultValue: 'Data-Driven Decisions' }),
      badge: t('whyChoose.card2Badge', { defaultValue: 'Smart Intelligence' }),
      description: t('whyChoose.card2Desc', { defaultValue: 'Access hyperlocal weather forecasts, live mandi prices, and actionable agricultural insights for timely harvesting.' }),
      icon: BarChart3,
    },
    {
      id: 'direct-transparent',
      title: t('whyChoose.card3Title', { defaultValue: 'Direct & Transparent' }),
      badge: t('whyChoose.card3Badge', { defaultValue: 'Zero Hidden Fees' }),
      description: t('whyChoose.card3Desc', { defaultValue: 'Communicate openly between farmers and verified buyers with clear quality standards and price transparency.' }),
      icon: ShieldCheck,
    },
    {
      id: 'stronger-communities',
      title: t('whyChoose.card4Title', { defaultValue: 'Stronger Communities' }),
      badge: t('whyChoose.card4Badge', { defaultValue: 'Rural Empowerment' }),
      description: t('whyChoose.card4Desc', { defaultValue: 'Support sustainable farming ecosystems, empower rural entrepreneurship, and drive regional agricultural growth.' }),
      icon: Users,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-agri-bg dark:bg-[#0D241E] relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <SectionHeading
          badgeText={t('whyChoose.badge', { defaultValue: 'The AgriNova Advantage' })}
          title={t('whyChoose.title', { defaultValue: 'Why Choose' })}
          highlightWord={t('whyChoose.titleHighlight', { defaultValue: 'AgriNova?' })}
          subtitle={t('whyChoose.subtitle', { defaultValue: 'Empowering farmers, enabling better markets and supporting smarter agricultural decisions.' })}
          align="center"
        />

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card
                key={item.id}
                hoverEffect={true}
                className="flex flex-col justify-between p-6 sm:p-7 bg-white dark:bg-[#112D25] border border-agri-border dark:border-[#21453A] group"
              >
                <div>
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-agri-softGreen dark:bg-[#0D241E] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-agri-primary dark:text-[#27C58B]" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-agri-dark dark:text-[#63DBAE] bg-agri-softGreen/80 dark:bg-[#0D241E] px-2.5 py-1 rounded-full border border-agri-primary/20 dark:border-[#21453A]">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-agri-textDark dark:text-[#F3FAF7] mb-3 group-hover:text-agri-primary dark:group-hover:text-[#27C58B] transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-agri-textSecondary dark:text-[#A8C2B8] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#21453A] flex items-center justify-between text-xs font-semibold text-agri-primary dark:text-[#27C58B] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore features</span>
                  <span>→</span>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
};
