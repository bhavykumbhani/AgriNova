import React from 'react';

/**
 * Modern Agri-Tech Card component conforming to Theme 2 specifications:
 * White, subtle shadow, 16px radius, light borders, spacious padding.
 */
export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'p-6',
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-[#112D25]
        rounded-card 
        border border-agri-border dark:border-[#21453A]
        text-agri-textDark dark:text-[#F3FAF7]
        shadow-card-subtle dark:shadow-none
        transition-all duration-300 ease-out
        ${hoverEffect ? 'hover:shadow-card-hover hover:-translate-y-1 hover:border-agri-primary/30 dark:hover:border-[#63DBAE]/40 cursor-pointer' : ''}
        ${padding}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
