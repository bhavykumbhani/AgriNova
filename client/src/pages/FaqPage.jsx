import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Search } from 'lucide-react';
import { PageHero } from '../components/common/PageHero';
import { FAQAccordion } from '../components/common/FAQAccordion';
import { CTASection } from '../components/common/CTASection';

export const FaqPage = () => {
  const { t } = useTranslation(['faq', 'common']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: t('categories.all', { defaultValue: 'All Questions' }) },
    { id: 'general', label: t('categories.general', { defaultValue: 'Getting Started' }) },
    { id: 'farmer', label: t('categories.farmer', { defaultValue: 'Farmer Accounts' }) },
    { id: 'buyer', label: t('categories.buyer', { defaultValue: 'Buyer Accounts' }) },
    { id: 'marketplace', label: t('categories.marketplace', { defaultValue: 'Marketplace' }) },
    { id: 'pricing', label: t('categories.pricing', { defaultValue: 'Pricing & Payments' }) },
    { id: 'weather', label: t('categories.weather', { defaultValue: 'Weather & Market Data' }) },
    { id: 'security', label: t('categories.security', { defaultValue: 'Privacy & Security' }) },
    { id: 'support', label: t('categories.support', { defaultValue: 'Support & Help' }) },
  ];

  const items = t('items', { returnObjects: true }) || [];

  const filteredItems = Array.isArray(items)
    ? items.filter((item) => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        if (!searchQuery.trim()) return matchesCategory;
        const q = searchQuery.toLowerCase();
        return (
          matchesCategory &&
          (item.question?.toLowerCase().includes(q) || item.answer?.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div className="pb-16">
      {/* Hero */}
      <PageHero
        badge={t('hero.badge', { defaultValue: 'Common Questions' })}
        badgeIcon={HelpCircle}
        title={t('hero.title', { defaultValue: 'Frequently Asked Questions' })}
        subtitle={t('hero.subtitle', { defaultValue: "Find answers to common questions about AgriNova's marketplace, weather telemetry, accounts, and policies." })}
        breadcrumbs={[{ label: t('hero.title', { defaultValue: 'FAQ' }), path: '/faq' }]}
      >
        {/* Search bar */}
        <div className="relative max-w-xl mt-4">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-agri-darkCard text-agri-textDark dark:text-agri-darkText border border-agri-border dark:border-agri-darkBorder shadow-sm focus:outline-none focus:ring-2 focus:ring-agri-primary text-sm transition-all"
          />
        </div>
      </PageHero>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-agri-primary text-white border-agri-primary shadow-sm'
                  : 'bg-white dark:bg-agri-darkCard text-agri-textSecondary dark:text-agri-darkTextSecondary border-agri-border dark:border-agri-darkBorder hover:border-agri-primary/40 hover:text-agri-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        {filteredItems.length > 0 ? (
          <FAQAccordion items={filteredItems} defaultOpenIndex={0} />
        ) : (
          <div className="text-center py-12 bg-white dark:bg-agri-darkCard border border-dashed border-agri-border dark:border-agri-darkBorder rounded-3xl p-6">
            <p className="text-sm text-agri-textSecondary dark:text-agri-darkTextSecondary">
              No questions found matching your search. Please try a different query or contact our support team.
            </p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <CTASection
        badge="Direct Assistance"
        title={t('cta.title', { defaultValue: 'Still have questions?' })}
        subtitle={t('cta.subtitle', { defaultValue: "Can't find the answer you're looking for? Reach out directly to our customer support team." })}
        primaryAction={{ label: t('cta.btn', { defaultValue: 'Contact Support' }), path: '/contact' }}
        secondaryAction={{ label: 'Explore Support Hub', path: '/support' }}
        className="mt-16"
      />
    </div>
  );
};
