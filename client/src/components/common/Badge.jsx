import React from 'react';

export const Badge = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
  icon: Icon,
}) => {
  const variants = {
    primary: 'bg-agri-softGreen text-agri-dark border-agri-primary/20',
    blue: 'bg-agri-softBlue text-blue-700 border-blue-200',
    orange: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-red-50 text-agri-danger border-red-200',
    neutral: 'bg-gray-100 text-agri-textSecondary border-gray-200',
  };

  const sizes = {
    xs: 'text-[11px] px-2 py-0.5 font-medium tracking-wide',
    sm: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
    md: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variants[variant] || variants.primary} ${sizes[size] || sizes.sm} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};
