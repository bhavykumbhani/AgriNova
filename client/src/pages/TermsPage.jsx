import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, BookOpen, ChevronDown } from 'lucide-react';
import { PageHero } from '../components/common/PageHero';

export const TermsPage = () => {
  const { t } = useTranslation(['legal', 'common']);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const sections = t('terms.sections', { returnObjects: true }) || [];

  return (
    <div className="pb-20">
      {/* Hero */}
      <PageHero
        badge={t('terms.title', { defaultValue: 'Terms & Conditions' })}
        badgeIcon={BookOpen}
        title={t('terms.title', { defaultValue: 'Terms & Conditions' })}
        subtitle={t('terms.subtitle', { defaultValue: 'Please read these Terms of Service carefully before utilizing the AgriNova platform.' })}
        breadcrumbs={[{ label: t('terms.title', { defaultValue: 'Terms & Conditions' }), path: '/terms' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Legal Disclaimer Box */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs sm:text-sm text-amber-800 dark:text-amber-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold mb-1">{t('terms.lastUpdated', { defaultValue: 'Last Updated: October 2026' })}</div>
            <p className="leading-relaxed">
              {t('terms.disclaimerNotice', { defaultValue: 'Important Notice: These terms represent platform policy documentation and should be reviewed by qualified legal counsel prior to full commercial scaling.' })}
            </p>
          </div>
        </div>

        {/* Mobile Collapsible TOC */}
        <div className="lg:hidden mb-8 bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder rounded-2xl p-4">
          <button
            type="button"
            onClick={() => setMobileTocOpen(!mobileTocOpen)}
            className="w-full flex items-center justify-between font-bold text-sm text-agri-textDark dark:text-agri-darkText"
          >
            <span>{t('terms.tocTitle', { defaultValue: 'Table of Contents' })}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${mobileTocOpen ? 'rotate-180' : ''}`} />
          </button>
          {mobileTocOpen && (
            <div className="mt-3 pt-3 border-t border-agri-border dark:border-agri-darkBorder space-y-1.5 max-h-60 overflow-y-auto">
              {Array.isArray(sections) && sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#sec-${sec.id}`}
                  onClick={() => setMobileTocOpen(false)}
                  className="block text-xs text-agri-textSecondary dark:text-agri-darkTextSecondary hover:text-agri-primary py-1"
                >
                  {sec.num}. {sec.title}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Sticky Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Sticky TOC (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder rounded-3xl p-6 shadow-card-subtle max-h-[calc(100vh-9rem)] overflow-y-auto">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-agri-textDark dark:text-agri-darkText mb-4">
                {t('terms.tocTitle', { defaultValue: 'Table of Contents' })}
              </h3>
              <nav className="space-y-1 text-xs">
                {Array.isArray(sections) && sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#sec-${sec.id}`}
                    className="block px-2.5 py-1.5 rounded-lg text-agri-textSecondary dark:text-agri-darkTextSecondary hover:text-agri-primary dark:hover:text-agri-darkPrimary hover:bg-agri-softGreen/50 dark:hover:bg-agri-darkBgSecondary transition-colors"
                  >
                    <span className="font-semibold text-gray-400 mr-1.5">{sec.num}.</span>
                    <span>{sec.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right Content Stream */}
          <div className="lg:col-span-8 bg-white dark:bg-agri-darkCard border border-agri-border dark:border-agri-darkBorder rounded-3xl p-6 sm:p-10 shadow-card-subtle space-y-10">
            {Array.isArray(sections) && sections.map((sec) => (
              <section key={sec.id} id={`sec-${sec.id}`} className="scroll-mt-28">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-6 h-6 rounded-lg bg-agri-softGreen dark:bg-agri-darkBgSecondary text-agri-primary dark:text-agri-darkPrimary text-xs font-extrabold flex items-center justify-center shrink-0">
                    {sec.num}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-agri-textDark dark:text-agri-darkText">
                    {sec.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-agri-textSecondary dark:text-agri-darkTextSecondary leading-relaxed pl-8">
                  {sec.content}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
