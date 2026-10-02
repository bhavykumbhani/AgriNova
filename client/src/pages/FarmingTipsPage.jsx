import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sprout, 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  BookOpen,
  Wheat,
  Droplets,
  Layers,
  CloudRain
} from 'lucide-react';
import { motion } from 'motion/react';
import { PageHero } from '../components/common/PageHero';
import { CTASection } from '../components/common/CTASection';
import { cardHoverProps } from '../utils/animations';

export const FarmingTipsPage = () => {
  const { t } = useTranslation(['farmingTips', 'common']);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: t('categories.all', { defaultValue: 'All Tips & Guides' }) },
    { id: 'market', label: t('categories.market', { defaultValue: 'Market Preparation' }) },
    { id: 'postHarvest', label: t('categories.postHarvest', { defaultValue: 'Post-Harvest Care' }) },
    { id: 'soil', label: t('categories.soil', { defaultValue: 'Soil Health' }) },
    { id: 'weather', label: t('categories.weather', { defaultValue: 'Weather Preparedness' }) },
    { id: 'irrigation', label: t('categories.irrigation', { defaultValue: 'Smart Irrigation' }) },
    { id: 'storage', label: t('categories.storage', { defaultValue: 'Crop Storage' }) },
  ];

  const articles = t('articles', { returnObjects: true }) || [];

  const filteredArticles = Array.isArray(articles)
    ? articles.filter((a) => selectedCategory === 'all' || a.category === selectedCategory)
    : [];

  return (
    <div className="pb-16">
      {/* Hero */}
      <PageHero
        badge={t('hero.badge', { defaultValue: 'Agronomic Knowledge Hub' })}
        badgeIcon={BookOpen}
        title={t('hero.title', { defaultValue: 'Farming Tips & Resources' })}
        subtitle={t('hero.subtitle', { defaultValue: 'Practical agricultural information to support smarter everyday farming decisions, crop protection, and post-harvest value.' })}
        breadcrumbs={[{ label: t('hero.title', { defaultValue: 'Farming Tips' }), path: '/farming-tips' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-12">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-agri-border dark:border-agri-darkBorder">
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

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <motion.div
              key={article.id}
              {...cardHoverProps}
              className="bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder rounded-3xl p-6 sm:p-7 shadow-card-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-agri-primary dark:text-agri-darkPrimary bg-agri-softGreen dark:bg-agri-darkBgSecondary px-2.5 py-0.5 rounded-full">
                    {t(`categories.${article.category}`, { defaultValue: 'Agronomy' })}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-agri-textDark dark:text-agri-darkText mb-2 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-agri-textSecondary dark:text-agri-darkTextSecondary leading-relaxed mb-6">
                  {article.summary}
                </p>
              </div>

              <div>
                {/* Tags */}
                {Array.isArray(article.tags) && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {article.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-medium bg-gray-100 dark:bg-agri-darkBgSecondary text-agri-textSecondary dark:text-agri-darkTextSecondary px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-agri-border/50 dark:border-agri-darkBorder/50 flex items-center justify-between text-xs font-semibold text-agri-primary dark:text-agri-darkPrimary">
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer Notice */}
        <div className="rounded-2xl p-4 sm:p-5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <p className="leading-relaxed">
            {t('disclaimer', { defaultValue: 'The agronomic advice provided above represents general educational guidance. Farmers should consult local Krishi Vigyan Kendras (KVK) or certified agricultural extension officers for region-specific agronomic prescriptions.' })}
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <CTASection
        badge="Direct Marketplace"
        title="Ready to List Your Quality Harvest?"
        subtitle="Turn better farming practices into higher profit margins by selling directly to verified commercial buyers."
        primaryAction={{ label: 'Start Selling', path: '/register/farmer' }}
        secondaryAction={{ label: 'Explore Marketplace', path: '/marketplace' }}
        className="mt-16"
      />
    </div>
  );
};
