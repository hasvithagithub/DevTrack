import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiSun,
  FiMoon,
  FiMenu,
  FiChevronRight,
  FiFolder,
  FiUsers,
  FiGitCommit,
  FiGitBranch,
  FiGitPullRequest,
  FiAlertCircle,
} from "react-icons/fi";
import { useTheme } from "../hooks/ThemeContext";
import {
  useOrgInfo,
  useRepositories,
  useDevelopers,
  useAllCommits,
  useAllIssues,
  useAllPullRequests,
  useAllBranches,
  useNotifications,
} from "../hooks/useDevTrackQueries";

const Navbar = ({ setIsMobileOpen, isCollapsed }) => {
  const { data: orgInfo = {} } = useOrgInfo();
  const { data: repositories = [] } = useRepositories();
  const { data: developers = [] } = useDevelopers();
  const { data: commits = [] } = useAllCommits();
  const { data: issues = [] } = useAllIssues();
  const { data: pullRequests = [] } = useAllPullRequests();
  const { data: branches = [] } = useAllBranches();
  const { data: notifications = [] } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState(notifications);

  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Breadcrumb generator
  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter((x) => x);
    const breadcrumbs = [{ label: "DevTrack", path: "/dashboard" }];

    let currentPath = "";
    paths.forEach((p, idx) => {
      currentPath += `/${p}`;
      let label = p.charAt(0).toUpperCase() + p.slice(1);

      // Replace path parameters with clean names if possible
      if (idx === 1 && paths[0] === "repositories") {
        const repo = repositories.find(
          (r) => r.name.toLowerCase() === p.toLowerCase(),
        );
        if (repo) label = repo.name;
      } else if (idx === 1 && paths[0] === "developers") {
        const dev = developers.find(
          (d) => d.username.toLowerCase() === p.toLowerCase(),
        );
        if (dev) label = dev.name;
      } else if (label.includes("-")) {
        label = label
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      }

      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  // Perform search querying mock datasets
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const query = searchQuery.toLowerCase();

    const matchedRepos = repositories
      .filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query),
      )
      .slice(0, 3);
    const matchedDevs = developers
      .filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.username.toLowerCase().includes(query),
      )
      .slice(0, 3);
    const matchedCommits = commits
      .filter(
        (c) =>
          c.message.toLowerCase().includes(query) || c.hash.includes(query),
      )
      .slice(0, 3);
    const matchedIssues = issues
      .filter((i) => i.title.toLowerCase().includes(query))
      .slice(0, 3);
    const matchedPRs = pullRequests
      .filter((p) => p.title.toLowerCase().includes(query))
      .slice(0, 3);
    const matchedBranches = branches
      .filter((b) => b.name.toLowerCase().includes(query))
      .slice(0, 3);

    const hasResults =
      matchedRepos.length > 0 ||
      matchedDevs.length > 0 ||
      matchedCommits.length > 0 ||
      matchedIssues.length > 0 ||
      matchedPRs.length > 0 ||
      matchedBranches.length > 0;

    setSearchResults(
      hasResults
        ? {
            repos: matchedRepos,
            devs: matchedDevs,
            commits: matchedCommits,
            issues: matchedIssues,
            prs: matchedPRs,
            branches: matchedBranches,
          }
        : null,
    );
  }, [searchQuery]);

  const handleSearchResultClick = (path) => {
    setSearchQuery("");
    setShowSearchDropdown(false);
    navigate(path);
  };

  const handleMarkAllRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  return (
    <nav className="h-16 px-4 md:px-6 bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20 transition-colors duration-150 shadow-sm">
      {/* Left Area: Menu toggle + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
        >
          <FiMenu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-1 text-sm font-medium">
          <span className="text-slate-400 dark:text-slate-500 font-semibold mr-2 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
            {orgInfo.name}
          </span>
          {getBreadcrumbs().map((bc, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <FiChevronRight className="text-slate-300 dark:text-slate-600" />
              )}
              {idx === getBreadcrumbs().length - 1 ? (
                <span className="text-slate-700 dark:text-slate-200 font-semibold truncate max-w-[120px] md:max-w-xs">
                  {bc.label}
                </span>
              ) : (
                <Link
                  to={bc.path}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {bc.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right Area: Search, Theme, Notifications, Avatar */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Date (Desktop) */}
        <span className="hidden lg:block text-xs font-semibold text-slate-400 dark:text-slate-500">
          {currentDate}
        </span>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative w-40 sm:w-60 md:w-80">
          <div className="relative">
            <input
              type="text"
              placeholder="Search DevTrack..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 dark:text-slate-200"
            />
            <FiSearch className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-600 text-sm" />
          </div>

          {/* Interactive Search Dropdown */}
          {showSearchDropdown && searchQuery.trim() && (
            <div className="absolute right-0 mt-2 w-72 sm:w-96 md:w-[480px] max-h-96 overflow-y-auto bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 scrollbar">
              {searchResults ? (
                <div className="space-y-3 p-1">
                  {/* Repositories */}
                  {searchResults.repos?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                        <FiFolder /> Repositories
                      </h4>
                      {searchResults.repos.map((r) => (
                        <button
                          key={r.id}
                          onClick={() =>
                            handleSearchResultClick(
                              `/repositories/${r.owner}/${r.name}`,
                            )
                          }
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col transition-colors"
                        >
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {r.name}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1">
                            {r.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Developers */}
                  {searchResults.devs?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                        <FiUsers /> Developers
                      </h4>
                      {searchResults.devs.map((d) => (
                        <button
                          key={d.id}
                          onClick={() =>
                            handleSearchResultClick(`/developers/${d.username}`)
                          }
                          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                        >
                          <img
                            src={d.avatar}
                            alt={d.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                              {d.name}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              @{d.username}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Commits */}
                  {searchResults.commits?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                        <FiGitCommit /> Commits
                      </h4>
                      {searchResults.commits.map((c) => (
                        <button
                          key={c.hash}
                          onClick={() =>
                            handleSearchResultClick(`/commits?search=${c.hash}`)
                          }
                          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-1">
                            {c.message}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            <span className="font-mono text-blue-500">
                              {c.shortHash}
                            </span>
                            <span>•</span>
                            <span>{c.repository}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Issues */}
                  {searchResults.issues?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                        <FiAlertCircle /> Issues
                      </h4>
                      {searchResults.issues.map((i) => (
                        <button
                          key={i.id}
                          onClick={() =>
                            handleSearchResultClick(`/issues?search=${i.id}`)
                          }
                          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-1">
                            {i.title}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {i.repository}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Pull Requests */}
                  {searchResults.prs?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                        <FiGitPullRequest /> Pull Requests
                      </h4>
                      {searchResults.prs.map((p) => (
                        <button
                          key={p.id}
                          onClick={() =>
                            handleSearchResultClick(
                              `/pull-requests?search=${p.id}`,
                            )
                          }
                          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-1">
                            {p.title}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {p.repository}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Branches */}
                  {searchResults.branches?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                        <FiGitBranch /> Branches
                      </h4>
                      {searchResults.branches.map((b) => (
                        <button
                          key={b.id}
                          onClick={() =>
                            handleSearchResultClick(
                              `/branches?search=${b.name}`,
                            )
                          }
                          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 font-mono">
                            {b.name}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {b.repository}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-slate-400 dark:text-slate-500">
                  No matching results found for "
                  <span className="font-semibold">{searchQuery}</span>"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          title={
            theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
          }
        >
          {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
        </button>

        {/* Notification Bell Dropdown */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors relative"
          >
            <FiBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Quick Notification Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 scrollbar">
                {notificationsList.length > 0 ? (
                  notificationsList.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        // Mark single as read
                        setNotificationsList((prev) =>
                          prev.map((item) =>
                            item.id === n.id ? { ...item, read: true } : item,
                          ),
                        );
                        navigate("/notifications");
                        setShowNotifications(false);
                      }}
                      className={`p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex gap-3 transition-colors ${!n.read ? "bg-blue-50/20 dark:bg-blue-900/5" : ""}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? "bg-blue-500" : "bg-transparent"}`}
                      />
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2">
                          {n.message}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                          {new Date(n.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-slate-400 dark:text-slate-500">
                    No new notifications.
                  </div>
                )}
              </div>
              <Link
                to="/notifications"
                onClick={() => setShowNotifications(false)}
                className="block text-center text-xs font-bold text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 py-2 border-t border-slate-100 dark:border-slate-800 mt-1"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800" />

        {/* Profile Avatar Dropdown */}
        <Link
          to="/settings"
          className="flex items-center gap-2 hover:opacity-85 transition-opacity"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
            alt="Sarah Wilson Profile"
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"
          />
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
              Sarah Wilson
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Administrator
            </span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
