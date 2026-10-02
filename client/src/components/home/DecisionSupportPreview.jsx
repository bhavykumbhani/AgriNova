import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CloudSun, 
  TrendingUp, 
  Target, 
  Sparkles, 
  PieChart, 
  Cpu
} from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { DECISION_SUPPORT_ITEMS } from '../../constants/navigation';

export const DecisionSupportPreview = () => {
  const { t } = useTranslation(['home']);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'CloudSun':
        return <CloudSun className="w-5 h-5 text-agri-teal" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-agri-primary" />;
      case 'Target':
        return <Target className="w-5 h-5 text-agri-orange" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case 'PieChart':
      default:
        return <PieChart className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-agri-bg to-[#EEF5F1] dark:from-[#071A16] dark:to-[#0D241E] relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <SectionHeading
          badgeText={t('decisionSupport.badge', { defaultValue: 'Smart Decision Engine' })}
          title={t('decisionSupport.title', { defaultValue: 'Smarter Decisions for' })}
          highlightWord={t('decisionSupport.titleHighlight', { defaultValue: 'Better Farming' })}
          subtitle={t('decisionSupport.subtitle', { defaultValue: 'Explore the upcoming intelligence modules designed to transform raw field telemetry and market fluctuations into actionable profits.' })}
          align="center"
        />

        {/* 5 Intelligent Capability Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DECISION_SUPPORT_ITEMS.map((item) => (
            <Card
              key={item.id}
              hoverEffect={true}
              className="p-6 bg-white dark:bg-[#112D25] border border-agri-border dark:border-[#21453A] flex flex-col justify-between"
            >
              <div>
                {/* Top Icon & Status Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-agri-softGreen dark:bg-[#0D241E] flex items-center justify-center">
                    {getIcon(item.icon)}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    item.status === 'Active Preview'
                      ? 'bg-emerald-50 dark:bg-[#0D241E] text-agri-dark dark:text-[#63DBAE] border-emerald-200 dark:border-[#21453A]'
                      : 'bg-gray-100 dark:bg-[#0D241E] text-gray-600 dark:text-[#A8C2B8] border-gray-200 dark:border-[#21453A]'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-lg font-bold text-agri-textDark dark:text-[#F3FAF7] mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-agri-textSecondary dark:text-[#A8C2B8] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Architecture Preview Indicator */}
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-[#21453A] flex items-center gap-2 text-xs font-semibold text-agri-dark dark:text-[#63DBAE]">
                <Cpu className="w-3.5 h-3.5 text-agri-primary dark:text-[#27C58B]" />
                <span>Decision Support Pipeline</span>
              </div>
            </Card>
          ))}

          {/* Special Preview Card: Real-time Advisory Feed */}
          <div className="bg-gradient-to-br from-agri-textDark to-[#1B355A] dark:from-[#112D25] dark:to-[#0D241E] border dark:border-[#21453A] rounded-card p-6 text-white flex flex-col justify-between shadow-card-subtle">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 dark:bg-emerald-950/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/10 dark:border-[#21453A]">
                <Sparkles className="w-3 h-3" />
                Next Generation Agri-AI
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Hyperlocal Advisory Model
              </h3>
              <p className="text-xs text-gray-300 dark:text-[#A8C2B8] leading-relaxed">
                Combining satellite weather forecasts, APMC arrival volumes, and soil moisture sensors to suggest optimum harvest days.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 dark:border-[#21453A] flex items-center justify-between text-xs text-emerald-400 dark:text-[#27C58B] font-semibold">
              <span>Roadmap 2026</span>
              <span>Supabase AI Ready →</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
