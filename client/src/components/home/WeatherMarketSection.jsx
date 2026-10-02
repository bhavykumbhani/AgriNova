import React from 'react';
import { useTranslation } from 'react-i18next';
import { WeatherDashboard } from '../weather/WeatherDashboard';
import { MarketPrices } from '../marketplace/MarketPrices';
import { SectionHeading } from '../common/SectionHeading';

export const WeatherMarketSection = () => {
  const { t } = useTranslation(['home']);

  return (
    <section className="py-16 sm:py-20 bg-agri-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeading
          badgeText={t('weather.badge', { defaultValue: 'AgriNova Real-Time Intelligence' })}
          title={t('weather.sectionTitle', { defaultValue: 'Agri-Weather & Mandi' })}
          highlightWord={t('weather.sectionHighlight', { defaultValue: 'Market Intelligence' })}
          subtitle={t('weather.sectionSubtitle', { defaultValue: 'Live GPS weather forecasts and verified mandi price benchmarks for optimal harvest planning.' })}
          align="center"
        />

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <WeatherDashboard />
          <MarketPrices />
        </div>

      </div>
    </section>
  );
};
