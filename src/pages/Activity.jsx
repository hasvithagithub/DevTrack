import React, { useState } from 'react';
import { FiActivity, FiClock, FiSearch, FiFolder, FiGitCommit, FiGitPullRequest, FiAlertCircle, FiUserPlus, FiUserMinus, FiPlus } from 'react-icons/fi';
import { activityLogs } from '../data/mockData';

const Activity = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const eventTypes = [
    'All',
    'Commit Pushed',
    'Pull Request Created',
    'Pull Request Merged',
    'Issue Opened',
    'Issue Closed',
    'Repository Created',
    'Developer Joined'
  ];

  // Filtering
  const filteredActivities = activityLogs.filter(act => {
    const matchesSearch = act.details.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          act.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || act.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getEventStyles = (type) => {
    if (type.includes('Commit')) return { icon: FiGitCommit, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
    if (type.includes('Pull Request')) return { icon: FiGitPullRequest, color: 'bg-green-500/10 text-green-600 border-green-500/20' };
    if (type.includes('Issue')) return { icon: FiAlertCircle, color: 'bg-red-500/10 text-red-600 border-red-500/20' };
    if (type.includes('Repository')) return { icon: FiFolder, color: 'bg-purple-500/10 text-purple-650 border-purple-500/20' };
    if (type.includes('Developer Joined')) return { icon: FiUserPlus, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
    return { icon: FiActivity, color: 'bg-slate-500/10 text-slate-600 border-slate-500/20' };
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Activity Log
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">
          Chronological audit timeline of git server webhooks and admin dashboard operations.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search activities by actor, repo, or action description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 dark:text-slate-200"
          />
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-655 text-sm" />
        </div>

        {/* Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-555 dark:text-slate-350 focus:outline-none"
        >
          {eventTypes.map(t => (
            <option key={t} value={t}>{t === 'All' ? 'All Event Types' : t}</option>
          ))}
        </select>
      </div>

      {/* Timeline List Card */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="relative border-l-2 border-slate-100 dark:border-slate-800 space-y-8 pl-6 ml-4">
          
          {filteredActivities.length > 0 ? (
            filteredActivities.map((act) => {
              const styles = getEventStyles(act.type);
              const EventIcon = styles.icon;

              return (
                <div key={act.id} className="relative group">
                  {/* Bullet Indicator with Icon */}
                  <div className={`absolute left-[-39px] top-0 p-2 rounded-xl border-2 border-white dark:border-[#1E293B] shadow-sm z-10 ${styles.color}`}>
                    <EventIcon size={14} className="flex-shrink-0" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <p className="text-sm text-slate-650 dark:text-slate-250 font-medium">
                        <strong className="text-slate-850 dark:text-white font-bold">{act.actor}</strong> {act.details}
                      </p>
                      
                      <span className="text-[10px] text-slate-400 dark:text-slate-505 font-bold flex items-center gap-1.5 whitespace-nowrap">
                        <FiClock /> {new Date(act.time).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider text-[9px] bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 px-2 py-0.5 rounded">
                        {act.type}
                      </span>
                      {act.target && act.type !== 'Developer Joined' && (
                        <span className="text-slate-400 font-medium">
                          target repo: <strong className="font-semibold text-slate-500 dark:text-slate-400">{act.target}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-450 dark:text-slate-500">
              <FiActivity className="text-4xl mx-auto mb-3 opacity-60 animate-pulse" />
              <h3 className="text-base font-bold text-slate-700 dark:text-white">No activities logged</h3>
              <p className="text-xs mt-1">No sync updates match your search filter.</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default Activity;
