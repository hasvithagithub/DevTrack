import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiGitCommit, FiSearch, FiChevronLeft, FiChevronRight, 
  FiFolder, FiUser, FiGitBranch, FiCalendar 
} from 'react-icons/fi';
import { commits, repositories, developers } from '../data/mockData';

const Commits = () => {
  const [searchParams] = useSearchParams();
  const searchParamQuery = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
  const [repoFilter, setRepoFilter] = useState('All');
  const [authorFilter, setAuthorFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (searchParamQuery) {
      setSearchQuery(searchParamQuery);
    }
  }, [searchParamQuery]);

  // Unique list items for filters
  const repos = ['All', ...new Set(commits.map(c => c.repository))];
  const authors = ['All', ...new Set(commits.map(c => c.author))];
  const branchesList = ['All', ...new Set(commits.map(c => c.branch))];

  // Filtering and Sorting Commits
  const filteredCommits = commits
    .filter(commit => {
      const matchesSearch = commit.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            commit.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            commit.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRepo = repoFilter === 'All' || commit.repository === repoFilter;
      const matchesAuthor = authorFilter === 'All' || commit.author === authorFilter;
      const matchesBranch = branchFilter === 'All' || commit.branch === branchFilter;
      return matchesSearch && matchesRepo && matchesAuthor && matchesBranch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.dateTime) - new Date(a.dateTime);
      if (sortBy === 'oldest') return new Date(a.dateTime) - new Date(b.dateTime);
      if (sortBy === 'insertions') return b.insertions - a.insertions;
      if (sortBy === 'deletions') return b.deletions - a.deletions;
      return 0;
    });

  // Pagination calculation
  const totalItems = filteredCommits.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommits = filteredCommits.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Commits
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">
          Detailed repository commits database and patch logs.
        </p>
      </div>

      {/* Filter Options Panel */}
      <div className="p-5 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        {/* Row 1: Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search commits by message, hash, or author..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 dark:text-slate-200"
          />
          <FiSearch className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-650 text-sm" />
        </div>

        {/* Row 2: Select Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FiFolder /> Repository
            </span>
            <select
              value={repoFilter}
              onChange={(e) => {
                setRepoFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-350 focus:outline-none"
            >
              <option value="All">All Repositories</option>
              {repos.filter(r => r !== 'All').map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FiUser /> Author
            </span>
            <select
              value={authorFilter}
              onChange={(e) => {
                setAuthorFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-855 rounded-xl px-3 py-2 text-xs font-semibold text-slate-555 dark:text-slate-350 focus:outline-none"
            >
              <option value="All">All Authors</option>
              {authors.filter(a => a !== 'All').map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FiGitBranch /> Branch
            </span>
            <select
              value={branchFilter}
              onChange={(e) => {
                setBranchFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-860 rounded-xl px-3 py-2 text-xs font-semibold text-slate-560 dark:text-slate-355 focus:outline-none"
            >
              <option value="All">All Branches</option>
              {branchesList.filter(b => b !== 'All').map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FiCalendar /> Sort By
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-865 rounded-xl px-3 py-2 text-xs font-semibold text-slate-565 dark:text-slate-360 focus:outline-none"
            >
              <option value="newest">Date: Newest First</option>
              <option value="oldest">Date: Oldest First</option>
              <option value="insertions">Size: Insertions</option>
              <option value="deletions">Size: Deletions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Commits Table Card */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between min-h-[420px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                <th className="px-6 py-4">Commit Hash</th>
                <th className="px-6 py-4">Commit Message</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Repository</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4 text-center">Files Changed</th>
                <th className="px-6 py-4">Add / Del</th>
                <th className="px-6 py-4 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {currentCommits.length > 0 ? (
                currentCommits.map((c) => (
                  <tr key={c.hash} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/25 transition-colors">
                    <td className="px-6 py-4.5">
                      <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-500/5 dark:text-blue-400 dark:bg-blue-500/10 px-2.5 py-1 rounded">
                        {c.hash}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 font-semibold text-slate-700 dark:text-slate-250 truncate max-w-xs" title={c.message}>
                      {c.message}
                    </td>
                    <td className="px-6 py-4.5 text-xs font-semibold text-slate-650 dark:text-slate-350">
                      {c.author}
                    </td>
                    <td className="px-6 py-4.5 text-xs font-bold text-slate-500">
                      {c.repository}
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="font-mono text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-150 dark:border-slate-800/50">
                        {c.branch}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-center font-semibold text-slate-700 dark:text-slate-300">
                      {c.filesChanged}
                    </td>
                    <td className="px-6 py-4.5 text-xs font-medium whitespace-nowrap">
                      <span className="text-green-500 font-bold">+{c.insertions}</span>
                      <span className="text-slate-300 dark:text-slate-750 mx-1.5">/</span>
                      <span className="text-red-500 font-bold">-{c.deletions}</span>
                    </td>
                    <td className="px-6 py-4.5 text-right text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {new Date(c.dateTime).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-450 dark:text-slate-500">
                    No commits match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-600 dark:text-slate-400">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-bold text-slate-600 dark:text-slate-400">
                {Math.min(indexOfLastItem, totalItems)}
              </span>{' '}
              of <span className="font-bold text-slate-600 dark:text-slate-400">{totalItems}</span> commits
            </span>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all
                    ${currentPage === pageNum 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-550'}
                  `}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Commits;
