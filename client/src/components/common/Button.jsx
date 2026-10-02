import React from 'react';

/**
 * Reusable AgriNova Button component
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary:
      'bg-agri-primary text-white hover:bg-agri-dark focus:ring-agri-primary/50 shadow-sm hover:shadow active:scale-[0.98]',
    outline:
      'bg-transparent text-agri-primary border border-agri-primary hover:bg-agri-softGreen focus:ring-agri-primary/30 active:scale-[0.98]',
    secondary:
      'bg-agri-softGreen text-agri-dark hover:bg-agri-primary/15 focus:ring-agri-primary/20 active:scale-[0.98]',
    dark:
      'bg-agri-textDark text-white hover:bg-agri-textDark/90 focus:ring-agri-textDark/40 shadow-sm active:scale-[0.98]',
    ghost:
      'bg-transparent text-agri-textSecondary hover:text-agri-textDark hover:bg-gray-100/70 focus:ring-gray-300',
    accent:
      'bg-agri-orange text-white hover:bg-amber-600 focus:ring-agri-orange/40 shadow-sm active:scale-[0.98]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};
