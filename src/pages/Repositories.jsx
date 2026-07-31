import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiFolder,
  FiStar,
  FiGitBranch,
  FiUsers,
  FiAlertCircle,
  FiGitPullRequest,
  FiClock,
  FiSearch,
  FiEye,
  FiPlus,
  FiTag,
} from "react-icons/fi";
import { useRepositories } from "../hooks/useDevTrackQueries";

const Repositories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [sortBy, setSortBy] = useState("stars");

  const { data: repositories = [], isLoading, error } = useRepositories();

  // Languages list for filter dropdown
  const languages = ["All", ...new Set(repositories.map((r) => r.language))];

  // Filter and Sort Repos
  const filteredRepos = repositories
    .filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVisibility =
        visibilityFilter === "All" || repo.visibility === visibilityFilter;
      const matchesLanguage =
        languageFilter === "All" || repo.language === languageFilter;

      return matchesSearch && matchesVisibility && matchesLanguage;
    })
    .sort((a, b) => {
      if (sortBy === "stars") return b.stars - a.stars;
      if (sortBy === "updated")
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      return a.name.localeCompare(b.name);
    });

  const getVisibilityColor = (vis) => {
    switch (vis) {
      case "Public":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "Private":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    }
  };

  const containerVariants = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Repositories
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">
            Browse and manage software repositories hosted on your company
            servers.
          </p>
        </div>

        {/* Simulate New Repo creation (Modal UI trigger or admin navigation) */}
        <Link
          to="/admin?action=create-repo"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-blue-500/10 transition-all self-start sm:self-center"
        >
          <FiPlus />
          <span>New Repository</span>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl border border-red-200 dark:border-red-800">
          Failed to load repositories. Is the backend running?
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Search and Filters Bar */}
          <div className="p-4 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search repositories by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 dark:text-slate-200"
              />
              <FiSearch className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-650 text-sm" />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Visibility */}
              <div className="flex flex-col gap-1">
                <select
                  value={visibilityFilter}
                  onChange={(e) => setVisibilityFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="All">All Visibilities</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Internal">Internal</option>
                </select>
              </div>

              {/* Language */}
              <div className="flex flex-col gap-1">
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="All">All Languages</option>
                  {languages
                    .filter((l) => l !== "All")
                    .map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex flex-col gap-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-350 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="stars">Sort: Stars</option>
                  <option value="updated">Sort: Last Updated</option>
                  <option value="name">Sort: Name</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid of Repository Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredRepos.length > 0 ? (
              filteredRepos.map((repo) => (
                <motion.div
                  key={repo.id}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.15 } }}
                  className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Card Top: Title, Owner, Visibility */}
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <FiFolder className="text-xl text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <Link
                          to={`/repositories/${repo.owner}/${repo.name}`}
                          className="text-base font-bold text-slate-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors tracking-tight"
                        >
                          {repo.name}
                        </Link>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getVisibilityColor(repo.visibility)}`}
                      >
                        {repo.visibility}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">
                      owned by {repo.owner}
                    </span>

                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-3 line-clamp-2 min-h-[32px]">
                      {repo.description || "No description provided."}
                    </p>
                  </div>

                  {/* Card Middle: Language Indicator & Stats */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    {/* Language Badge */}
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: repo.langColor }}
                      />
                      <span className="text-xs font-semibold text-slate-550 dark:text-slate-400">
                        {repo.language}
                      </span>
                    </div>

                    {/* Stars & Forks */}
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-450 dark:text-slate-500">
                      <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
                        <FiStar /> {repo.stars}
                      </span>
                      <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
                        <FiGitBranch /> {repo.forks}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer: Metadata Grid */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Branches
                      </span>
                      <span className="text-sm font-bold text-slate-700 dark:text-white mt-0.5">
                        {repo.branchesCount}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Issues
                      </span>
                      <span className="text-sm font-bold text-red-500 mt-0.5">
                        {repo.openIssuesCount}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        PRs
                      </span>
                      <span className="text-sm font-bold text-green-500 mt-0.5">
                        {repo.openPRsCount}
                      </span>
                    </div>
                  </div>

                  {/* Final Link row */}
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                      <FiClock /> updated{" "}
                      {new Date(repo.lastUpdated).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>

                    <Link
                      to={`/repositories/${repo.owner}/${repo.name}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 flex items-center gap-1"
                    >
                      <FiEye />
                      <span>Inspect</span>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-[#1E293B]/20">
                <FiFolder className="text-4xl mx-auto mb-3 opacity-60" />
                <h3 className="text-base font-bold text-slate-700 dark:text-white">
                  No repositories found
                </h3>
                <p className="text-xs mt-1">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Repositories;
