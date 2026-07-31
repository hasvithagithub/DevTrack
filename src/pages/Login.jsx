import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCpu, FiUser, FiLock, FiAlertCircle } from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('swilson');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!password.trim()) {
      setError('Please provide your Personal Access Token.');
      return;
    }

    setIsLoading(true);

    try {
      // Call the backend API (which verifies with Gitea)
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: password })
      });

      if (!res.ok) {
        throw new Error('Invalid token or server unreachable');
      }

      const data = await res.json();
      
      // Persist token + user info — the api.js interceptor reads 'token' from this object
      localStorage.setItem('devtrack-auth', JSON.stringify({
        token: password,                                          // ← THE KEY FIX
        username: data.user.login,
        name: data.user.full_name || data.user.login,
        role: data.user.is_admin ? 'Administrator' : 'Developer',
        avatar: data.user.avatar_url,
        email: data.user.email,
      }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 transition-colors duration-200">
      
      {/* Left Column: Visual branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-teal-500/10 blur-[120px]" />

        {/* Top Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <FiCpu className="text-2xl" />
          </div>
          <span className="text-xl font-bold tracking-wider font-sans">DevTrack</span>
        </div>

        {/* Center Text & Mock Code Visual */}
        <div className="my-auto max-w-lg z-10 space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white"
          >
            Software Development Management System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-slate-400 text-base"
          >
            Monitor development activities, oversee repositories, audit commits, track issues, and analyze pull requests across your organization.
          </motion.p>

          {/* Simple Decorative Code Blocks */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-5 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl font-mono text-xs text-blue-400 space-y-2 shadow-2xl"
          >
            <p className="text-slate-500">// Simulating DevTrack-Gitea Sync Engine</p>
            <p><span className="text-purple-400">const</span> devtrack = <span className="text-yellow-400">require</span>(<span className="text-green-300">'@devtrack/core'</span>);</p>
            <p><span className="text-purple-400">await</span> devtrack.<span className="text-yellow-400">sync</span>(&#123; host: <span className="text-green-300">"gitea.local"</span>, interval: <span className="text-green-300">"5s"</span> &#125;);</p>
            <p className="text-green-400">&gt;&gt; Sync complete. 8 Repositories, 342 Commits, 4 Active branches.</p>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="z-10 text-slate-500 text-xs">
          <span>© 2026 DevTrack. Designed for enterprise security.</span>
        </div>
      </div>

      {/* Right Column: Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden"
        >
          {/* Logo header (visible on mobile only) */}
          <div className="flex items-center gap-3 lg:hidden mb-8 justify-center">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <FiCpu className="text-xl" />
            </div>
            <span className="text-lg font-bold">DevTrack</span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              Sign In
            </h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">
              Enter your enterprise credentials below.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2"
            >
              <FiAlertCircle className="flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Token Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Gitea Personal Access Token
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your token..."
                  className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white"
                />
                <FiLock className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-600 text-sm" />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Generate a token in your Gitea Settings &gt; Applications.
              </p>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In with Token</span>
              )}
            </button>
          </form>

        </motion.div>
      </div>

    </div>
  );
};

export default Login;
