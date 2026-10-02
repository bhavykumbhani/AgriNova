import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Building, 
  Target, 
  Compass, 
  Layers, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  HeartHandshake,
  Sprout
} from 'lucide-react';
import { PageHero } from '../components/common/PageHero';
import { SectionHeading } from '../components/common/SectionHeading';
import { AnimatedSection } from '../components/common/AnimatedSection';
import { CTASection } from '../components/common/CTASection';

export const AboutPage = () => {
  const { t } = useTranslation(['about', 'common']);

  const combinesList = t('combines.items', { returnObjects: true }) || [];
  const stakeholders = t('whoWeServe.items', { returnObjects: true }) || [];
  const principles = t('principles.items', { returnObjects: true }) || [];

  return (
    <div className="pb-16">
      {/* Hero */}
      <PageHero
        badge={t('hero.badge', { defaultValue: 'Our Brand Story' })}
        badgeIcon={Building}
        title={t('hero.title', { defaultValue: 'Building Better Connections Between Farms and Markets' })}
        subtitle={t('hero.subtitle', { defaultValue: 'AgriNova is a Smart Agriculture Marketplace and Decision Support System designed to connect farmers with buyers while providing tools that help agricultural communities make better-informed decisions.' })}
        breadcrumbs={[{ label: t('hero.title', { defaultValue: 'About Us' }), path: '/about' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-16 sm:space-y-24">
        {/* Our Story Section */}
        <AnimatedSection direction="up" className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder rounded-3xl p-8 sm:p-12 shadow-card-subtle relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-agri-softGreen/50 dark:bg-agri-darkBgSecondary/60 rounded-full blur-2xl pointer-events-none" />
            <SectionHeading
              badge="Foundational Purpose"
              badgeIcon={Sprout}
              title={t('story.title', { defaultValue: 'Our Story' })}
              className="mb-6"
            />
            <div className="space-y-4 text-base sm:text-lg text-agri-textSecondary dark:text-agri-darkTextSecondary leading-relaxed">
              <p>{t('story.p1')}</p>
              <p>{t('story.p2')}</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Mission & Vision Side-by-Side */}
        <div id="mission" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <AnimatedSection direction="left">
            <div className="h-full bg-gradient-to-br from-emerald-50/80 via-white to-agri-softGreen/20 dark:from-agri-darkCard dark:via-agri-darkBgSecondary dark:to-agri-darkBg border border-emerald-200/70 dark:border-agri-darkBorder rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-agri-primary text-white flex items-center justify-center mb-6 shadow-sm">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-agri-textDark dark:text-agri-darkText mb-3">
                  {t('mission.title', { defaultValue: 'Our Mission' })}
                </h3>
                <p className="text-base text-agri-textSecondary dark:text-agri-darkTextSecondary leading-relaxed">
                  {t('mission.description')}
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Vision */}
          <AnimatedSection direction="right">
            <div className="h-full bg-gradient-to-br from-teal-50/80 via-white to-agri-softBlue/20 dark:from-agri-darkCard dark:via-agri-darkBgSecondary dark:to-agri-darkBg border border-teal-200/70 dark:border-agri-darkBorder rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-agri-teal text-white flex items-center justify-center mb-6 shadow-sm">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-agri-textDark dark:text-agri-darkText mb-3">
                  {t('vision.title', { defaultValue: 'Our Vision' })}
                </h3>
                <p className="text-base text-agri-textSecondary dark:text-agri-darkTextSecondary leading-relaxed">
                  {t('vision.description')}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* What AgriNova Combines */}
        <div>
          <SectionHeading
            badge="Unified Platform"
            badgeIcon={Layers}
            title={t('combines.title', { defaultValue: 'What AgriNova Combines' })}
            subtitle={t('combines.subtitle', { defaultValue: 'An integrated digital infrastructure designed specifically for Indian agriculture.' })}
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(combinesList) && combinesList.map((item, idx) => (
              <AnimatedSection key={idx} delay={0.05 * idx} direction="up">
                <div className="h-full bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder rounded-3xl p-6 shadow-card-subtle hover:border-agri-primary/50 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-agri-softGreen dark:bg-agri-darkBgSecondary text-agri-primary dark:text-agri-darkPrimary flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-agri-textDark dark:text-agri-darkText mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-agri-textSecondary dark:text-agri-darkTextSecondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Who We Serve */}
        <div>
          <SectionHeading
            badge="Ecosystem"
            badgeIcon={Users}
            title={t('whoWeServe.title', { defaultValue: 'Who We Serve' })}
            subtitle={t('whoWeServe.subtitle', { defaultValue: 'Connecting every essential stakeholder across the agricultural supply chain.' })}
            centered
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.isArray(stakeholders) && stakeholders.map((stakeholder, idx) => (
              <AnimatedSection key={idx} delay={0.04 * idx} direction="up">
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder text-center shadow-sm">
                  <div className="text-xs sm:text-sm font-bold text-agri-textDark dark:text-agri-darkText">
                    {stakeholder}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Our Principles */}
        <div>
          <SectionHeading
            badge="Core Values"
            badgeIcon={ShieldCheck}
            title={t('principles.title', { defaultValue: 'Our Core Principles' })}
            subtitle={t('principles.subtitle', { defaultValue: 'The foundational commitments guiding our technology and platform design.' })}
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(principles) && principles.map((item, idx) => (
              <AnimatedSection key={idx} delay={0.05 * idx} direction="up">
                <div className="h-full bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder rounded-3xl p-6 shadow-card-subtle">
                  <div className="flex items-center gap-2 mb-3">
                    <HeartHandshake className="w-5 h-5 text-agri-primary" />
                    <h4 className="text-base font-bold text-agri-textDark dark:text-agri-darkText">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-agri-textSecondary dark:text-agri-darkTextSecondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <CTASection
        badge="Join AgriNova"
        title="Ready to Connect with AgriNova's Network?"
        subtitle="Experience transparent agricultural trade and precision agronomic decision support."
        primaryAction={{ label: 'Register as Farmer', path: '/register/farmer' }}
        secondaryAction={{ label: 'Register as Buyer', path: '/register/buyer' }}
        className="mt-16 sm:mt-24"
      />
    </div>
  );
};
