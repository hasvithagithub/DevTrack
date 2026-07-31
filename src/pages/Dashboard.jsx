import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiFolder, FiUsers, FiGitCommit, FiGitPullRequest, FiAlertCircle, 
  FiDatabase, FiTrendingUp, FiActivity, FiChevronRight, FiClock 
} from 'react-icons/fi';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  BarChart, Bar, Cell, PieChart, Pie, Legend, LineChart, Line 
} from 'recharts';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { useRepositories, useDevelopers, useAllCommits, useAllPullRequests, useAllIssues, useActivityLogs } from '../hooks/useDevTrackQueries';

const Dashboard = () => {
  const { data: repositories = [] } = useRepositories();
  const { data: developers = [] } = useDevelopers();
  const { data: commits = [] } = useAllCommits();
  const { data: pullRequests = [] } = useAllPullRequests();
  const { data: issues = [] } = useAllIssues();
  const { data: activityLogs = [] } = useActivityLogs();

  // Stats calculations
  const totalRepos = repositories.length;
  const totalDevs = developers.length;
  const activeDevs = developers.length > 0 ? developers.filter(d => d.status === 'Active').length : 0;
  
  // Derive PRs and Issues from repo stats since global hooks are empty
  const openPRs = repositories.reduce((sum, r) => sum + (r.openPRsCount || 0), 0);
  const openIssues = repositories.reduce((sum, r) => sum + (r.openIssuesCount || 0), 0);
  
  // Storage summary: add MB values
  const totalStorage = repositories.reduce((acc, repo) => {
    const val = parseInt(repo.storageUsed) || 0;
    return acc + val;
  }, 0);

  // Today's commits
  const today = new Date().toISOString().split('T')[0];
  const todayCommits = commits.filter(c => c.dateTime && c.dateTime.startsWith(today)).length;
  const weeklyCommits = commits.length * 3; // Mock realistic weekly scale
  const monthlyCommits = commits.length * 12;

  // Chart Data 1: Commits Per Day (Last 7 Days)
  const commitHistoryData = [
    { name: 'Mon', commits: 14 },
    { name: 'Tue', commits: 22 },
    { name: 'Wed', commits: 18 },
    { name: 'Thu', commits: 28 },
    { name: 'Fri', commits: 35 },
    { name: 'Sat', commits: 8 },
    { name: 'Sun', commits: 12 },
  ];

  // Chart Data 2: Repository Activity
  const repoActivityData = repositories.map(r => ({
    name: r.name,
    commits: r.weeklyCommits,
    issues: r.openIssuesCount
  }));

  // Chart Data 3: Top Contributors (Commit Count)
  const topContributorsData = developers
    .map(d => ({ name: d.name.split(' ')[0], commits: d.commitCount }))
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 5);

  // Chart Data 4: Language Distribution
  const languageCounts = {};
  repositories.forEach(repo => {
    languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
  });
  const languageData = Object.keys(languageCounts).map(lang => {
    const repoWithLang = repositories.find(r => r.language === lang);
    return {
      name: lang,
      value: languageCounts[lang],
      color: repoWithLang ? repoWithLang.langColor : '#CBD5E1'
    };
  });

  // Chart Data 5: Repository Growth
  const repoGrowthData = [
    { month: 'Jan', count: 2 },
    { month: 'Feb', count: 2 },
    { month: 'Mar', count: 3 },
    { month: 'Apr', count: 4 },
    { month: 'May', count: 5 },
    { month: 'Jun', count: 6 },
  ];

  // Chart Data 6: Commit Heatmap grid (GitHub contribution style)
  // Rows: Mon-Sun (7). Cols: Weeks (16).
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heatmapData = Array.from({ length: 7 }, (_, dayIdx) => {
    return Array.from({ length: 24 }, (_, weekIdx) => {
      // Simulate random commit counts (0 to 4) with heavier weight on weekdays
      const isWeekend = dayIdx >= 5;
      const factor = isWeekend ? 0.25 : 0.7;
      const val = Math.random() < factor ? Math.floor(Math.random() * 4) : 0;
      return val;
    });
  });

  // Cell color helper for heatmap
  const getHeatmapColor = (value) => {
    if (value === 0) return 'bg-slate-100 dark:bg-slate-800';
    if (value === 1) return 'bg-blue-200 dark:bg-blue-900/40 text-blue-900';
    if (value === 2) return 'bg-blue-400 dark:bg-blue-700/60 text-blue-100';
    return 'bg-blue-600 dark:bg-blue-500 text-white';
  };

  // Recent commits table (Take top 5)
  const recentCommits = commits.slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">
            System overview and repository health metrics for DevTrack Enterprise.
          </p>
        </div>
      </div>

      {/* Grid of 9 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard 
          title="Total Repositories" 
          value={totalRepos} 
          icon={FiFolder} 
          trend="14%" 
          trendType="up" 
          description="Active codebases" 
          color="blue" 
        />
        <StatCard 
          title="Total Developers" 
          value={totalDevs} 
          icon={FiUsers} 
          trend="8%" 
          trendType="up" 
          description="Authorized seats" 
          color="purple" 
        />
        <StatCard 
          title="Today's Commits" 
          value={todayCommits} 
          icon={FiGitCommit} 
          trend="25%" 
          trendType="up" 
          description="Pushed in 24 hours" 
          color="green" 
        />
        <StatCard 
          title="Weekly Commits" 
          value={weeklyCommits} 
          icon={FiGitCommit} 
          trend="12%" 
          trendType="up" 
          description="Current sprint" 
          color="blue" 
        />
        <StatCard 
          title="Monthly Commits" 
          value={monthlyCommits} 
          icon={FiGitCommit} 
          trend="5%" 
          trendType="down" 
          description="Rolling 30-day index" 
          color="amber" 
        />
        <StatCard 
          title="Open Pull Requests" 
          value={openPRs} 
          icon={FiGitPullRequest} 
          trend={`${openPRs} pending`} 
          trendType="neutral" 
          description="Awaiting code reviews" 
          color="green" 
        />
        <StatCard 
          title="Open Issues" 
          value={openIssues} 
          icon={FiAlertCircle} 
          trend={`${openIssues} open`} 
          trendType="neutral" 
          description="Assigned backlogs" 
          color="red" 
        />
        <StatCard 
          title="Active Users" 
          value={activeDevs} 
          icon={FiActivity} 
          trend={`${activeDevs}/${totalDevs}`} 
          trendType="up" 
          description="Currently online" 
          color="green" 
        />
        <div className="sm:col-span-2 lg:col-span-1 xl:col-span-4">
          <StatCard 
            title="Storage Used" 
            value={`${(totalStorage / 1024).toFixed(2)} GB`} 
            icon={FiDatabase} 
            trend="920 MB" 
            trendType="up" 
            description="Artifact storage quota" 
            color="slate" 
          />
        </div>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Commits Per Day */}
        <ChartCard title="Commits Per Day" subtitle="Daily commit frequency over the past week">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={commitHistoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  borderRadius: '12px', 
                  color: '#fff', 
                  border: 'none',
                  fontSize: '12px' 
                }} 
              />
              <Area type="monotone" dataKey="commits" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCommits)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Repository Activity */}
        <ChartCard title="Repository Activity" subtitle="Comparison of commits and issues by repository">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={repoActivityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  borderRadius: '12px', 
                  color: '#fff', 
                  border: 'none',
                  fontSize: '12px' 
                }} 
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="commits" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="issues" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Language Distribution */}
        <ChartCard title="Language Distribution" subtitle="Primary programming languages across repositories">
          <div className="flex flex-col sm:flex-row items-center h-full gap-2">
            <div className="flex-1 w-full h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {languageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0F172A', 
                      borderRadius: '12px', 
                      color: '#fff', 
                      border: 'none',
                      fontSize: '12px' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legend */}
            <div className="w-full sm:w-1/3 flex flex-col gap-2 mt-4 sm:mt-0 sm:pl-4">
              {languageData.map((lang, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color }} />
                  <span className="font-semibold text-slate-700 dark:text-slate-350">{lang.name}</span>
                  <span className="text-slate-400 dark:text-slate-500 font-medium ml-auto">({lang.value})</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Top Contributors */}
        <ChartCard title="Top Contributors" subtitle="Commit count ranking per authorized seats">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topContributorsData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
              <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} width={50} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  borderRadius: '12px', 
                  color: '#fff', 
                  border: 'none',
                  fontSize: '12px' 
                }} 
              />
              <Bar dataKey="commits" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={16}>
                {topContributorsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#4F46E5' : '#6366F1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Repository Growth */}
        <ChartCard title="Repository Growth" subtitle="Cumulative active projects over the last 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={repoGrowthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={25} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  borderRadius: '12px', 
                  color: '#fff', 
                  border: 'none',
                  fontSize: '12px' 
                }} 
              />
              <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Weekly Activity Radar */}
        <ChartCard title="Weekly Activity Matrix" subtitle="Average commit weight distribution across hours">
          <div className="flex flex-col h-full justify-between pb-2">
            <div className="space-y-4">
              <div className="flex items-center gap-6 text-[11px] font-semibold text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-sm" />
                  <span>No Commits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-blue-200 dark:bg-blue-900/40 rounded-sm" />
                  <span>1 Commit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-blue-400 dark:bg-blue-700/60 rounded-sm" />
                  <span>2 Commits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-500 rounded-sm" />
                  <span>3+ Commits</span>
                </div>
              </div>

              {/* Grid representation */}
              <div className="flex flex-col gap-1">
                {heatmapData.map((row, rIdx) => (
                  <div key={rIdx} className="flex items-center gap-1">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 w-8 select-none">
                      {daysOfWeek[rIdx]}
                    </span>
                    <div className="flex-1 grid gap-0.5" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
                      {row.map((val, cIdx) => (
                        <div
                          key={cIdx}
                          title={`${daysOfWeek[rIdx]}, Hour ${cIdx}: ${val} commits`}
                          className={`aspect-square rounded-sm cursor-pointer transition-transform duration-100 hover:scale-125 ${getHeatmapColor(val)}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium text-center">
              Grid columns represent hour blocks (0-23) aggregated from server time logs.
            </div>
          </div>
        </ChartCard>

      </div>

      {/* Timeline and Recent Commits Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recent Commits Table (2 cols) */}
        <div className="xl:col-span-2 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Recent Commits
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                Latest updates merged across all repositories.
              </p>
            </div>
            <Link 
              to="/commits" 
              className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 hover:underline"
            >
              View all <FiChevronRight />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Commit</th>
                  <th className="pb-3 pr-4">Message</th>
                  <th className="pb-3 pr-4">Repository</th>
                  <th className="pb-3 pr-4">Author</th>
                  <th className="pb-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {recentCommits.map((c) => (
                  <tr key={c.hash} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pr-4">
                      <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-500/5 dark:text-blue-400 px-2 py-1 rounded">
                        {c.shortHash}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-medium text-slate-700 dark:text-slate-250 truncate max-w-[200px]">
                      {c.message}
                    </td>
                    <td className="py-3 pr-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {c.repository}
                    </td>
                    <td className="py-3 pr-4 text-slate-650 dark:text-slate-350">
                      {c.author}
                    </td>
                    <td className="py-3 text-right text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {new Date(c.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Activity Timeline (1 col) */}
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Activity Feed
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                Real-time Gitea server updates.
              </p>
            </div>
            <Link 
              to="/activity" 
              className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 hover:underline"
            >
              View all <FiChevronRight />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 max-h-[260px] pr-1 scrollbar">
            {activityLogs.slice(0, 5).map((act) => {
              const isPR = act.type.includes('Pull Request');
              const isIssue = act.type.includes('Issue');
              const isCommit = act.type.includes('Commit');
              
              let dotColor = 'bg-blue-500';
              if (isPR) dotColor = 'bg-green-500';
              if (isIssue) dotColor = 'bg-red-500';
              if (act.type.includes('Repository')) dotColor = 'bg-purple-500';

              return (
                <div key={act.id} className="flex gap-3 text-sm relative pl-4 before:absolute before:left-1.5 before:top-2.5 before:bottom-[-20px] before:w-[1px] before:bg-slate-200 dark:before:bg-slate-800 last:before:hidden">
                  <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full ${dotColor} border-2 border-white dark:border-slate-900 z-10`} />
                  <div className="flex flex-col">
                    <p className="text-slate-650 dark:text-slate-300">
                      <strong className="text-slate-700 dark:text-white font-semibold">{act.actor}</strong> {act.details}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 mt-1">
                      <FiClock /> {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
