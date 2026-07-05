import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiGitBranch, FiShield, FiSearch, FiFolder, FiLock } from 'react-icons/fi';
import { branches } from '../data/mockData';

const Branches = () => {
  const [searchParams] = useSearchParams();
  const searchParamQuery = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
  const [repoFilter, setRepoFilter] = useState('All');
  const [protectedFilter, setProtectedFilter] = useState('All');

  const repos = ['All', ...new Set(branches.map(b => b.repository))];

  const filteredBranches = branches.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.latestCommitMsg.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRepo = repoFilter === 'All' || b.repository === repoFilter;
    
    let matchesProtection = true;
    if (protectedFilter === 'Protected') matchesProtection = b.protected;
    if (protectedFilter === 'Unprotected') matchesProtection = !b.protected;
    
    return matchesSearch && matchesRepo && matchesProtection;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Branches
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">
          Monitor active branches and sync status across codebases.
        </p>
      </div>

      {/* Filter Options */}
      <div className="p-4 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search branches by name or commit message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 dark:text-slate-200"
          />
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-655 text-sm" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Repo */}
          <select
            value={repoFilter}
            onChange={(e) => setRepoFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-350 focus:outline-none"
          >
            <option value="All">All Repositories</option>
            {repos.filter(r => r !== 'All').map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Protection status */}
          <select
            value={protectedFilter}
            onChange={(e) => setProtectedFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-350 focus:outline-none"
          >
            <option value="All">All Protections</option>
            <option value="Protected">Protected</option>
            <option value="Unprotected">Unprotected</option>
          </select>
        </div>
      </div>

      {/* Branches Table */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                <th className="px-6 py-4">Branch Name</th>
                <th className="px-6 py-4">Repository</th>
                <th className="px-6 py-4">Protection</th>
                <th className="px-6 py-4">Latest Commit</th>
                <th className="px-6 py-4">Created By</th>
                <th className="px-6 py-4">Ahead / Behind</th>
                <th className="px-6 py-4 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredBranches.length > 0 ? (
                filteredBranches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/25 transition-colors">
                    <td className="px-6 py-4.5 font-mono text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <FiGitBranch className="text-slate-400 text-xs flex-shrink-0" />
                      <span>{b.name}</span>
                    </td>
                    <td className="px-6 py-4.5 text-xs font-semibold text-slate-500">
                      {b.repository}
                    </td>
                    <td className="px-6 py-4.5">
                      {b.protected ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-blue-500/10 text-blue-650 dark:text-blue-400">
                          <FiLock size={9} /> Protected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Feature
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-750 dark:text-slate-205 line-clamp-1">{b.latestCommitMsg}</span>
                        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 mt-1">hash: {b.latestCommit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-xs font-semibold text-slate-500">
                      @{b.createdBy}
                    </td>
                    <td className="px-6 py-4.5 text-xs font-semibold">
                      {b.ahead > 0 || b.behind > 0 ? (
                        <span>
                          <span className="text-green-500">+{b.ahead} ahead</span>
                          <span className="text-slate-300 dark:text-slate-800 mx-1">/</span>
                          <span className="text-amber-500">-{b.behind} behind</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Up to date</span>
                      )}
                    </td>
                    <td className="px-6 py-4.5 text-right text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {new Date(b.lastUpdated).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-450 dark:text-slate-500">
                    No branches matched your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Branches;
