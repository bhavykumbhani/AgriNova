import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { 
  Sprout, 
  Store, 
  CheckCircle2, 
  TrendingUp, 
  CloudSun, 
  ShieldCheck, 
  Cpu,
  Activity
} from 'lucide-react';
import { Button } from '../common/Button';
import heroFarmerImg from '../../assets/hero-farmer.jpg';

export const HeroSection = () => {
  const { t } = useTranslation(['home']);
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF6F0]/60 via-[#F7FAF9] to-[#F7FAF9] dark:from-[#0D241E] dark:via-[#071A16] dark:to-[#071A16] pt-8 sm:pt-14 pb-16 sm:pb-24 border-b border-agri-border/60 dark:border-[#21453A] transition-colors duration-200">
      {/* Subtle organic background patterns */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-agri-softGreen/50 dark:bg-emerald-950/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 -ml-20 w-80 h-80 rounded-full bg-agri-softBlue/40 dark:bg-teal-950/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-softGreen dark:bg-[#112D25] border border-agri-primary/20 dark:border-[#21453A] text-agri-dark dark:text-[#63DBAE] text-xs font-bold tracking-wider uppercase mb-6 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-agri-primary dark:bg-[#27C58B] animate-pulse" />
              <span>{t('hero.badge', { defaultValue: 'Sustainable Farms • Stronger Markets • Brighter Tomorrows' })}</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-agri-textDark dark:text-[#F3FAF7] tracking-tight leading-[1.12] mb-6"
            >
              {t('hero.title', { defaultValue: 'Smart Marketplace for' })}{' '}
              <span className="text-agri-primary dark:text-[#27C58B] block sm:inline">
                {t('hero.titleHighlight', { defaultValue: 'Farmers and Buyers' })}
              </span>
            </motion.h1>

            {/* Supporting Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="text-lg sm:text-xl text-agri-textSecondary dark:text-[#A8C2B8] leading-relaxed mb-8 max-w-2xl font-normal"
            >
              {t('hero.description', { defaultValue: 'Sell crops directly, discover trusted buyers, access market insights and make smarter agricultural decisions with real-time data.' })}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10"
            >
              <Button
                variant="primary"
                size="lg"
                icon={Sprout}
                onClick={() => navigate('/register/farmer')}
                className="shadow-lg shadow-agri-primary/20 dark:shadow-emerald-950/40 hover:shadow-xl text-base py-4 px-7 font-bold dark:bg-[#27C58B] dark:text-[#071A16] dark:hover:bg-[#63DBAE]"
              >
                {t('hero.sellCrops', { defaultValue: 'Sell Crops' })}
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={Store}
                onClick={() => navigate('/marketplace')}
                className="bg-white/80 dark:bg-[#112D25]/90 backdrop-blur-sm border-2 border-agri-primary dark:border-[#27C58B] text-agri-primary dark:text-[#27C58B] hover:bg-agri-softGreen dark:hover:bg-[#0D241E] text-base py-4 px-7 font-bold shadow-sm"
              >
                {t('hero.findCrops', { defaultValue: 'Find Crops' })}
              </Button>
            </motion.div>

            {/* Under the buttons: Four compact feature indicators */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full pt-6 border-t border-agri-border dark:border-[#21453A]"
            >
              {[
                { label: t('hero.feature1', { defaultValue: 'Direct Farmer-to-Buyer' }), icon: CheckCircle2 },
                { label: t('hero.feature2', { defaultValue: 'Real-Time Market Prices' }), icon: TrendingUp },
                { label: t('hero.feature3', { defaultValue: 'Weather & Crop Advisories' }), icon: CloudSun },
                { label: t('hero.feature4', { defaultValue: 'Trusted & Secure Platform' }), icon: ShieldCheck },
              ].map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.55 + idx * 0.08 }}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-agri-softGreen dark:bg-[#0D241E] flex items-center justify-center shrink-0">
                      <IconComponent className="w-4 h-4 text-agri-primary dark:text-[#63DBAE]" />
                    </div>
                    <span className="text-xs sm:text-[13px] font-semibold text-agri-textDark dark:text-[#F3FAF7] leading-tight">
                      {feature.label}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column: Hero Visual with Tech-Agriculture Overlays */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#21453A] bg-agri-softGreen/30 dark:bg-[#112D25] aspect-[4/3] sm:aspect-[4/3.2] object-cover">
                <img
                  src={heroFarmerImg}
                  alt="Indian progressive farmer using modern digital tablet in lush agricultural field"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
                
                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-agri-textDark/40 dark:from-[#071A16]/60 via-transparent to-transparent pointer-events-none" />

                {/* IoT Drone / Sensor Status Pill */}
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#112D25]/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-agri-border dark:border-[#21453A] flex items-center gap-2 text-xs font-bold text-agri-textDark dark:text-[#F3FAF7]">
                  <span className="w-2 h-2 rounded-full bg-agri-success dark:bg-[#27C58B] animate-ping" />
                  <Cpu className="w-3.5 h-3.5 text-agri-primary dark:text-[#63DBAE]" />
                  <span>{t('hero.telemetry', { defaultValue: 'Smart Farm Telemetry Active' })}</span>
                </div>
              </div>

              {/* Floating Dashboard Overlay 1: Crop Health */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -top-5 -right-4 sm:-right-6 bg-white/95 dark:bg-[#112D25]/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-card-hover border border-agri-border dark:border-[#21453A] animate-float-slow hidden sm:flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-agri-softGreen dark:bg-[#0D241E] flex items-center justify-center text-agri-primary dark:text-[#63DBAE] shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-agri-textSecondary dark:text-[#A8C2B8]">
                    {t('hero.cropHealth', { defaultValue: 'Crop Health' })}
                  </div>
                  <div className="text-sm font-bold text-agri-success dark:text-[#27C58B] flex items-center gap-1">
                    <span>{t('hero.cropHealthStatus', { defaultValue: 'Good' })}</span>
                    <span className="text-[11px] bg-emerald-50 dark:bg-[#0D241E] text-agri-success dark:text-[#63DBAE] px-1.5 py-0.5 rounded font-semibold">
                      {t('hero.cropHealthIndex', { defaultValue: '98% Index' })}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Dashboard Overlay 2: Estimated Yield */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.72 }}
                className="absolute top-1/2 -left-4 sm:-left-8 -translate-y-1/2 bg-white/95 dark:bg-[#112D25]/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-card-hover border border-agri-border dark:border-[#21453A] animate-float-delayed flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#0D241E] text-agri-dark dark:text-[#63DBAE] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-agri-primary dark:text-[#27C58B]" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-agri-textSecondary dark:text-[#A8C2B8]">
                    {t('hero.estimatedYield', { defaultValue: 'Estimated Yield' })}
                  </div>
                  <div className="text-base font-extrabold text-agri-primary dark:text-[#27C58B]">
                    {t('hero.yieldValue', { defaultValue: '+18% vs avg' })}
                  </div>
                </div>
              </motion.div>

              {/* Floating Dashboard Overlay 3: Field Insight */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.84 }}
                className="absolute -bottom-5 -right-3 sm:-right-4 bg-white/95 dark:bg-[#112D25]/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-card-hover border border-agri-border dark:border-[#21453A] hidden sm:flex items-center gap-3 z-20"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-agri-orange flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-agri-textSecondary dark:text-[#A8C2B8]">
                    {t('hero.fieldInsight', { defaultValue: 'Field Insight' })}
                  </div>
                  <div className="text-xs font-bold text-agri-textDark dark:text-[#F3FAF7]">
                    {t('hero.fieldInsightText', { defaultValue: 'Healthy crop conditions' })}
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
