import React from 'react';
import { motion } from 'motion/react';
import { Breadcrumb } from './Breadcrumb';
import { fadeUp } from '../../utils/animations';

export const PageHero = ({
  title,
  subtitle,
  badge,
  badgeIcon: BadgeIcon,
  breadcrumbs = [],
  children,
  className = '',
}) => {
  return (
    <section className={`relative overflow-hidden bg-gradient-to-b from-agri-softGreen/50 via-agri-bg to-agri-bg dark:from-agri-darkBgSecondary dark:via-agri-darkBg dark:to-agri-darkBg border-b border-agri-border/60 dark:border-agri-darkBorder/60 pt-8 pb-12 sm:pt-10 sm:pb-16 ${className}`}>
      {/* Decorative subtle ambient lights */}
      <div className="absolute top-0 right-1/4 -mt-20 w-80 h-80 rounded-full bg-agri-primary/10 dark:bg-agri-darkPrimary/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 -mt-20 w-60 h-60 rounded-full bg-agri-teal/10 dark:bg-agri-darkAccent/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {breadcrumbs.length > 0 && (
          <div className="mb-4">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-100/80 text-agri-dark dark:bg-emerald-950/80 dark:text-agri-darkAccent dark:border dark:border-emerald-800/50 mb-3.5">
              {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
              <span>{badge}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-agri-textDark dark:text-agri-darkText tracking-tight mb-4 text-balance">
            {title}
          </h1>

          {subtitle && (
            <p className="text-base sm:text-lg text-agri-textSecondary dark:text-agri-darkTextSecondary leading-relaxed text-balance">
              {subtitle}
            </p>
          )}

          {children && <div className="mt-6 sm:mt-8">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
};
