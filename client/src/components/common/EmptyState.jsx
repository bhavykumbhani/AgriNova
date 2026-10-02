import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = SearchX,
  title = 'No Results Found',
  message = 'Try adjusting your search filters or browse other available categories.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 px-4 sm:px-6 bg-white dark:bg-agri-darkCard border border-dashed border-agri-border dark:border-agri-darkBorder rounded-3xl ${className}`}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-agri-softGreen dark:bg-agri-darkBgSecondary flex items-center justify-center text-agri-primary dark:text-agri-darkPrimary">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-agri-textDark dark:text-agri-darkText mb-2">
        {title}
      </h3>
      <p className="text-sm text-agri-textSecondary dark:text-agri-darkTextSecondary max-w-md mx-auto mb-6">
        {message}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
