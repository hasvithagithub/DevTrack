import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';
import { FiBarChart2, FiCalendar, FiArrowDownRight, FiArrowUpRight, FiClock } from 'react-icons/fi';
import ChartCard from '../components/ChartCard';
import { repositories, developers } from '../data/mockData';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30days');

  // Chart 1: Commits Per Developer
  const commitsPerDev = developers.map(d => ({
    name: d.name.split(' ')[0], // First name only
    commits: d.commitCount,
    prs: d.pullRequests
  })).sort((a, b) => b.commits - a.commits);

  // Chart 2: Commits Per Repository
  const commitsPerRepo = repositories.map(r => ({
    name: r.name,
    commits: r.weeklyCommits * 4, // Monthly projection
    issues: r.openIssuesCount
  }));

  // Chart 3: Weekly Activity (7 days commits/merges/issues)
  const weeklyActivityData = [
    { day: 'Mon', Commits: 14, Merges: 3, Issues: 5 },
    { day: 'Tue', Commits: 22, Merges: 6, Issues: 8 },
    { day: 'Wed', Commits: 18, Merges: 4, Issues: 4 },
    { day: 'Thu', Commits: 28, Merges: 8, Issues: 6 },
    { day: 'Fri', Commits: 35, Merges: 10, Issues: 7 },
    { day: 'Sat', Commits: 8, Merges: 1, Issues: 2 },
    { day: 'Sun', Commits: 12, Merges: 2, Issues: 3 }
  ];

  // Chart 4: Repository Size (Storage Used in MB)
  const repoSizes = repositories.map(r => ({
    name: r.name,
    size: parseInt(r.storageUsed)
  })).sort((a, b) => b.size - a.size);

  // Chart 5: Open vs Closed Issues
  const openClosedIssues = [
    { name: 'EmployeePortal', Open: 3, Closed: 12 },
    { name: 'HRMS', Open: 4, Closed: 15 },
    { name: 'InventorySystem', Open: 2, Closed: 19 },
    { name: 'PayrollSystem', Open: 5, Closed: 8 },
    { name: 'CustomerInsight', Open: 1, Closed: 22 },
    { name: 'DevTrack-CLI', Open: 2, Closed: 14 }
  ];

  // Chart 6: Open vs Closed PRs
  const openClosedPRs = [
    { name: 'EmployeePortal', Open: 2, Merged: 18, Closed: 3 },
    { name: 'HRMS', Open: 1, Merged: 10, Closed: 1 },
    { name: 'InventorySystem', Open: 3, Merged: 14, Closed: 2 },
    { name: 'PayrollSystem', Open: 1, Merged: 8, Closed: 0 },
    { name: 'CustomerInsight', Open: 2, Merged: 25, Closed: 4 },
    { name: 'DevTrack-CLI', Open: 0, Merged: 12, Closed: 1 }
  ];

  // Colors list for Pie
  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Analytics
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">
            Visual statistics and performance charts for DevTrack development activity.
          </p>
        </div>
        
        {/* Time range select filter */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#1E293B] border border-slate-205 dark:border-slate-800 px-3.5 py-2 rounded-xl shadow-sm self-start sm:self-center">
          <FiCalendar className="text-slate-400 text-sm" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-550 dark:text-slate-350 focus:outline-none cursor-pointer"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">PR Merge Velocity</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white mt-2 block">12.5 hours</span>
            <span className="text-xs font-semibold text-green-500 flex items-center gap-0.5 mt-2">
              <FiArrowDownRight /> 3.2 hrs faster vs last month
            </span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <FiClock className="text-xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Code Churn Index</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white mt-2 block">4.2%</span>
            <span className="text-xs font-semibold text-green-500 flex items-center gap-0.5 mt-2">
              <FiArrowDownRight /> 0.8% decrease (less refactoring)
            </span>
          </div>
          <div className="p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
            <FiBarChart2 className="text-xl" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Deployment Freq</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white mt-2 block">8.4 / day</span>
            <span className="text-xs font-semibold text-green-500 flex items-center gap-0.5 mt-2">
              <FiArrowUpRight /> 12% increase vs last sprint
            </span>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <FiBarChart2 className="text-xl" />
          </div>
        </div>
      </div>

      {/* Grid of Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Commits Per Developer */}
        <ChartCard title="Developer Productivity" subtitle="Total commits and pull requests authored by developers">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={commitsPerDev} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-850" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="commits" fill="#2563EB" radius={[4, 4, 0, 0]} name="Commits" />
              <Bar dataKey="prs" fill="#10B981" radius={[4, 4, 0, 0]} name="PRs" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Repository Size */}
        <ChartCard title="Repository Storage Footprint" subtitle="Code base sizes compared (in Megabytes)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={repoSizes} layout="vertical" margin={{ top: 10, right: 10, left: 15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" className="dark:stroke-slate-850" />
              <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={10} tickLine={false} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Bar dataKey="size" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={14} name="Size (MB)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Weekly Activity */}
        <ChartCard title="Weekly Activity Timeline" subtitle="Aggregated event distributions over the weekdays">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCommitsAn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMergesAn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-855" />
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="Commits" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorCommitsAn)" />
              <Area type="monotone" dataKey="Merges" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorMergesAn)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Open vs Closed Issues */}
        <ChartCard title="Issue Resolution Breakdown" subtitle="Open vs closed assigned issues per repository">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={openClosedIssues} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-855" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="Open" fill="#EF4444" radius={[4, 4, 0, 0]} name="Open Issues" />
              <Bar dataKey="Closed" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Closed Issues" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Open vs Closed PRs */}
        <ChartCard title="Pull Request State Breakdown" subtitle="Comparison of open, merged, and closed PRs by repository">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={openClosedPRs} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-855" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="Open" fill="#10B981" radius={[4, 4, 0, 0]} name="Open" />
              <Bar dataKey="Merged" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Merged" />
              <Bar dataKey="Closed" fill="#EF4444" radius={[4, 4, 0, 0]} name="Closed" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Programming Language distribution */}
        <ChartCard title="Environment Language Share" subtitle="Programming languages ratio in active repositories">
          <div className="flex flex-col sm:flex-row items-center h-full justify-center">
            <div className="flex-1 w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'JavaScript', value: 3 },
                      { name: 'Go', value: 2 },
                      { name: 'Java', value: 1 },
                      { name: 'Python', value: 2 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {[1, 2, 3, 4].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full sm:w-1/3 flex flex-col gap-2.5 mt-4 sm:mt-0 sm:pl-4">
              {[
                { name: 'JavaScript (Frontend)', color: COLORS[0], share: '37.5%' },
                { name: 'Go (CLIs & Backends)', color: COLORS[1], share: '25.0%' },
                { name: 'Python (Data Science)', color: COLORS[3], share: '25.0%' },
                { name: 'Java (Microservices)', color: COLORS[2], share: '12.5%' }
              ].map((lang, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                  <span className="font-semibold text-slate-700 dark:text-slate-350">{lang.name}</span>
                  <span className="text-slate-400 dark:text-slate-500 font-bold ml-auto">{lang.share}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

      </div>

    </div>
  );
};

export default Analytics;
