import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FAQAccordion = ({ items = [], defaultOpenIndex = null, className = '' }) => {
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  const toggleItem = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const itemId = `faq-item-${idx}`;

        return (
          <div
            key={idx}
            className="border border-agri-border dark:border-agri-darkBorder bg-white dark:bg-agri-darkCard rounded-2xl overflow-hidden transition-colors shadow-sm"
          >
            <button
              type="button"
              id={`${itemId}-btn`}
              aria-expanded={isOpen}
              aria-controls={`${itemId}-panel`}
              onClick={() => toggleItem(idx)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-agri-textDark dark:text-agri-darkText hover:text-agri-primary dark:hover:text-agri-darkPrimary transition-colors focus:outline-none focus:ring-2 focus:ring-agri-primary/30"
            >
              <span className="text-sm sm:text-base pr-4">{item.question}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 text-agri-textSecondary dark:text-agri-darkTextSecondary"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${itemId}-panel`}
                  role="region"
                  aria-labelledby={`${itemId}-btn`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-agri-textSecondary dark:text-agri-darkTextSecondary leading-relaxed border-t border-agri-border/50 dark:border-agri-darkBorder/50 mt-1">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
