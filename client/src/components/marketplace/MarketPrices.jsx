import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  RefreshCw, 
  Info
} from 'lucide-react';
import { Card } from '../common/Card';
import { useMarketPrices } from '../../hooks/useMarketPrices';

export const MarketPrices = () => {
  const { t } = useTranslation(['home']);
  const navigate = useNavigate();
  const { prices, summary, loading, refreshPrices } = useMarketPrices();

  const renderCropIcon = (iconType) => {
    switch (iconType) {
      case 'wheat':
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg shadow-xs">
            🌾
          </div>
        );
      case 'rice':
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-xs">
            🍚
          </div>
        );
      case 'corn':
        return (
          <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-700 flex items-center justify-center font-bold text-lg shadow-xs">
            🌽
          </div>
        );
      case 'onion':
        return (
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg shadow-xs">
            🧅
          </div>
        );
      case 'tomato':
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg shadow-xs">
            🍅
          </div>
        );
      case 'soybean':
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center font-bold text-lg shadow-xs">
            🌱
          </div>
        );
    }
  };

  const renderSparkline = (points, isPositive) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const height = 24;
    const width = 64;

    const coordinates = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = isPositive ? '#23A455' : '#E74C3C';

    return (
      <svg width={width} height={height} className="shrink-0">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coordinates}
        />
      </svg>
    );
  };

  return (
    <Card className="h-full flex flex-col justify-between border-agri-border/80 dark:border-[#21453A] shadow-card-subtle bg-white dark:bg-[#112D25] transition-colors">
      <div>
        {/* Header with Market Price Preview */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-agri-primary dark:bg-[#27C58B]" />
              <h3 className="text-xl font-bold text-agri-textDark dark:text-[#F3FAF7]">
                {t('market.title', { defaultValue: 'Market Price Preview' })}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-[#0D241E] text-gray-600 dark:text-[#A8C2B8] px-2 py-0.5 rounded border border-gray-200 dark:border-[#21453A]">
                Sample APMC Benchmarks
              </span>
            </div>
            <p className="text-xs sm:text-sm text-agri-textSecondary dark:text-[#A8C2B8] mt-0.5">
              {t('market.subtitle', { defaultValue: 'Benchmark mandi price trends from key regional APMC centers.' })}
            </p>
          </div>

          <button
            onClick={refreshPrices}
            disabled={loading}
            className="p-2 text-agri-textSecondary hover:text-agri-primary hover:bg-agri-softGreen dark:hover:bg-[#0D241E] rounded-xl border border-gray-200 dark:border-[#21453A] transition-colors shrink-0"
            title="Refresh Prices"
            aria-label="Refresh Prices"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-agri-primary' : ''}`} />
          </button>
        </div>

        {/* Development Transparency Banner */}
        <div className="mb-4 p-2.5 rounded-xl bg-gray-50 dark:bg-[#0D241E] border border-gray-200 dark:border-[#21453A] flex items-center gap-2 text-[11px] text-gray-600 dark:text-[#A8C2B8]">
          <Info className="w-4 h-4 text-agri-primary dark:text-[#63DBAE] shrink-0" />
          <span>{t('market.sampleNotice', { defaultValue: 'Mandi benchmarks are reference prices compiled from regional APMC market reports during this phase.' })}</span>
        </div>

        {/* Crops Price List */}
        {loading && prices.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-agri-textSecondary dark:text-[#A8C2B8]">
            <RefreshCw className="w-8 h-8 text-agri-primary animate-spin mb-3" />
            <p className="text-sm font-medium">Loading mandi arrivals and quotes...</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {prices.slice(0, 5).map((crop) => (
              <div
                key={crop.id}
                onClick={() => navigate(`/marketplace?crop=${crop.name.toLowerCase()}`)}
                className="group flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-gray-100 dark:border-[#21453A] bg-[#F9FBFA] dark:bg-[#0D241E] hover:bg-white dark:hover:bg-[#112D25] hover:border-agri-primary/30 dark:hover:border-[#27C58B]/40 hover:shadow-sm transition-all duration-200 cursor-pointer"
              >
                {/* Left: Icon & Names */}
                <div className="flex items-center gap-3">
                  {renderCropIcon(crop.iconType)}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm sm:text-base font-bold text-agri-textDark group-hover:text-agri-primary transition-colors">
                        {crop.name}
                      </span>
                      <span className="text-[11px] text-gray-400 font-normal hidden sm:inline">
                        • {crop.mandi}
                      </span>
                    </div>
                    <div className="text-[11px] text-agri-textSecondary font-medium">
                      {crop.variety}
                    </div>
                  </div>
                </div>

                {/* Middle: Sparkline Chart */}
                <div className="hidden sm:block">
                  {renderSparkline(crop.sparkline, crop.isPositive)}
                </div>

                {/* Right: Price & Change */}
                <div className="text-right">
                  <div className="text-sm sm:text-base font-extrabold text-agri-textDark">
                    ₹{crop.price.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-agri-textSecondary">/ {crop.unit}</span>
                  </div>
                  <div
                    className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                      crop.isPositive ? 'text-agri-success' : 'text-agri-danger'
                    }`}
                  >
                    {crop.isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {crop.isPositive ? '↑' : '↓'} {Math.abs(crop.changePercent)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Link: View All Prices */}
      <div className="mt-5 pt-3.5 border-t border-agri-border/60 flex items-center justify-between">
        <span className="text-[11px] text-agri-textSecondary font-medium">
          {summary?.activeMandis || 148} {t('market.monitored', { defaultValue: 'Mandis Monitored Daily' })}
        </span>

        <button
          onClick={() => navigate('/marketplace')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-agri-primary hover:text-agri-dark transition-colors group"
        >
          <span>{t('market.viewAll', { defaultValue: 'View All Prices' })}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </Card>
  );
};
