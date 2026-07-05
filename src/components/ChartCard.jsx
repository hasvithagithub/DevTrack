import React from 'react';
import { motion } from 'framer-motion';

const ChartCard = ({ title, subtitle, children, actions }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-5 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-[280px] overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      
      <div className="flex-1 h-0 w-full relative">
        {children}
      </div>
    </motion.div>
  );
};

export default ChartCard;
