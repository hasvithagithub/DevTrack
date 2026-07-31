import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiUser, FiMail, FiMapPin, FiBriefcase, FiFolder, FiGitCommit, 
  FiAlertCircle, FiGitPullRequest, FiClock, FiChevronLeft, FiActivity, FiGlobe 
} from 'react-icons/fi';
import { useDevProfile } from '../hooks/useDevTrackQueries';

const DevProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [dev, setDev] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('overview');

  useEffect(() => {
    const profile = getDevProfile(username);
    if (!profile) {
      navigate('/developers');
    } else {
      setDev(profile);
    }
  }, [username, navigate]);

  if (!dev) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Stats
  const totalCommits = dev.commits.length;
  const pendingPRs = dev.pullRequests.filter(pr => pr.status === 'Open').length;
  const assignedIssues = dev.issues.filter(i => i.status !== 'Closed').length;

  // Contribution graph mock dataset (7 days x 16 weeks)
  const contributionGrid = Array.from({ length: 7 }, () => 
    Array.from({ length: 20 }, () => Math.floor(Math.random() * 5))
  );

  const daysOfWeek = ['Mon', 'Wed', 'Fri'];
  
  const getContributionColor = (val) => {
    if (val === 0) return 'bg-slate-100 dark:bg-slate-800';
    if (val === 1) return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-900';
    if (val === 2) return 'bg-emerald-300 dark:bg-emerald-800/60 text-emerald-100';
    if (val === 3) return 'bg-emerald-500 dark:bg-emerald-600 text-white';
    return 'bg-emerald-700 dark:bg-emerald-450 text-white';
  };

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <div>
        <Link 
          to="/developers" 
          className="text-xs font-bold text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 flex items-center gap-1 w-fit transition-colors mb-3"
        >
          <FiChevronLeft /> Back to Developers
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Developer Info Card */}
        <div className="lg:col-span-1 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center h-fit">
          <div className="relative">
            <img 
              src={dev.avatar} 
              alt={dev.name} 
              className="w-28 h-28 rounded-full border-2 border-slate-100 dark:border-slate-800 object-cover shadow-md"
            />
            <span className={`absolute bottom-1 right-2 w-4 h-4 rounded-full border-2 border-white dark:border-[#1E293B]
              ${dev.status === 'Active' ? 'bg-green-500' : 'bg-slate-455'}
            `} />
          </div>

          <h2 className="text-lg font-bold text-slate-850 dark:text-white mt-4">{dev.name}</h2>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">@{dev.username}</span>
          
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mt-3 select-none">
            {dev.role}
          </span>

          <p className="text-xs text-slate-450 dark:text-slate-400 font-medium leading-relaxed mt-5">
            {dev.bio || "Full stack developer based in office headquarters."}
          </p>

          <div className="w-full border-t border-slate-100 dark:border-slate-800 mt-6 pt-5 space-y-3.5 text-left text-xs font-medium">
            <div className="flex items-center gap-3 text-slate-550 dark:text-slate-350">
              <FiMail className="text-slate-400 flex-shrink-0" />
              <span className="truncate">{dev.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-550 dark:text-slate-350">
              <FiBriefcase className="text-slate-400 flex-shrink-0" />
              <span>{dev.department}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-550 dark:text-slate-350">
              <FiMapPin className="text-slate-400 flex-shrink-0" />
              <span>{dev.location}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-550 dark:text-slate-350">
              <FiGlobe className="text-slate-400 flex-shrink-0" />
              <span className="text-blue-500 hover:underline cursor-pointer">portfolio.dev</span>
            </div>
          </div>
        </div>

        {/* Right Side: Contribution logs and metrics */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Commits</span>
              <span className="text-xl font-bold text-slate-800 dark:text-white mt-1 block">{dev.commitCount}</span>
            </div>
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Open Issues</span>
              <span className="text-xl font-bold text-red-500 mt-1 block">{assignedIssues}</span>
            </div>
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PRs Created</span>
              <span className="text-xl font-bold text-green-500 mt-1 block">{dev.pullRequests}</span>
            </div>
          </div>

          {/* Contribution Graph Card */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Contribution History</h3>
                <p className="text-xs text-slate-400 font-medium">Daily code logs pushed to corporate repositories.</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-450">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-slate-800" />
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 dark:bg-emerald-950/20" />
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-300 dark:bg-emerald-800/40" />
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700" />
                <span>More</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 overflow-x-auto pb-2 scrollbar">
              {contributionGrid.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-1 items-center">
                  <span className="text-[9px] text-slate-400 font-bold w-6 select-none">
                    {rIdx === 1 ? 'Mon' : rIdx === 3 ? 'Wed' : rIdx === 5 ? 'Fri' : ''}
                  </span>
                  <div className="flex gap-1">
                    {row.map((val, cIdx) => (
                      <div 
                        key={cIdx} 
                        title={`Day ${rIdx}, Week ${cIdx}: ${val} commits`}
                        className={`w-3.5 h-3.5 rounded-sm cursor-pointer transition-transform hover:scale-120 ${getContributionColor(val)}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-850 gap-2 pb-1">
            <button 
              onClick={() => setActiveSubTab('overview')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors
                ${activeSubTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800'}
              `}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveSubTab('commits')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors
                ${activeSubTab === 'commits' ? 'bg-blue-600 text-white' : 'text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800'}
              `}
            >
              Commits ({dev.commits.length})
            </button>
            <button 
              onClick={() => setActiveSubTab('issues')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors
                ${activeSubTab === 'issues' ? 'bg-blue-600 text-white' : 'text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800'}
              `}
            >
              Assigned Issues ({dev.issues.length})
            </button>
            <button 
              onClick={() => setActiveSubTab('prs')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors
                ${activeSubTab === 'prs' ? 'bg-blue-600 text-white' : 'text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800'}
              `}
            >
              Pull Requests ({dev.pullRequests.length})
            </button>
          </div>

          {/* Tab Views */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[300px]">
            
            {/* Overview Section */}
            {activeSubTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Assigned Repositories</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mock repositories the dev has contributed to */}
                    {['EmployeePortal', 'HRMS', 'CustomerInsight'].map((repoName, idx) => (
                      <div key={idx} className="p-4 border border-slate-150 dark:border-slate-800 rounded-2xl flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <FiFolder className="text-blue-500" />
                          <Link to={`/repositories/${repoName}`} className="text-sm font-bold text-slate-700 hover:text-blue-600 dark:text-slate-200">
                            {repoName}
                          </Link>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 dark:bg-slate-900 text-slate-500">
                          {idx === 1 ? 'Java' : idx === 2 ? 'Python' : 'JavaScript'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Recent Commit Pushes</h4>
                  <div className="space-y-3">
                    {dev.commits.slice(0, 3).map(c => (
                      <div key={c.hash} className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-750 dark:text-slate-250 truncate max-w-sm">{c.message}</p>
                          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{c.repository} • {c.shortHash}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{new Date(c.dateTime).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Commits Section */}
            {activeSubTab === 'commits' && (
              <div className="space-y-4">
                {dev.commits.length > 0 ? (
                  dev.commits.map(c => (
                    <div key={c.hash} className="p-4 border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-750 dark:text-slate-200">{c.message}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="font-mono text-blue-500 font-bold bg-blue-500/5 px-2 py-0.5 rounded">{c.shortHash}</span>
                          <span>•</span>
                          <span>Repo: {c.repository}</span>
                          <span>•</span>
                          <span className="font-mono">Branch: {c.branch}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold">
                        <span className="text-green-500">+{c.insertions}</span>
                        <span className="text-red-500">-{c.deletions}</span>
                        <span className="text-slate-400 dark:text-slate-550 font-normal">{new Date(c.dateTime).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-450">No commits found.</div>
                )}
              </div>
            )}

            {/* Issues Section */}
            {activeSubTab === 'issues' && (
              <div className="space-y-4">
                {dev.issues.length > 0 ? (
                  dev.issues.map(i => (
                    <div key={i.id} className="p-4 border border-slate-150 dark:border-slate-850 rounded-2xl flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                      <div>
                        <h4 className="text-sm font-bold text-slate-750 dark:text-slate-200">{i.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="font-semibold text-slate-500">#{i.id}</span>
                          <span>•</span>
                          <span>Repo: {i.repository}</span>
                          <span>•</span>
                          <span className={`font-bold uppercase tracking-wider text-[9px]
                            ${i.priority === 'High' ? 'text-red-500' : i.priority === 'Medium' ? 'text-amber-500' : 'text-blue-500'}
                          `}>
                            {i.priority} Priority
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                        ${i.status === 'Closed' ? 'bg-slate-100 text-slate-650' : 'bg-red-500/10 text-red-550'}
                      `}>
                        {i.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-450">No issues assigned.</div>
                )}
              </div>
            )}

            {/* PRs Section */}
            {activeSubTab === 'prs' && (
              <div className="space-y-4">
                {dev.pullRequests.length > 0 ? (
                  dev.pullRequests.map(pr => (
                    <div key={pr.id} className="p-4 border border-slate-150 dark:border-slate-850 rounded-2xl flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                      <div>
                        <h4 className="text-sm font-bold text-slate-750 dark:text-slate-200">{pr.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="font-semibold text-slate-550">#{pr.id}</span>
                          <span>•</span>
                          <span>Repo: {pr.repository}</span>
                          <span>•</span>
                          <span>Merge: {pr.sourceBranch} → {pr.targetBranch}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                        ${pr.status === 'Merged' ? 'bg-purple-500/10 text-purple-650 dark:text-purple-400' : pr.status === 'Open' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}
                      `}>
                        {pr.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-450">No pull requests created.</div>
                )}
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-5">Recent Activity Timeline</h3>
            <div className="space-y-5 pl-4 border-l border-slate-150 dark:border-slate-850">
              {dev.activities.length > 0 ? (
                dev.activities.map((act) => (
                  <div key={act.id} className="relative">
                    <div className="absolute left-[-21px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900" />
                    <div>
                      <p className="text-sm text-slate-650 dark:text-slate-200">
                        {act.details} in <span className="font-semibold text-slate-800 dark:text-white">{act.target}</span>
                      </p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                        {new Date(act.time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-450 text-sm py-4">No recent activities logged.</div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DevProfile;
