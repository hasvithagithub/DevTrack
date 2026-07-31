import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiGitPullRequest, FiSearch, FiFolder, FiMessageSquare, FiClock, FiPlus } from 'react-icons/fi';
import { useAllPullRequests, useRepositories } from '../hooks/useDevTrackQueries';

const PullRequests = () => {
  const { data: pullRequests = [] } = useAllPullRequests();
  const { data: repositories = [] } = useRepositories();
  const [searchParams] = useSearchParams();
  const searchParamQuery = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
  const [repoFilter, setRepoFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    if (searchParamQuery) {
      setSearchQuery(searchParamQuery);
    }
  }, [searchParamQuery]);

  const repos = ['All', ...new Set(pullRequests.map(p => p.repository))];

  const filteredPRs = pullRequests.filter(pr => {
    const matchesSearch = pr.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pr.id.includes(searchQuery) ||
                          pr.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRepo = repoFilter === 'All' || pr.repository === repoFilter;
    const matchesStatus = statusFilter === 'All' || pr.status === statusFilter;
    return matchesSearch && matchesRepo && matchesStatus;
  });

  const getPRStatusStyle = (status) => {
    switch (status) {
      case 'Merged': return 'bg-purple-500/10 text-purple-650 dark:text-purple-400';
      case 'Closed': return 'bg-red-500/10 text-red-650 dark:text-red-400';
      default: return 'bg-green-500/10 text-green-600 dark:text-green-400';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Pull Requests
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">
            Audit and approve code merges across repositories.
          </p>
        </div>
        
        {/* Simulate trigger or button */}
        <button
          onClick={() => alert("Simulated: Gitea SSO Pull Request creation trigger.")}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-blue-500/10 transition-all self-start sm:self-center"
        >
          <FiPlus />
          <span>New Pull Request</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search pull requests by ID, title, or author..."
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

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-350 focus:outline-none"
          >
            <option value="All">All PR Statuses</option>
            <option value="Open">Open</option>
            <option value="Merged">Merged</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* PR Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPRs.length > 0 ? (
          filteredPRs.map((pr) => (
            <div 
              key={pr.id}
              className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-750 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${pr.status === 'Merged' ? 'bg-purple-500/10 text-purple-650' : pr.status === 'Closed' ? 'bg-red-500/10 text-red-650' : 'bg-green-500/10 text-green-600'}`}>
                  <FiGitPullRequest className="text-lg" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                      {pr.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 px-1.5 py-0.5 rounded">
                      #{pr.id}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
                    Repo: <span className="font-semibold text-slate-550 dark:text-slate-405">{pr.repository}</span> • Merge route: <span className="font-mono bg-slate-50 dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-150/50 dark:border-slate-800">{pr.sourceBranch} → {pr.targetBranch}</span>
                  </p>

                  <div className="flex items-center gap-4 text-xs font-medium text-slate-450 dark:text-slate-500 mt-4">
                    <span>opened by <strong className="font-bold text-slate-600 dark:text-slate-350">@{pr.authorUsername}</strong></span>
                    {pr.reviewer && (
                      <span>reviewed by <strong className="font-bold text-slate-600 dark:text-slate-355">@{pr.reviewer.toLowerCase()}</strong></span>
                    )}
                    <span className="flex items-center gap-1">
                      <FiMessageSquare /> {pr.commentsCount} comments
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and dates */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-3.5 md:pt-0">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getPRStatusStyle(pr.status)}`}>
                  {pr.status}
                </span>
                
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1">
                  <FiClock /> created {new Date(pr.createdDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>

            </div>
          ))
        ) : (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-[#1E293B]/20">
            <FiGitPullRequest className="text-4xl mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-slate-700 dark:text-white">No pull requests found</h3>
            <p className="text-xs mt-1">Try adjusting search query or filters.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default PullRequests;
