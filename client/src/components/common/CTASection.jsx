import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { buttonInteractionProps } from '../../utils/animations';

export const CTASection = ({
  badge = 'Join AgriNova',
  title = 'Ready to Transform Your Agricultural Trade?',
  subtitle = 'Join thousands of verified Indian farmers and buyers trading directly with transparent pricing and real-time intelligence.',
  primaryAction = { label: 'Register as Farmer', path: '/register/farmer' },
  secondaryAction = { label: 'Register as Buyer', path: '/register/buyer' },
  className = '',
}) => {
  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-agri-dark via-emerald-800 to-agri-textDark dark:from-agri-darkCard dark:via-agri-darkBgSecondary dark:to-agri-darkBg p-8 sm:p-12 lg:p-16 text-white shadow-xl border border-emerald-700/30 dark:border-agri-darkBorder">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-agri-primary/20 dark:bg-agri-darkPrimary/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-agri-teal/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white/10 backdrop-blur-md text-emerald-200 border border-white/15 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>{badge}</span>
              </div>
            )}

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4 text-balance">
              {title}
            </h2>

            <p className="text-base sm:text-lg text-emerald-100/90 dark:text-agri-darkTextSecondary mb-8 leading-relaxed text-balance">
              {subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {primaryAction && (
                <motion.div {...buttonInteractionProps}>
                  <Link
                    to={primaryAction.path}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-agri-dark hover:bg-emerald-50 shadow-md transition-colors"
                  >
                    <span>{primaryAction.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}

              {secondaryAction && (
                <motion.div {...buttonInteractionProps}>
                  <Link
                    to={secondaryAction.path}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors"
                  >
                    <span>{secondaryAction.label}</span>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
