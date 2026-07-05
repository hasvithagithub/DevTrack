import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiSearch, FiClock, FiGrid, FiArrowRight, FiUserPlus } from 'react-icons/fi';
import { developers } from '../data/mockData';

const Developers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('commits');

  const roles = ['All', ...new Set(developers.map(d => d.role))];
  const statuses = ['All', 'Active', 'Offline'];

  // Filter and Sort Developers
  const filteredDevs = developers
    .filter(dev => {
      const matchesSearch = dev.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            dev.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            dev.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'All' || dev.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || dev.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'commits') return b.commitCount - a.commitCount;
      if (sortBy === 'repos') return b.repoCount - a.repoCount;
      if (sortBy === 'prs') return b.pullRequests - a.pullRequests;
      return a.name.localeCompare(b.name);
    });

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-green-500/10 text-green-600 dark:text-green-400">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" /> Offline
      </span>
    );
  };

  const handleRowClick = (username) => {
    navigate(`/developers/${username}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Developers
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">
            Directory of organization software engineers, architects, and DevOps staff.
          </p>
        </div>
        
        {/* New Dev Register shortcut link */}
        <Link
          to="/admin?action=create-user"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-blue-500/10 transition-all self-start sm:self-center"
        >
          <FiUserPlus />
          <span>Add Developer</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search developers by name, username, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 dark:text-slate-200"
          />
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-650 text-sm" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Roles</option>
            {roles.filter(r => r !== 'All').map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Statuses</option>
            {statuses.filter(s => s !== 'All').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="commits">Sort: Commits</option>
            <option value="repos">Sort: Repositories</option>
            <option value="prs">Sort: Pull Requests</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                <th className="px-6 py-4">Developer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-center">Repositories</th>
                <th className="px-6 py-4 text-center">Commits</th>
                <th className="px-6 py-4 text-center">Issues Assigned</th>
                <th className="px-6 py-4 text-center">PRs Created</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredDevs.length > 0 ? (
                filteredDevs.map((dev) => (
                  <tr 
                    key={dev.id} 
                    className="hover:bg-slate-50/40 dark:hover:bg-slate-800/25 transition-colors cursor-pointer group"
                    onClick={() => handleRowClick(dev.username)}
                  >
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={dev.avatar} 
                          alt={dev.name} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {dev.name}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                            @{dev.username}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 font-medium text-slate-500 dark:text-slate-400 text-xs">
                      {dev.email}
                    </td>
                    <td className="px-6 py-4.5 text-xs font-semibold text-slate-650 dark:text-slate-350">
                      {dev.role}
                    </td>
                    <td className="px-6 py-4.5 text-center font-semibold text-slate-700 dark:text-slate-300">
                      {dev.repoCount}
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <span className="text-sm font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                        {dev.commitCount}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${dev.issuesAssigned > 0 ? 'bg-red-500/10 text-red-500' : 'bg-slate-100 text-slate-400'}`}>
                        {dev.issuesAssigned}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-center font-bold text-green-500">
                      {dev.pullRequests}
                    </td>
                    <td className="px-6 py-4.5">
                      {getStatusBadge(dev.status)}
                    </td>
                    <td className="px-6 py-4.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <Link 
                        to={`/developers/${dev.username}`}
                        className="text-xs font-bold text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1 justify-end transition-colors"
                      >
                        Profile <FiArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-slate-450 dark:text-slate-500">
                    No developers match the selected filters.
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

export default Developers;
