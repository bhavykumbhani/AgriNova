import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  FileSpreadsheet, 
  MessageSquare, 
  Handshake, 
  Truck, 
  Building2, 
  Search, 
  ShoppingBag,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { PageHero } from '../components/common/PageHero';
import { Button } from '../components/common/Button';
import { CTASection } from '../components/common/CTASection';
import { AnimatedSection } from '../components/common/AnimatedSection';

export const HowItWorksPage = () => {
  const { t } = useTranslation(['howItWorks', 'common']);
  const [activeTab, setActiveTab] = useState('farmer'); // 'farmer' | 'buyer'
  const navigate = useNavigate();

  const farmerIcons = [
    CheckCircle2,
    MapPin,
    FileSpreadsheet,
    MessageSquare,
    Handshake,
    Truck,
  ];

  const buyerIcons = [
    CheckCircle2,
    Building2,
    Search,
    FileSpreadsheet,
    MessageSquare,
    ShoppingBag,
  ];

  const farmerSteps = t('farmerSteps', { returnObjects: true }) || [];
  const buyerSteps = t('buyerSteps', { returnObjects: true }) || [];

  const currentSteps = activeTab === 'farmer' ? farmerSteps : buyerSteps;
  const currentIcons = activeTab === 'farmer' ? farmerIcons : buyerIcons;

  return (
    <div className="pb-16">
      {/* Page Hero */}
      <PageHero
        badge={t('hero.badge', { defaultValue: 'Simple & Transparent' })}
        badgeIcon={Sparkles}
        title={t('hero.title', { defaultValue: 'How AgriNova Works' })}
        subtitle={t('hero.subtitle', { defaultValue: 'From farm to market, AgriNova creates a simple and transparent way for farmers and buyers to connect.' })}
        breadcrumbs={[{ label: t('hero.title', { defaultValue: 'How It Works' }), path: '/how-it-works' }]}
      >
        {/* Journey Switcher Tabs */}
        <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder shadow-sm mt-4">
          <button
            type="button"
            onClick={() => setActiveTab('farmer')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'farmer'
                ? 'bg-agri-primary text-white shadow-md'
                : 'text-agri-textSecondary dark:text-agri-darkTextSecondary hover:text-agri-textDark dark:hover:text-white'
            }`}
          >
            {t('tabs.farmer', { defaultValue: 'For Farmers' })}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('buyer')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'buyer'
                ? 'bg-agri-primary text-white shadow-md'
                : 'text-agri-textSecondary dark:text-agri-darkTextSecondary hover:text-agri-textDark dark:hover:text-white'
            }`}
          >
            {t('tabs.buyer', { defaultValue: 'For Buyers' })}
          </button>
        </div>
      </PageHero>

      {/* Visual Timeline Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="relative">
          {/* Central Connecting Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-agri-primary via-agri-teal to-emerald-200 dark:to-agri-darkBorder -translate-x-1/2" />

          <div className="space-y-8 sm:space-y-12">
            {Array.isArray(currentSteps) && currentSteps.map((step, idx) => {
              const IconComponent = currentIcons[idx] || CheckCircle2;
              const isEven = idx % 2 === 0;

              return (
                <AnimatedSection
                  key={idx}
                  direction={isEven ? 'left' : 'right'}
                  className="relative flex flex-col md:flex-row items-center"
                >
                  {/* Step Card: alternates left and right on desktop */}
                  <div className={`w-full md:w-[45%] ${isEven ? 'md:pr-8 md:text-right' : 'md:pl-8 md:order-2 md:text-left'}`}>
                    <div className="bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder rounded-3xl p-6 sm:p-7 shadow-card-subtle hover:shadow-card-hover transition-all">
                      <div className={`flex items-center gap-2 mb-2 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                        <span className="text-xs font-bold uppercase tracking-wider text-agri-primary dark:text-agri-darkPrimary bg-agri-softGreen dark:bg-agri-darkBgSecondary px-2.5 py-0.5 rounded-full">
                          {step.tag || `Step ${idx + 1}`}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-agri-textDark dark:text-agri-darkText mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-agri-textSecondary dark:text-agri-darkTextSecondary leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Node Badge */}
                  <div className="shrink-0 my-3 md:my-0 md:order-1 relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-agri-primary to-agri-dark text-white flex items-center justify-center font-extrabold text-base shadow-md border-4 border-white dark:border-agri-darkBg">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>

                  {/* Empty Spacer on opposite side */}
                  <div className={`hidden md:block md:w-[45%] ${isEven ? 'md:order-2' : 'md:order-1'}`} />
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <CTASection
        badge="Direct Trade Network"
        title={
          activeTab === 'farmer'
            ? 'Ready to Sell Produce at Direct Market Prices?'
            : 'Ready to Source Fresh Crops Directly from Farmers?'
        }
        subtitle={
          activeTab === 'farmer'
            ? 'Create your verified farmer profile, set up your farm location, and receive direct buyer inquiries.'
            : 'Discover lot availability, connect with verified growers, and eliminate traditional middleman commissions.'
        }
        primaryAction={{
          label: activeTab === 'farmer' ? 'Register as Farmer' : 'Register as Buyer',
          path: activeTab === 'farmer' ? '/register/farmer' : '/register/buyer',
        }}
        secondaryAction={{
          label: 'Explore Marketplace',
          path: '/marketplace',
        }}
        className="mt-12 sm:mt-16"
      />
    </div>
  );
};
