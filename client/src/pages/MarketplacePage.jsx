import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Sprout, 
  ArrowUpDown,
  Tag,
  Store
} from 'lucide-react';
import { motion } from 'motion/react';
import { PageHero } from '../components/common/PageHero';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { CTASection } from '../components/common/CTASection';
import { cardHoverProps } from '../utils/animations';

export const MarketplacePage = () => {
  const { t } = useTranslation(['marketplace', 'common']);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Currently in Phase 3, backend listings table will be populated by active registered farmers.
  // We provide a transparent development preview / empty state architecture as instructed.
  const [listings, setListings] = useState([]);

  const categories = [
    { id: 'all', label: t('categories.all', { defaultValue: 'All Crops' }) },
    { id: 'grains', label: t('categories.grains', { defaultValue: 'Grains & Cereals' }) },
    { id: 'vegetables', label: t('categories.vegetables', { defaultValue: 'Fresh Vegetables' }) },
    { id: 'fruits', label: t('categories.fruits', { defaultValue: 'Seasonal Fruits' }) },
    { id: 'pulses', label: t('categories.pulses', { defaultValue: 'Pulses & Lentils' }) },
    { id: 'oilseeds', label: t('categories.oilseeds', { defaultValue: 'Oilseeds' }) },
    { id: 'spices', label: t('categories.spices', { defaultValue: 'Spices & Condiments' }) },
    { id: 'cashCrops', label: t('categories.cashCrops', { defaultValue: 'Cash Crops' }) },
  ];

  const locations = [
    'All Locations',
    'Maharashtra',
    'Gujarat',
    'Madhya Pradesh',
    'Punjab',
    'Haryana',
    'Rajasthan',
    'Uttar Pradesh',
    'Karnataka',
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ search: searchTerm.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="pb-16">
      {/* Page Hero */}
      <PageHero
        badge={t('hero.badge', { defaultValue: 'AgriNova Marketplace' })}
        badgeIcon={Store}
        title={t('hero.title', { defaultValue: 'Agricultural Marketplace' })}
        subtitle={t('hero.subtitle', { defaultValue: 'Discover fresh agricultural produce directly from farmers and explore opportunities across local and regional markets.' })}
        breadcrumbs={[{ label: t('hero.title', { defaultValue: 'Marketplace' }), path: '/marketplace' }]}
      >
        {/* Search Bar in Hero */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mt-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search.placeholder', { defaultValue: 'Search crops, products or locations...' })}
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-agri-darkCard text-agri-textDark dark:text-agri-darkText border border-agri-border dark:border-agri-darkBorder shadow-sm focus:outline-none focus:ring-2 focus:ring-agri-primary text-sm transition-all"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 font-bold px-4 shadow-sm"
            >
              {t('actions.search', { defaultValue: 'Search' })}
            </Button>
          </div>
        </form>
      </PageHero>

      {/* Main Marketplace Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {/* Category Pills & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-agri-border dark:border-agri-darkBorder mb-8">
          {/* Scrollable Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
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

          {/* Location & Sort dropdowns */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Location Select */}
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                aria-label="Filter by Location"
                className="appearance-none pl-8 pr-8 py-2 rounded-xl bg-white dark:bg-agri-darkCard text-xs font-semibold text-agri-textDark dark:text-agri-darkText border border-agri-border dark:border-agri-darkBorder focus:outline-none focus:ring-2 focus:ring-agri-primary shadow-sm"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc.toLowerCase() === 'all locations' ? 'all' : loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort by"
                className="appearance-none pl-8 pr-8 py-2 rounded-xl bg-white dark:bg-agri-darkCard text-xs font-semibold text-agri-textDark dark:text-agri-darkText border border-agri-border dark:border-agri-darkBorder focus:outline-none focus:ring-2 focus:ring-agri-primary shadow-sm"
              >
                <option value="newest">{t('search.sortNewest', { defaultValue: 'Newest Harvest' })}</option>
                <option value="price-asc">{t('search.sortPriceAsc', { defaultValue: 'Price: Low to High' })}</option>
                <option value="price-desc">{t('search.sortPriceDesc', { defaultValue: 'Price: High to Low' })}</option>
                <option value="quantity">{t('search.sortQuantity', { defaultValue: 'Largest Quantity' })}</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Listings Grid or Production-Grade Empty State */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <motion.div
                key={item.id}
                {...cardHoverProps}
                className="bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder rounded-3xl p-5 shadow-card-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-agri-primary uppercase tracking-wide">
                      {item.category}
                    </span>
                    {item.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{t('card.verified', { defaultValue: 'Verified' })}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-agri-textDark dark:text-agri-darkText mb-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-agri-textSecondary dark:text-agri-darkTextSecondary mb-4">
                    <MapPin className="w-3.5 h-3.5 text-agri-primary" />
                    <span>{item.location}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-agri-border/60 dark:border-agri-darkBorder flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-gray-400">{t('card.expectedPrice', { defaultValue: 'Expected Price' })}</div>
                    <div className="text-base font-extrabold text-agri-textDark dark:text-agri-darkText">
                      ₹{item.price} <span className="text-xs font-normal text-gray-400">/{item.unit}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('card.viewDetails', { defaultValue: 'View Details' })}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Sprout}
            title={t('empty.title', { defaultValue: 'No listings available yet' })}
            message={t('empty.message', { defaultValue: 'Farmers are currently harvesting seasonal produce. Be the first verified grower to list your harvest lot on AgriNova.' })}
            actionLabel={t('empty.action', { defaultValue: 'Clear Filters' })}
            onAction={handleClearFilters}
            className="my-4"
          />
        )}

        {/* Dual Onboarding Action Cards (Part 4 specification) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 sm:mt-16">
          {/* Farmer Selling Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-white to-agri-softGreen/30 dark:from-agri-darkCard dark:via-agri-darkBgSecondary dark:to-agri-darkBg border border-emerald-200/80 dark:border-agri-darkBorder rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-agri-primary/10 dark:bg-agri-darkPrimary/10 flex items-center justify-center text-agri-primary dark:text-agri-darkPrimary mb-4">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-agri-textDark dark:text-agri-darkText mb-2">
                {t('cta.farmerTitle', { defaultValue: 'Are you a farmer? List your crops on AgriNova.' })}
              </h3>
              <p className="text-sm text-agri-textSecondary dark:text-agri-darkTextSecondary mb-6 leading-relaxed">
                {t('cta.farmerSubtitle', { defaultValue: 'Reach bulk institutional buyers, wholesalers, and food processors directly. Eliminate intermediary commissions.' })}
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/register/farmer')}
              className="w-full sm:w-auto font-bold shadow-md"
            >
              {t('cta.farmerBtn', { defaultValue: 'Start Selling' })}
            </Button>
          </div>

          {/* Buyer Purchasing Card */}
          <div className="bg-gradient-to-br from-blue-50/50 via-white to-agri-softBlue/30 dark:from-agri-darkCard dark:via-agri-darkBgSecondary dark:to-agri-darkBg border border-blue-200/60 dark:border-agri-darkBorder rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-agri-textDark dark:text-agri-darkText mb-2">
                {t('cta.buyerTitle', { defaultValue: 'Looking for agricultural produce?' })}
              </h3>
              <p className="text-sm text-agri-textSecondary dark:text-agri-darkTextSecondary mb-6 leading-relaxed">
                {t('cta.buyerSubtitle', { defaultValue: 'Create a buyer account to connect directly with verified growers, negotiate quantities, and schedule reliable logistics.' })}
              </p>
            </div>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/register/buyer')}
              className="w-full sm:w-auto font-bold border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              {t('cta.buyerBtn', { defaultValue: 'Register as Buyer' })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
