import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] text-slate-400 dark:text-slate-500 text-xs transition-colors duration-150">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span>© 2026 <strong>DevTrack Enterprise</strong>. Software Development Management System.</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#docs" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Documentation</a>
          <a href="#api" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">API Reference</a>
          <a href="#support" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Support</a>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            v1.4.2-enterprise (stable)
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
