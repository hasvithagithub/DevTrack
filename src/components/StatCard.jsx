import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, trendType, description, color = "blue" }) => {
  const colorMaps = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    green: "bg-green-500/10 text-green-600 dark:text-green-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    red: "bg-red-500/10 text-red-600 dark:text-red-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    slate: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className="p-5 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${colorMaps[color] || colorMaps.blue} flex-shrink-0`}>
          <Icon className="text-lg" />
        </div>
      </div>
      
      <div className="mt-3.5 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          {value}
        </span>
        
        {trend && (
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5
            ${trendType === 'up' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : ''}
            ${trendType === 'down' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : ''}
            ${trendType === 'neutral' ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400' : ''}
          `}>
            {trendType === 'up' ? '+' : ''}{trend}
          </span>
        )}
      </div>

      {description && (
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
          {description}
        </span>
      )}
    </motion.div>
  );
};

export default StatCard;
