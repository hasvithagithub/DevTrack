import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiBriefcase,
  FiFolder,
  FiGitCommit,
  FiAlertCircle,
  FiGitPullRequest,
  FiChevronLeft,
  FiGlobe,
  FiGitBranch,
  FiStar,
  FiUsers,
  FiExternalLink,
} from "react-icons/fi";
import {
  useDevProfile,
  useDevRepos,
  useAllCommits,
  useDevelopers,
} from "../hooks/useDevTrackQueries";

const DevProfile = () => {
  const { username } = useParams();
  const [activeSubTab, setActiveSubTab] = useState("overview");

  const {
    data: dev,
    isLoading: isDevLoading,
    isError: isDevError,
  } = useDevProfile(username);
  const { data: developers = [], isLoading: isDevelopersLoading } =
    useDevelopers();
  const { data: devRepos = [] } = useDevRepos(username);
  const { data: allCommits = [] } = useAllCommits();

  const fallbackDev = developers.find(
    (item) =>
      item.username?.toLowerCase() === username?.toLowerCase() ||
      item.name?.toLowerCase() === username?.toLowerCase(),
  );
  const activeDev = dev || fallbackDev;
  const isLoading = isDevLoading && !activeDev && isDevelopersLoading;
  const isError = isDevError && !activeDev;

  // Filter commits authored by this user
  const devCommits = allCommits.filter(
    (c) =>
      c.authorUsername === username ||
      c.author?.toLowerCase().includes((activeDev?.name || "").toLowerCase()),
  );

  // Contribution graph (random but seeded by username for consistency)
  const seed = username
    ? username.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
    : 0;
  const pseudo = (i) => ((seed * 9301 + i * 49297) % 233280) / 233280;
  const contributionGrid = Array.from({ length: 7 }, (_, r) =>
    Array.from({ length: 20 }, (_, c) => Math.floor(pseudo(r * 20 + c) * 5)),
  );

  const getContributionColor = (val) => {
    if (val === 0) return "bg-slate-100 dark:bg-slate-800";
    if (val === 1) return "bg-emerald-100 dark:bg-emerald-950/40";
    if (val === 2) return "bg-emerald-300 dark:bg-emerald-800/60";
    if (val === 3) return "bg-emerald-500 dark:bg-emerald-600";
    return "bg-emerald-700 dark:bg-emerald-400";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          <p className="text-sm text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError || !activeDev) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <FiUser className="text-5xl text-slate-300" />
        <p className="text-slate-500">
          Developer <strong>@{username}</strong> not found.
        </p>
        <Link
          to="/developers"
          className="text-sm text-blue-500 hover:underline flex items-center gap-1"
        >
          <FiChevronLeft /> Back to Developers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/developers"
        className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 w-fit transition-colors"
      >
        <FiChevronLeft /> Back to Developers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Profile Card */}
        <div className="lg:col-span-1 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center h-fit">
          <div className="relative">
            <img
              src={activeDev.avatar}
              alt={activeDev.name}
              className="w-28 h-28 rounded-full border-2 border-slate-100 dark:border-slate-800 object-cover shadow-md"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeDev.name)}&background=3b82f6&color=fff&size=128`;
              }}
            />
            <span className="absolute bottom-1 right-2 w-4 h-4 rounded-full border-2 border-white dark:border-[#1E293B] bg-green-500" />
          </div>

          <h2 className="text-lg font-bold text-slate-800 dark:text-white mt-4">
            {activeDev.name}
          </h2>
          <span className="text-xs text-slate-400 font-semibold">
            @{activeDev.username}
          </span>

          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mt-3">
            {activeDev.role}
          </span>

          {activeDev.bio && (
            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-4">
              {activeDev.bio}
            </p>
          )}

          <div className="w-full border-t border-slate-100 dark:border-slate-800 mt-5 pt-4 space-y-3 text-left text-xs font-medium">
            {activeDev.email && (
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <FiMail className="text-slate-400 flex-shrink-0" />
                <span className="truncate">{activeDev.email}</span>
              </div>
            )}
            {activeDev.department && (
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <FiBriefcase className="text-slate-400 flex-shrink-0" />
                <span>{activeDev.department}</span>
              </div>
            )}
            {activeDev.location && (
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <FiMapPin className="text-slate-400 flex-shrink-0" />
                <span>{activeDev.location}</span>
              </div>
            )}
            {activeDev.website && (
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                <FiGlobe className="text-slate-400 flex-shrink-0" />
                <a
                  href={activeDev.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline truncate"
                >
                  {activeDev.website}
                </a>
              </div>
            )}
          </div>

          <div className="w-full border-t border-slate-100 dark:border-slate-800 mt-5 pt-4 grid grid-cols-2 gap-3 text-center text-xs">
            <div>
              <p className="font-bold text-slate-800 dark:text-white text-base">
                {activeDev.followersCount || 0}
              </p>
              <p className="text-slate-400">Followers</p>
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-white text-base">
                {activeDev.followingCount || 0}
              </p>
              <p className="text-slate-400">Following</p>
            </div>
          </div>

          <a
            href={`http://localhost:3000/${activeDev.username}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-all"
          >
            <FiExternalLink /> View on Gitea
          </a>
        </div>

        {/* Right: Activity & Tabs */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Commits",
                value: devCommits.length,
                color: "text-blue-500",
              },
              {
                label: "Repositories",
                value: devRepos.length,
                color: "text-purple-500",
              },
              {
                label: "Open PRs",
                value: devRepos.reduce((s, r) => s + (r.openPRsCount || 0), 0),
                color: "text-green-500",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm text-center"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {s.label}
                </span>
                <span className={`text-2xl font-bold mt-1 block ${s.color}`}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          {/* Contribution Graph */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  Contribution History
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Daily code logs
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                <span>Less</span>
                {[
                  "bg-slate-100 dark:bg-slate-800",
                  "bg-emerald-100",
                  "bg-emerald-300",
                  "bg-emerald-500",
                  "bg-emerald-700",
                ].map((c, i) => (
                  <span key={i} className={`w-2.5 h-2.5 rounded-sm ${c}`} />
                ))}
                <span>More</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 overflow-x-auto pb-2">
              {contributionGrid.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-1 items-center">
                  <span className="text-[9px] text-slate-400 font-bold w-6 select-none">
                    {rIdx === 1
                      ? "Mon"
                      : rIdx === 3
                        ? "Wed"
                        : rIdx === 5
                          ? "Fri"
                          : ""}
                  </span>
                  <div className="flex gap-1">
                    {row.map((val, cIdx) => (
                      <div
                        key={cIdx}
                        title={`${val} contributions`}
                        className={`w-3.5 h-3.5 rounded-sm cursor-pointer transition-transform hover:scale-125 ${getContributionColor(val)}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 pb-1">
            {[
              { id: "overview", label: "Overview" },
              { id: "repos", label: `Repositories (${devRepos.length})` },
              { id: "commits", label: `Commits (${devCommits.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeSubTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[200px]">
            {activeSubTab === "overview" && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                  Repositories
                </h4>
                {devRepos.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">
                    No repositories found.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {devRepos.slice(0, 6).map((repo) => (
                      <Link
                        key={repo.id}
                        to={`/repositories/${repo.owner}/${repo.name}`}
                        className="p-4 border border-slate-150 dark:border-slate-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FiFolder className="text-blue-500" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                              {repo.name}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500">
                            {repo.language}
                          </span>
                        </div>
                        {repo.description && (
                          <p className="text-xs text-slate-400 mt-2 line-clamp-1">
                            {repo.description}
                          </p>
                        )}
                        <div className="flex gap-3 mt-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <FiStar className="text-amber-400" />
                            {repo.stars}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiGitBranch />
                            {repo.forks} forks
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSubTab === "repos" && (
              <div className="space-y-3">
                {devRepos.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">
                    No repositories found.
                  </p>
                ) : (
                  devRepos.map((repo) => (
                    <Link
                      key={repo.id}
                      to={`/repositories/${repo.owner}/${repo.name}`}
                      className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <FiFolder className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {repo.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {repo.description || "No description"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <FiStar className="text-amber-400" />
                          {repo.stars}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-medium">
                          {repo.language}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {activeSubTab === "commits" && (
              <div className="space-y-3">
                {devCommits.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">
                    No commits found for this user.
                  </p>
                ) : (
                  devCommits.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                          {c.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-mono text-blue-500 bg-blue-500/5 px-2 py-0.5 rounded">
                            {c.shortHash}
                          </span>
                          <span>•</span>
                          <span>{c.repository}</span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 ml-4 whitespace-nowrap">
                        {c.dateTime
                          ? new Date(c.dateTime).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevProfile;
