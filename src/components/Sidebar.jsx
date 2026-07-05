import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiGrid, FiFolder, FiUsers, FiGitCommit, FiGitBranch, 
  FiGitPullRequest, FiAlertCircle, FiBarChart2, FiActivity, 
  FiBell, FiShield, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight, FiCpu,
  FiClock
} from 'react-icons/fi';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
    { name: 'Repositories', path: '/repositories', icon: FiFolder },
    { name: 'Developers', path: '/developers', icon: FiUsers },
    { name: 'Attendance', path: '/attendance', icon: FiClock },
    { name: 'Commits', path: '/commits', icon: FiGitCommit },
    { name: 'Branches', path: '/branches', icon: FiGitBranch },
    { name: 'Pull Requests', path: '/pull-requests', icon: FiGitPullRequest },
    { name: 'Issues', path: '/issues', icon: FiAlertCircle },
    { name: 'Analytics', path: '/analytics', icon: FiBarChart2 },
    { name: 'Activity', path: '/activity', icon: FiActivity },
    { name: 'Notifications', path: '/notifications', icon: FiBell },
    { name: 'Admin Panel', path: '/admin', icon: FiShield },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('devtrack-auth');
    navigate('/login');
  };

  const sidebarVariants = {
    expanded: { width: '260px' },
    collapsed: { width: '80px' }
  };

  const textVariants = {
    expanded: { opacity: 1, display: 'block', transition: { delay: 0.1 } },
    collapsed: { opacity: 0, display: 'none' }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0F172A] text-slate-300 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="p-2 rounded-lg bg-blue-600 text-white flex-shrink-0">
            <FiCpu className="text-xl" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold text-white tracking-wide whitespace-nowrap"
            >
              DevTrack
            </motion.span>
          )}
        </div>
        
        {/* Toggle Button for Desktop */}
        {!isMobileOpen && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-4 px-3.5 py-3 rounded-lg text-sm font-medium tracking-wide transition-all group duration-150
                ${isActive 
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/10' 
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'}
              `}
            >
              <Icon className="text-lg flex-shrink-0" />
              {!isCollapsed && (
                <motion.span
                  variants={textVariants}
                  initial={isCollapsed ? 'collapsed' : 'expanded'}
                  animate={isCollapsed ? 'collapsed' : 'expanded'}
                >
                  {item.name}
                </motion.span>
              )}
              {isCollapsed && (
                <div className="absolute left-20 ml-2 px-2 py-1 bg-slate-950 text-white text-xs font-semibold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Logout Footer */}
      <div className="p-3 border-t border-slate-800 bg-[#0b1121]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-3.5 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 group"
        >
          <FiLogOut className="text-lg flex-shrink-0" />
          {!isCollapsed && (
            <motion.span
              variants={textVariants}
              initial={isCollapsed ? 'collapsed' : 'expanded'}
              animate={isCollapsed ? 'collapsed' : 'expanded'}
            >
              Logout
            </motion.span>
          )}
          {isCollapsed && (
            <div className="absolute left-20 ml-2 px-2 py-1 bg-red-950 text-red-200 text-xs font-semibold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden md:flex flex-col h-screen sticky top-0 border-r border-slate-200 dark:border-slate-800 z-30"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black z-40"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 w-[260px] z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
