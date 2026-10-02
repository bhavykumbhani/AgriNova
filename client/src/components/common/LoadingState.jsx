import React from 'react';

export const LoadingState = ({ message = 'Loading...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-agri-primary/20 dark:border-agri-darkPrimary/20 animate-ping opacity-25" />
        <div className="w-12 h-12 rounded-full border-4 border-transparent border-t-agri-primary dark:border-t-agri-darkPrimary animate-spin" />
      </div>
      <p className="text-sm font-semibold text-agri-textSecondary dark:text-agri-darkTextSecondary">
        {message}
      </p>
    </div>
  );
};
