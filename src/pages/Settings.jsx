import React, { useState } from 'react';
import { FiUser, FiSettings, FiSliders, FiBell, FiShield, FiCpu, FiKey, FiTerminal, FiDatabase, FiCheck } from 'react-icons/fi';
import { useTheme } from '../hooks/ThemeContext';
import { useOrgInfo } from '../hooks/useDevTrackQueries';

const Settings = () => {
  const { data: orgInfo = {} } = useOrgInfo();
  const { theme, setTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Profile Forms
  const [profName, setProfName] = useState('Sarah Wilson');
  const [profBio, setProfBio] = useState('Senior Frontend Developer focusing on building beautiful UI interfaces.');
  const [profEmail, setProfEmail] = useState('sarah.wilson@company.com');
  const [profLoc, setProfLoc] = useState('Austin, TX');

  // Preferences Form
  const [emailCommits, setEmailCommits] = useState(true);
  const [emailIssues, setEmailIssues] = useState(true);
  const [emailPRs, setEmailPRs] = useState(true);

  // API Form
  const [tokenName, setTokenName] = useState('');
  const [apiTokens, setApiTokens] = useState([
    { id: 1, name: 'Local VSCode', token: 'dt_pat_8f98...a8d1', created: '2026-06-12' },
    { id: 2, name: 'CI/CD Pipeline runner', token: 'dt_pat_2c7d...e9b4', created: '2026-06-25' }
  ]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleAddToken = (e) => {
    e.preventDefault();
    if (!tokenName.trim()) return;

    const randomHash = Math.random().toString(16).substring(2, 8);
    const newToken = {
      id: apiTokens.length + 1,
      name: tokenName,
      token: `dt_pat_${randomHash}...${Math.random().toString(16).substring(2, 6)}`,
      created: new Date().toISOString().split('T')[0]
    };
    setApiTokens(prev => [...prev, newToken]);
    setTokenName('');
  };

  const handleDeleteToken = (id) => {
    setApiTokens(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-505 font-medium mt-1">
          Configure profile details, application preferences, visual themes, and API tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Side: Settings Navigation List */}
        <div className="md:col-span-1 bg-white dark:bg-[#1E293B] border border-slate-205 dark:border-slate-800 rounded-2xl p-4 shadow-sm h-fit space-y-1">
          {[
            { id: 'profile', name: 'Profile Settings', icon: FiUser },
            { id: 'preferences', name: 'Preferences & Theme', icon: FiSliders },
            { id: 'security', name: 'Security & Keys', icon: FiShield },
            { id: 'api', name: 'API Configuration', icon: FiKey },
            { id: 'about', name: 'About DevTrack', icon: FiCpu }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => { setActiveTab(t.id); setSaveSuccess(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all
                  ${activeTab === t.id 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}
                `}
              >
                <Icon size={14} className="flex-shrink-0" />
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Tab Panel contents */}
        <div className="md:col-span-3 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm min-h-[400px] relative">
          
          {saveSuccess && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg animate-bounce">
              <FiCheck /> Settings saved successfully!
            </div>
          )}

          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-base font-bold text-slate-850 dark:text-white">Profile Information</h3>
                <p className="text-xs text-slate-400 font-medium">Update account branding details visible to colleagues.</p>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
                  alt="Sarah Wilson"
                  className="w-16 h-16 rounded-full border object-cover"
                />
                <button
                  type="button"
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold transition-all text-slate-600 dark:text-slate-350"
                  onClick={() => alert("Image upload simulated.")}
                >
                  Change Avatar
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={profName}
                    onChange={(e) => setProfName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none text-slate-750 dark:text-slate-200"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={profEmail}
                    onChange={(e) => setProfEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none text-slate-755 dark:text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Bio Description</label>
                <textarea
                  value={profBio}
                  onChange={(e) => setProfBio(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none text-slate-760 dark:text-slate-200 h-24 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  value={profLoc}
                  onChange={(e) => setProfLoc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none text-slate-765 dark:text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow"
              >
                Save Profile
              </button>
            </form>
          )}

          {/* TAB 2: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-base font-bold text-slate-850 dark:text-white">Workspace Preferences</h3>
                <p className="text-xs text-slate-400 font-medium">Control notifications rules and dark mode defaults.</p>
              </div>

              {/* Theme Settings */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Visual Theme</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`p-4 border rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-slate-300 transition-colors
                      ${theme === 'light' ? 'border-blue-600 bg-blue-500/5 text-blue-600' : 'border-slate-200 dark:border-slate-800'}
                    `}
                  >
                    <span className="w-6 h-6 bg-slate-50 border border-slate-200 rounded-full" />
                    <span className="text-xs font-bold">Light Mode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-4 border rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-slate-350 transition-colors
                      ${theme === 'dark' ? 'border-blue-600 bg-blue-500/5 text-blue-400' : 'border-slate-200 dark:border-slate-800'}
                    `}
                  >
                    <span className="w-6 h-6 bg-slate-900 border border-slate-800 rounded-full" />
                    <span className="text-xs font-bold">Dark Mode</span>
                  </button>
                </div>
              </div>

              {/* Notifications Preferences */}
              <div className="space-y-3.5 pt-4 border-t border-slate-105 dark:border-slate-850">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"><FiBell /> Notification Channels</h4>
                
                <div className="space-y-3">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailCommits}
                      onChange={(e) => setEmailCommits(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded mt-0.5 border-slate-250 focus:ring-0"
                    />
                    <div className="ml-3 flex flex-col">
                      <span className="text-xs font-bold text-slate-750 dark:text-slate-200">Email on Commits</span>
                      <span className="text-[10px] text-slate-400 font-medium">Receive summaries when patches are pushed.</span>
                    </div>
                  </label>

                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailPRs}
                      onChange={(e) => setEmailPRs(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded mt-0.5 border-slate-255 focus:ring-0"
                    />
                    <div className="ml-3 flex flex-col">
                      <span className="text-xs font-bold text-slate-755 dark:text-slate-200">Email on Pull Requests</span>
                      <span className="text-[10px] text-slate-400 font-medium">Receive alerts when merges request reviews.</span>
                    </div>
                  </label>

                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailIssues}
                      onChange={(e) => setEmailIssues(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded mt-0.5 border-slate-260 focus:ring-0"
                    />
                    <div className="ml-3 flex flex-col">
                      <span className="text-xs font-bold text-slate-760 dark:text-slate-200">Email on Assigned Issues</span>
                      <span className="text-[10px] text-slate-400 font-medium">Receive alerts when bugs are assigned to you.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & KEYS */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-base font-bold text-slate-850 dark:text-white">Security & Access Keys</h3>
                <p className="text-xs text-slate-400 font-medium">Manage SSH keys and authorization permissions.</p>
              </div>

              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider flex items-center gap-1.5"><FiTerminal /> SSH Credentials</h4>
                <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/10 text-center">
                  <p className="text-xs text-slate-450 dark:text-slate-500 font-medium mb-3">Add SSH public keys to authenticate Git operations from local terminal.</p>
                  <button
                    type="button"
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all"
                    onClick={() => alert("SSH key input simulated.")}
                  >
                    Add SSH Key
                  </button>
                </div>
              </div>

              <div className="space-y-3.5 pt-4 border-t border-slate-110 dark:border-slate-855">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-850 rounded-2xl">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">Authenticator App</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Use Google Authenticator to secure sign-in.</span>
                  </div>
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow transition-colors"
                    onClick={() => alert("Two-factor config workflow simulated.")}
                  >
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: API CONFIG */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-850 dark:text-white">API Configuration</h3>
                <p className="text-xs text-slate-400 font-medium">Generate Personal Access Tokens to query Gitea web endpoints.</p>
              </div>

              {/* Generate Token Form */}
              <form onSubmit={handleAddToken} className="p-4 border border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl max-w-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-750 dark:text-slate-300">Generate New Token</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Token Name (e.g. CLI tool)"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    className="flex-1 bg-white dark:bg-[#0F172A] border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none text-slate-700 dark:text-slate-200"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </form>

              {/* Tokens Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Active Personal Tokens</h4>
                <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/30">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 font-bold text-slate-450 uppercase bg-slate-50/50 dark:bg-slate-900/50">
                        <th className="p-3">Name</th>
                        <th className="p-3">Token String</th>
                        <th className="p-3">Created Date</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 font-medium text-slate-500">
                      {apiTokens.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                          <td className="p-3 font-bold text-slate-700 dark:text-slate-350">{t.name}</td>
                          <td className="p-3 font-mono text-blue-500">{t.token}</td>
                          <td className="p-3">{t.created}</td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteToken(t.id)}
                              className="text-red-500 hover:underline"
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-600 text-white rounded-3xl shadow-lg shadow-blue-500/20">
                  <FiCpu size={32} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-850 dark:text-white">DevTrack SDMS</h3>
                  <p className="text-xs text-slate-400 font-semibold">Software Development Management System</p>
                  <p className="text-[10px] text-slate-450 dark:text-slate-550 mt-1">Enterprise dashboard for self-hosted Git services.</p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4 max-w-lg text-xs font-medium text-slate-500">
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                  <span>Dashboard Version</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">1.4.2-enterprise</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                  <span>Connected Git Sync Engine</span>
                  <span className="text-green-500 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Synchronized (Gitea v1.21.3)
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                  <span>Frontend Tech Stack</span>
                  <span>React, Tailwind, Recharts, Framer Motion</span>
                </div>
                <div className="flex justify-between">
                  <span>Licensing details</span>
                  <span>Enterprise Multi-seat (Expires Dec 2027)</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Settings;
