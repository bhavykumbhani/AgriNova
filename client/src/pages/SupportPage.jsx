import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  Search, 
  FileText, 
  Mail, 
  Sprout, 
  ArrowRight,
  BookOpen,
  UserCheck,
  Building,
  KeyRound,
  Store,
  CloudSun,
  Shield,
  Wrench
} from 'lucide-react';
import { PageHero } from '../components/common/PageHero';
import { SectionHeading } from '../components/common/SectionHeading';
import { CTASection } from '../components/common/CTASection';
import { cardHoverProps } from '../utils/animations';
import { motion } from 'motion/react';

export const SupportPage = () => {
  const { t } = useTranslation(['support', 'common']);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const iconMap = {
    'getting-started': BookOpen,
    'farmer-reg': UserCheck,
    'buyer-reg': Building,
    'account-login': KeyRound,
    'marketplace': Store,
    'crop-listings': Sprout,
    'weather-market': CloudSun,
    'privacy-security': Shield,
    'technical-issues': Wrench,
  };

  const categories = t('categories', { returnObjects: true }) || [];

  const filteredCategories = Array.isArray(categories)
    ? categories.filter((cat) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          cat.title?.toLowerCase().includes(q) ||
          cat.desc?.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="pb-16">
      {/* Hero */}
      <PageHero
        badge={t('hero.badge', { defaultValue: 'Help & Resources' })}
        badgeIcon={HelpCircle}
        title={t('hero.title', { defaultValue: 'AgriNova Support' })}
        subtitle={t('hero.subtitle', { defaultValue: 'Need help? Find answers, explore guides or contact the AgriNova support team.' })}
        breadcrumbs={[{ label: t('hero.title', { defaultValue: 'Support' }), path: '/support' }]}
      >
        {/* Support Search Input */}
        <div className="relative max-w-xl mt-4">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search.placeholder', { defaultValue: 'Search support topics...' })}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-agri-darkCard text-agri-textDark dark:text-agri-darkText border border-agri-border dark:border-agri-darkBorder shadow-sm focus:outline-none focus:ring-2 focus:ring-agri-primary text-sm transition-all"
          />
        </div>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-16">
        {/* Quick Links Row (FAQ, Contact, Farming Tips) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/faq"
            className="bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder rounded-3xl p-6 shadow-card-subtle hover:border-agri-primary/50 transition-all group flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-2xl bg-agri-softGreen dark:bg-agri-darkBgSecondary flex items-center justify-center text-agri-primary shrink-0 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-agri-textDark dark:text-agri-darkText group-hover:text-agri-primary transition-colors flex items-center gap-1.5 mb-1">
                <span>{t('quickLinks.faq', { defaultValue: 'Frequently Asked Questions' })}</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-xs text-agri-textSecondary dark:text-agri-darkTextSecondary leading-relaxed">
                {t('quickLinks.faqDesc', { defaultValue: 'Common inquiries regarding payments, trading, and platform policies.' })}
              </p>
            </div>
          </Link>

          <Link
            to="/contact"
            className="bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder rounded-3xl p-6 shadow-card-subtle hover:border-agri-primary/50 transition-all group flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-agri-darkBgSecondary flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-agri-textDark dark:text-agri-darkText group-hover:text-agri-primary transition-colors flex items-center gap-1.5 mb-1">
                <span>{t('quickLinks.contact', { defaultValue: 'Contact Support Team' })}</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-xs text-agri-textSecondary dark:text-agri-darkTextSecondary leading-relaxed">
                {t('quickLinks.contactDesc', { defaultValue: 'Send a direct message to our support and customer service desk.' })}
              </p>
            </div>
          </Link>

          <Link
            to="/farming-tips"
            className="bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder rounded-3xl p-6 shadow-card-subtle hover:border-agri-primary/50 transition-all group flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-agri-darkBgSecondary flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-agri-textDark dark:text-agri-darkText group-hover:text-agri-primary transition-colors flex items-center gap-1.5 mb-1">
                <span>{t('quickLinks.tips', { defaultValue: 'Farming Tips & Guides' })}</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-xs text-agri-textSecondary dark:text-agri-darkTextSecondary leading-relaxed">
                {t('quickLinks.tipsDesc', { defaultValue: 'Practical agronomic resources for harvest planning and post-harvest care.' })}
              </p>
            </div>
          </Link>
        </div>

        {/* Support Category Cards Grid */}
        <div>
          <SectionHeading
            badge="Browse by Category"
            badgeIcon={BookOpen}
            title="Explore Help Topics"
            subtitle="Select a category below to find guided assistance for your account or farming operations."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => {
              const IconComp = iconMap[cat.id] || HelpCircle;

              return (
                <motion.div
                  key={cat.id}
                  {...cardHoverProps}
                  onClick={() => navigate('/faq')}
                  className="cursor-pointer bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder rounded-3xl p-6 shadow-card-subtle hover:border-agri-primary/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-agri-softGreen dark:bg-agri-darkBgSecondary text-agri-primary dark:text-agri-darkPrimary flex items-center justify-center mb-4">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-agri-textDark dark:text-agri-darkText mb-2">
                      {cat.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-agri-textSecondary dark:text-agri-darkTextSecondary leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-agri-border/50 dark:border-agri-darkBorder/50 flex items-center text-xs font-semibold text-agri-primary dark:text-agri-darkPrimary">
                    <span>Explore Questions</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <CTASection
        badge="Contact Desk"
        title={t('cta.title', { defaultValue: 'Still need help?' })}
        subtitle={t('cta.subtitle', { defaultValue: 'Our dedicated support team is available to assist farmers, merchants, and agribusinesses.' })}
        primaryAction={{ label: t('cta.btn', { defaultValue: 'Contact Support' }), path: '/contact' }}
        secondaryAction={{ label: 'View All FAQs', path: '/faq' }}
        className="mt-16"
      />
    </div>
  );
};
