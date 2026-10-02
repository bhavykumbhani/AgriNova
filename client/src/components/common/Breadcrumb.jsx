import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [], className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-1.5 text-xs text-agri-textSecondary dark:text-agri-darkTextSecondary ${className}`}>
      <Link
        to="/"
        className="inline-flex items-center gap-1 hover:text-agri-primary dark:hover:text-agri-darkPrimary transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-agri-border dark:text-agri-darkBorder shrink-0" />
            {isLast || !item.path ? (
              <span className="font-semibold text-agri-textDark dark:text-agri-darkText truncate max-w-[200px]" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-agri-primary dark:hover:text-agri-darkPrimary transition-colors truncate max-w-[150px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
