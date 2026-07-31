import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiFolder,
  FiStar,
  FiGitBranch,
  FiUsers,
  FiAlertCircle,
  FiGitPullRequest,
  FiActivity,
  FiBarChart2,
  FiClock,
  FiChevronLeft,
  FiShield,
  FiCornerDownRight,
  FiGitCommit,
  FiExternalLink,
  FiCode,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import {
  useRepoDetail,
  useRepoCommits,
  useRepoBranches,
  useRepoPullRequests,
  useRepoIssues,
  useRepositories,
} from "../hooks/useDevTrackQueries";

const RepoDetails = () => {
  const { owner, name } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data: repo,
    isLoading: isRepoLoading,
    isError: isRepoError,
  } = useRepoDetail(owner, name);
  const { data: repositories = [], isLoading: isReposLoading } =
    useRepositories();
  const { data: commits = [] } = useRepoCommits(owner, name);
  const { data: branches = [] } = useRepoBranches(owner, name);
  const { data: pullRequests = [] } = useRepoPullRequests(owner, name);
  const { data: issues = [] } = useRepoIssues(owner, name);

  const fallbackRepo = repositories.find(
    (item) =>
      (owner && name && item.owner === owner && item.name === name) ||
      (!owner && item.name === name) ||
      item.fullName === `${owner}/${name}`,
  );
  const activeRepo = repo || fallbackRepo;
  const isLoading = isRepoLoading && !activeRepo && isReposLoading;
  const isError = isRepoError && !activeRepo;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          <p className="text-sm text-slate-400">Loading repository...</p>
        </div>
      </div>
    );
  }

  if (isError || !activeRepo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <FiFolder className="text-5xl text-slate-300" />
        <p className="text-slate-500">
          Repository{" "}
          <strong>
            {owner ? `${owner}/` : ""}
            {name}
          </strong>{" "}
          not found.
        </p>
        <Link
          to="/repositories"
          className="text-sm text-blue-500 hover:underline flex items-center gap-1"
        >
          <FiChevronLeft /> Back to Repositories
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: FiFolder, count: null },
    {
      id: "commits",
      label: "Commits",
      icon: FiGitCommit,
      count: commits.length,
    },
    {
      id: "branches",
      label: "Branches",
      icon: FiGitBranch,
      count: branches.length,
    },
    {
      id: "pullRequests",
      label: "Pull Requests",
      icon: FiGitPullRequest,
      count: pullRequests.length,
    },
    {
      id: "issues",
      label: "Issues",
      icon: FiAlertCircle,
      count: issues.length,
    },
    { id: "stats", label: "Stats", icon: FiBarChart2, count: null },
  ];

  // Build commit activity chart — last 7 days
  const today = new Date();
  const dayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", { weekday: "short" });
  });
  const commitActivity = dayLabels.map((label, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const count = commits.filter(
      (c) => c.dateTime && c.dateTime.startsWith(dateStr),
    ).length;
    return { date: label, count };
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div>
        <Link
          to="/repositories"
          className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 w-fit transition-colors mb-3"
        >
          <FiChevronLeft /> Back to Repositories
        </Link>

        {/* Hero */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
              <FiFolder className="text-2xl" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                  {activeRepo.name}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {activeRepo.visibility}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-400 mt-0.5">
                {activeRepo.owner} • {activeRepo.language || "Unknown language"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-sm">
              <FiStar className="text-amber-500" /> {activeRepo.stars}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-sm">
              <FiGitBranch className="text-blue-500" /> {activeRepo.forks} forks
            </span>
            {activeRepo.htmlUrl && (
              <a
                href={activeRepo.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-sm hover:border-blue-500 hover:text-blue-500 transition-all"
              >
                <FiExternalLink /> Gitea
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-1 gap-1 scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all border-b-2 whitespace-nowrap
                ${
                  isActive
                    ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 bg-blue-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
                }`}
            >
              <Icon size={13} />
              {tab.label}
              {tab.count !== null && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5
                  ${isActive ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[400px]">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">
                  About
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
                  {activeRepo.description || "No description available."}
                </p>
                {activeRepo.topics?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {activeRepo.topics.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  {[
                    { label: "Language", value: activeRepo.language || "—" },
                    { label: "Size", value: activeRepo.storageUsed },
                    { label: "Open Issues", value: activeRepo.openIssuesCount },
                    { label: "Visibility", value: activeRepo.visibility },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl"
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {s.label}
                      </span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white mt-1 block">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commit Activity Chart */}
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">
                  Commit activity (last 7 days)
                </h3>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={commitActivity}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="repoCommitGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#2563EB"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2563EB"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#E2E8F0"
                        className="dark:stroke-slate-800"
                      />
                      <XAxis
                        dataKey="date"
                        stroke="#94A3B8"
                        fontSize={11}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#94A3B8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderRadius: "12px",
                          border: "none",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#2563EB"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#repoCommitGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  Repository Info
                </h3>
                {[
                  { label: "Default Branch", value: activeRepo.defaultBranch },
                  {
                    label: "Last Updated",
                    value: activeRepo.lastUpdated
                      ? new Date(activeRepo.lastUpdated).toLocaleDateString()
                      : "—",
                  },
                  { label: "Stars", value: activeRepo.stars },
                  { label: "Forks", value: activeRepo.forks },
                  { label: "Open PRs", value: activeRepo.openPRsCount },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between text-xs font-medium border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0"
                  >
                    <span className="text-slate-400">{label}</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Language badge */}
              {activeRepo.language && (
                <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">
                    Primary Language
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: activeRepo.langColor }}
                    />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {activeRepo.language}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMMITS */}
        {activeTab === "commits" && (
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Commit History
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {commits.length} commits on the default branch
              </p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {commits.length === 0 ? (
                <p className="text-center py-12 text-slate-400 text-sm">
                  No commits found.
                </p>
              ) : (
                commits.map((c) => (
                  <div
                    key={c.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors gap-4"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                        {c.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-mono text-blue-500 bg-blue-500/5 px-2 py-0.5 rounded">
                          {c.shortHash}
                        </span>
                        <span>•</span>
                        <span>{c.author}</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {c.dateTime
                        ? new Date(c.dateTime).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* BRANCHES */}
        {activeTab === "branches" && (
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Branches
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {branches.length} branches
              </p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {branches.length === 0 ? (
                <p className="text-center py-12 text-slate-400 text-sm">
                  No branches found.
                </p>
              ) : (
                branches.map((b) => (
                  <div
                    key={b.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FiGitBranch className="text-slate-400" />
                      <div>
                        <span className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {b.name}
                        </span>
                        {b.latestCommitMsg && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">
                            {b.latestCommitMsg}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {b.protected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <FiShield size={9} /> Protected
                        </span>
                      )}
                      {b.latestCommitHash && (
                        <span className="font-mono text-[10px] text-slate-400">
                          {b.latestCommitHash}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PULL REQUESTS */}
        {activeTab === "pullRequests" && (
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Pull Requests
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {pullRequests.length} open pull requests
              </p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {pullRequests.length === 0 ? (
                <p className="text-center py-12 text-slate-400 text-sm">
                  No open pull requests.
                </p>
              ) : (
                pullRequests.map((pr) => (
                  <div
                    key={pr.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors gap-4"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                        {pr.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{pr.id}</span>
                        <span>•</span>
                        <span>by @{pr.author}</span>
                        {pr.fromBranch && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{pr.fromBranch}</span>
                            <FiCornerDownRight className="text-slate-300" />
                            <span className="font-mono">{pr.toBranch}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap
                      ${pr.status === "Merged" ? "bg-purple-500/10 text-purple-500" : pr.status === "Open" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"}`}
                      >
                        {pr.status}
                      </span>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {pr.createdAt
                          ? new Date(pr.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ISSUES */}
        {activeTab === "issues" && (
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Issues
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {issues.length} open issues
              </p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {issues.length === 0 ? (
                <p className="text-center py-12 text-slate-400 text-sm">
                  No open issues.
                </p>
              ) : (
                issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors gap-4"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                        {issue.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                        <span>{issue.id}</span>
                        <span>•</span>
                        <span>by @{issue.author}</span>
                        {issue.labels?.map((l) => (
                          <span
                            key={l}
                            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-bold"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap
                      ${issue.status === "Closed" ? "bg-slate-100 text-slate-500" : "bg-red-500/10 text-red-500"}`}
                      >
                        {issue.status}
                      </span>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {issue.createdAt
                          ? new Date(issue.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* STATS */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">
                Commits Per Day (last 7 days)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={commitActivity}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E2E8F0"
                      className="dark:stroke-slate-800"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        border: "none",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#6366F1"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">
                Repository Summary
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Total Commits (fetched)",
                    value: commits.length,
                    bar: Math.min((commits.length / 100) * 100, 100),
                    color: "bg-blue-500",
                  },
                  {
                    label: "Open Issues",
                    value: issues.length,
                    bar: Math.min((issues.length / 20) * 100, 100),
                    color: "bg-red-500",
                  },
                  {
                    label: "Open Pull Requests",
                    value: pullRequests.length,
                    bar: Math.min((pullRequests.length / 20) * 100, 100),
                    color: "bg-purple-500",
                  },
                  {
                    label: "Branches",
                    value: branches.length,
                    bar: Math.min((branches.length / 10) * 100, 100),
                    color: "bg-emerald-500",
                  },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        {s.label}
                      </span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold">
                        {s.value}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${s.color} transition-all duration-700`}
                        style={{ width: `${s.bar}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoDetails;
