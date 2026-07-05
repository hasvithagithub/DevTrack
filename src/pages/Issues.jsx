import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiAlertCircle, FiSearch, FiFolder, FiMessageSquare, FiClock, FiPlus, FiUser } from 'react-icons/fi';
import { issues, repositories, developers } from '../data/mockData';

const Issues = () => {
  const [searchParams] = useSearchParams();
  const searchParamQuery = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
  const [repoFilter, setRepoFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    if (searchParamQuery) {
      setSearchQuery(searchParamQuery);
    }
  }, [searchParamQuery]);

  const repos = ['All', ...new Set(issues.map(i => i.repository))];
  const priorities = ['All', 'High', 'Medium', 'Low'];

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          issue.id.includes(searchQuery) ||
                          issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRepo = repoFilter === 'All' || issue.repository === repoFilter;
    const matchesPriority = priorityFilter === 'All' || issue.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    return matchesSearch && matchesRepo && matchesPriority && matchesStatus;
  });

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500/10 text-red-650 dark:text-red-400 border-red-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Closed': return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
      case 'In Progress': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      default: return 'bg-red-500/10 text-red-550';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Issues
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">
            Track software bugs, feature tasks, and developer backlogs.
          </p>
        </div>
        
        {/* Simulate New Issue creation link */}
        <button
          onClick={() => alert("Simulated: Gitea issue creation workflow.")}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-blue-500/10 transition-all self-start sm:self-center"
        >
          <FiPlus />
          <span>New Issue</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search issues by ID, title, or description..."
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
            className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-350 focus:outline-none"
          >
            <option value="All">All Repositories</option>
            {repos.filter(r => r !== 'All').map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-355 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            {priorities.filter(p => p !== 'All').map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-360 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <div 
              key={issue.id}
              className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-750 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${issue.status === 'Closed' ? 'bg-slate-100 text-slate-400' : 'bg-red-500/10 text-red-550'}`}>
                  <FiAlertCircle className="text-lg" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                      {issue.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 px-1.5 py-0.5 rounded">
                      #{issue.id}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
                    Repo: <span className="font-semibold text-slate-550 dark:text-slate-400">{issue.repository}</span>
                  </p>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2 line-clamp-1 max-w-xl">
                    {issue.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-medium text-slate-450 dark:text-slate-500 mt-4 flex-wrap">
                    {/* Priority Badge */}
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getPriorityStyle(issue.priority)}`}>
                      {issue.priority} Priority
                    </span>

                    {/* Labels */}
                    <div className="flex gap-1">
                      {issue.labels.map(lbl => (
                        <span key={lbl} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-405 border border-slate-150 dark:border-slate-850">
                          {lbl}
                        </span>
                      ))}
                    </div>

                    <span>•</span>

                    {/* Assignee */}
                    <span className="flex items-center gap-1">
                      <FiUser /> Assigned to <strong className="font-bold text-slate-600 dark:text-slate-350">{issue.assignedDeveloper || 'Unassigned'}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and dates */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-3.5 md:pt-0">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getStatusStyle(issue.status)}`}>
                  {issue.status}
                </span>
                
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1">
                  <FiClock /> opened {new Date(issue.createdDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>

            </div>
          ))
        ) : (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-[#1E293B]/20">
            <FiAlertCircle className="text-4xl mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-slate-700 dark:text-white">No issues found</h3>
            <p className="text-xs mt-1">Try adjusting search query or filters.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Issues;
