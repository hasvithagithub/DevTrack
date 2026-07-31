import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiFolder, FiStar, FiGitBranch, FiUsers, FiAlertCircle, FiGitPullRequest, 
  FiActivity, FiBarChart2, FiClock, FiChevronLeft, FiCheckCircle, FiShield, FiCornerDownRight 
} from 'react-icons/fi';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { useRepoDetail } from '../hooks/useDevTrackQueries';

const RepoDetails = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const details = getRepoDetail(name);
    if (!details) {
      navigate('/repositories'); // Redirect back if not found
    } else {
      setRepo(details);
    }
  }, [name, navigate]);

  if (!repo) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiFolder },
    { id: 'commits', name: 'Commits', count: repo.commits.length, icon: FiActivity },
    { id: 'branches', name: 'Branches', count: repo.branches.length, icon: FiGitBranch },
    { id: 'pullRequests', name: 'Pull Requests', count: repo.pullRequests.length, icon: FiGitPullRequest },
    { id: 'issues', name: 'Issues', count: repo.issues.length, icon: FiAlertCircle },
    { id: 'contributors', name: 'Contributors', count: repo.contributorsCount, icon: FiUsers },
    { id: 'activity', name: 'Activity', icon: FiClock },
    { id: 'stats', name: 'Stats', icon: FiBarChart2 }
  ];

  // Helper for status badge
  const getIssueStatusColor = (status) => {
    switch (status) {
      case 'Closed': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
      case 'In Progress': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      default: return 'bg-red-500/10 text-red-650 dark:text-red-400';
    }
  };

  const getPRStatusColor = (status) => {
    switch (status) {
      case 'Merged': return 'bg-purple-500/10 text-purple-650 dark:text-purple-400';
      case 'Closed': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default: return 'bg-green-500/10 text-green-600 dark:text-green-400';
    }
  };

  // Stats mock commits chart
  const commitsStatsData = [
    { date: 'Mon', count: 4 },
    { date: 'Tue', count: 8 },
    { date: 'Wed', count: 5 },
    { date: 'Thu', count: 12 },
    { date: 'Fri', count: 15 },
    { date: 'Sat', count: 2 },
    { date: 'Sun', count: 4 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb Nav Bar */}
      <div>
        <Link 
          to="/repositories" 
          className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 w-fit transition-colors mb-3"
        >
          <FiChevronLeft /> Back to Repositories
        </Link>

        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/10">
              <FiFolder className="text-2xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-none my-0">
                  {repo.name}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {repo.visibility}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
                owned by {repo.owner} • Primary language: {repo.language}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-semibold text-slate-500">
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-sm select-none">
              <FiStar className="text-amber-500" /> {repo.stars} Stars
            </span>
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-sm select-none">
              <FiGitBranch className="text-blue-500" /> {repo.forks} Forks
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-1 scrollbar gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all border-b-2 whitespace-nowrap
                ${isActive 
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 bg-blue-500/5' 
                  : 'border-transparent text-slate-450 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'}
              `}
            >
              <Icon size={14} />
              <span>{tab.name}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1
                  ${isActive ? 'bg-blue-150 text-blue-600 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[400px]">
        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-850 dark:text-white mb-3">About</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {repo.description || "No description available for this repository."}
                </p>
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Language</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">{repo.language}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Size</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">{repo.storageUsed}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contributors</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">{repo.contributorsCount}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Visibility</span>
                    <span className="text-sm font-bold text-slate-850 dark:text-white mt-1 block">{repo.visibility}</span>
                  </div>
                </div>
              </div>

              {/* Weekly Commits Area Chart */}
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Commits activity this week</h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={commitsStatsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorOverviewCommits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-850" />
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOverviewCommits)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Sidebar metadata column */}
            <div className="space-y-6">
              {/* Languages */}
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Languages Distribution</h3>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex mb-4">
                  <div className="h-full bg-blue-600" style={{ width: '70%' }} />
                  <div className="h-full bg-teal-500" style={{ width: '20%' }} />
                  <div className="h-full bg-slate-300 dark:bg-slate-650" style={{ width: '10%' }} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> {repo.language}</span>
                    <span className="text-slate-400">70.0%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> HTML/CSS</span>
                    <span className="text-slate-400">20.0%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" /> Others</span>
                    <span className="text-slate-400">10.0%</span>
                  </div>
                </div>
              </div>

              {/* Latest details list */}
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Meta Info</h3>
                <div className="flex justify-between text-xs font-medium border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-400">Created On</span>
                  <span className="text-slate-600 dark:text-slate-350">2024-04-12</span>
                </div>
                <div className="flex justify-between text-xs font-medium border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-400">Last Synced</span>
                  <span className="text-slate-600 dark:text-slate-350">{new Date(repo.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Collaborators</span>
                  <span className="text-slate-600 dark:text-slate-350">{repo.contributors.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: COMMITS */}
        {activeTab === 'commits' && (
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-850 dark:text-white">Commit History</h3>
              <p className="text-xs text-slate-400 mt-0.5">Commit pushes registered in Gitea logs.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                    <th className="px-6 py-3">Hash</th>
                    <th className="px-6 py-3">Message</th>
                    <th className="px-6 py-3">Branch</th>
                    <th className="px-6 py-3">Author</th>
                    <th className="px-6 py-3">Changes</th>
                    <th className="px-6 py-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {repo.commits.length > 0 ? (
                    repo.commits.map((c) => (
                      <tr key={c.hash} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <Link to="/commits" className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-500/10 px-2.5 py-1 rounded">
                            {c.shortHash}
                          </Link>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-250 truncate max-w-xs">{c.message}</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{c.branch}</td>
                        <td className="px-6 py-4 text-slate-650 dark:text-slate-350">{c.author}</td>
                        <td className="px-6 py-4 text-xs font-medium">
                          <span className="text-green-500 font-bold">+{c.insertions}</span>{' '}
                          <span className="text-red-500 font-bold">-{c.deletions}</span>
                        </td>
                        <td className="px-6 py-4 text-right text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {new Date(c.dateTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-450 dark:text-slate-500">No commits found in this repository.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: BRANCHES */}
        {activeTab === 'branches' && (
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-850 dark:text-white">Active Branches</h3>
              <p className="text-xs text-slate-400 mt-0.5">Branches active on self-hosted servers.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                    <th className="px-6 py-3">Branch Name</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Latest Commit</th>
                    <th className="px-6 py-3">Created By</th>
                    <th className="px-6 py-3">Ahead / Behind</th>
                    <th className="px-6 py-3 text-right">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {repo.branches.length > 0 ? (
                    repo.branches.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                          <FiGitBranch className="text-slate-400 text-xs" /> {b.name}
                        </td>
                        <td className="px-6 py-4">
                          {b.protected ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center gap-1 w-fit">
                              <FiShield size={10} /> Protected
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 w-fit">
                              Feature
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-750 dark:text-slate-350 line-clamp-1">{b.latestCommitMsg}</span>
                            <span className="font-mono text-[10px] text-slate-400 mt-0.5">hash: {b.latestCommit}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500">@{b.createdBy}</td>
                        <td className="px-6 py-4 text-xs font-medium">
                          {b.ahead > 0 || b.behind > 0 ? (
                            <span className="text-slate-600 dark:text-slate-350">
                              <span className="text-green-500 font-bold">{b.ahead} ahead</span> • <span className="text-amber-500 font-bold">{b.behind} behind</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">Up to date</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {new Date(b.lastUpdated).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-450 dark:text-slate-500">No branches found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: PULL REQUESTS */}
        {activeTab === 'pullRequests' && (
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-850 dark:text-white">Pull Requests</h3>
              <p className="text-xs text-slate-400 mt-0.5">Manage merges and code reviews.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Branch Route</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Author</th>
                    <th className="px-6 py-3">Reviewer</th>
                    <th className="px-6 py-3 text-right">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {repo.pullRequests.length > 0 ? (
                    repo.pullRequests.map((pr) => (
                      <tr key={pr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <Link to="/pull-requests" className="text-sm font-bold text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 line-clamp-1">
                            {pr.title}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5">#{pr.id}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <span>{pr.sourceBranch}</span>
                            <FiCornerDownRight className="text-slate-300" />
                            <span>{pr.targetBranch}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getPRStatusColor(pr.status)}`}>
                            {pr.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-350">@{pr.authorUsername}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{pr.reviewer || 'Unassigned'}</td>
                        <td className="px-6 py-4 text-right text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {new Date(pr.createdDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-450 dark:text-slate-500">No pull requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: ISSUES */}
        {activeTab === 'issues' && (
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-850 dark:text-white">Assigned Issues</h3>
              <p className="text-xs text-slate-400 mt-0.5">Outstanding tasks and bugs reports.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                    <th className="px-6 py-3">Issue Title</th>
                    <th className="px-6 py-3">Priority</th>
                    <th className="px-6 py-3">Labels</th>
                    <th className="px-6 py-3">Assignee</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {repo.issues.length > 0 ? (
                    repo.issues.map((i) => (
                      <tr key={i.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <Link to="/issues" className="text-sm font-bold text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 line-clamp-1">
                            {i.title}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5">#{i.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                            ${i.priority === 'High' ? 'bg-red-500/10 text-red-650 dark:text-red-400' : ''}
                            ${i.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : ''}
                            ${i.priority === 'Low' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : ''}
                          `}>
                            {i.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex flex-wrap gap-1 items-center pt-5">
                          {i.labels.map(l => (
                            <span key={l} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-150 text-slate-600 dark:bg-slate-800 dark:text-slate-405">
                              {l}
                            </span>
                          ))}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-650 dark:text-slate-350">
                          {i.assignedDeveloper || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getIssueStatusColor(i.status)}`}>
                            {i.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {new Date(i.createdDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-450 dark:text-slate-500">No issues found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: CONTRIBUTORS */}
        {activeTab === 'contributors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repo.contributors.map((username) => (
              <div 
                key={username}
                className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <img 
                  src={`https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face`} // Demo image, we can mapping dev profile if needed
                  alt={username} 
                  className="w-12 h-12 rounded-full border border-slate-100" 
                />
                <div>
                  <Link to={`/developers/${username}`} className="text-sm font-bold text-slate-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors">
                    {username === 'swilson' ? 'Sarah Wilson' : username === 'jsmith' ? 'John Smith' : username === 'dkumar' ? 'David Kumar' : username === 'psharma' ? 'Priya Sharma' : username === 'achen' ? 'Alex Chen' : 'Emily Johnson'}
                  </Link>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">@{username}</p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-450 font-bold uppercase tracking-wider mt-2 bg-blue-500/5 px-2 py-0.5 rounded w-fit">
                    Collaborator
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 7: ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-850 dark:text-white mb-5">Repository Event Timeline</h3>
            <div className="space-y-6 pl-4 border-l border-slate-200 dark:border-slate-800">
              {repo.activities.length > 0 ? (
                repo.activities.map((act) => (
                  <div key={act.id} className="relative">
                    <div className="absolute left-[-21px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900" />
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                        <strong className="text-slate-850 dark:text-white font-semibold">{act.actor}</strong> {act.details}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1 font-semibold">
                        {new Date(act.time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-450 text-sm py-6">No recent activity logged for this repository.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 8: STATS */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contributor Commits Chart */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Commits by Contributor</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Sarah W.', commits: 45 },
                    { name: 'John S.', commits: 38 },
                    { name: 'Alex C.', commits: 15 },
                    { name: 'Emily J.', commits: 8 }
                  ]} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-850" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                    <Bar dataKey="commits" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Health Stats summary */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Repository Health Index</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-550 dark:text-slate-400">Issue Resolution Rate</span>
                      <span className="text-green-500 font-bold">88%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '88%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-550 dark:text-slate-400">PR Merge Velocity</span>
                      <span className="text-blue-500 font-bold">12.5 hrs</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '75%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-550 dark:text-slate-400">Test Suite Coverage</span>
                      <span className="text-green-500 font-bold">94.2%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '94%' }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-450 dark:text-slate-550 font-medium">
                Sync Engine reports all tests compiling and build pipeline passing in Gitea runners.
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default RepoDetails;
