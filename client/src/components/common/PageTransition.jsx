import React from 'react';
import { motion } from 'motion/react';
import { pageTransitionVariants } from '../../utils/animations';

export const PageTransition = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full min-h-[calc(100vh-4.5rem)] ${className}`}
    >
      {children}
    </motion.div>
  );
};
