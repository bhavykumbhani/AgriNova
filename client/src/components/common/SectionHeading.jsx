import React from 'react';

export const SectionHeading = ({
  badge,
  badgeText,
  badgeIcon: BadgeIcon,
  title,
  highlightWord,
  subtitle,
  centered = false,
  align = 'left',
  className = '',
}) => {
  const isCentered = centered || align === 'center';
  const badgeContent = badge || badgeText;

  return (
    <div className={`mb-8 sm:mb-12 ${isCentered ? 'text-center max-w-2xl mx-auto' : 'max-w-3xl'} ${className}`}>
      {badgeContent && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-100 text-agri-dark dark:bg-emerald-950/80 dark:text-agri-darkAccent dark:border dark:border-emerald-800/40 mb-3 shadow-xs">
          {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
          <span>{badgeContent}</span>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-agri-textDark dark:text-[#F3FAF7] tracking-tight mb-3 text-balance">
        {title}{' '}
        {highlightWord && (
          <span className="text-agri-primary dark:text-[#27C58B]">
            {highlightWord}
          </span>
        )}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-agri-textSecondary dark:text-[#A8C2B8] leading-relaxed text-balance">
          {subtitle}
        </p>
      )}
    </div>
  );
};
