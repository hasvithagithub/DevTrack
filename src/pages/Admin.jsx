import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiShield, FiUserPlus, FiFolderPlus, FiUsers, FiFolder, FiLock, FiUnlock, FiTrash2, FiFileText, FiInfo, FiKey } from 'react-icons/fi';
import Modal from '../components/Modal';
import { developers, repositories, auditLogs, orgInfo } from '../data/mockData';

const Admin = () => {
  const [searchParams] = useSearchParams();
  const defaultAction = searchParams.get('action') || '';

  const [activeSubTab, setActiveSubTab] = useState('users');
  const [usersList, setUsersList] = useState(developers);
  const [reposList, setReposList] = useState(repositories);
  const [audits, setAudits] = useState(auditLogs);
  
  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);
  
  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Senior Frontend Developer');

  // New Repo Form State
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDesc, setNewRepoDesc] = useState('');
  const [newRepoLang, setNewRepoLang] = useState('JavaScript');
  const [newRepoVis, setNewRepoVis] = useState('Private');

  useEffect(() => {
    if (defaultAction === 'create-user') {
      setActiveSubTab('users');
      setIsUserModalOpen(true);
    } else if (defaultAction === 'create-repo') {
      setActiveSubTab('repos');
      setIsRepoModalOpen(true);
    }
  }, [defaultAction]);

  // Handler: Add User
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserUsername.trim() || !newUserEmail.trim()) return;

    const newDev = {
      id: `dev-${usersList.length + 1}`,
      name: newUserName,
      username: newUserUsername,
      email: newUserEmail,
      role: newUserRole,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", // default avatar
      repoCount: 0,
      commitCount: 0,
      issuesAssigned: 0,
      pullRequests: 0,
      lastActive: new Date().toISOString(),
      status: 'Active'
    };

    setUsersList(prev => [newDev, ...prev]);
    
    // Add audit log
    const audit = {
      id: `aud-${audits.length + 1}`,
      action: "User Created",
      user: "Admin",
      target: `${newUserName} (${newUserUsername})`,
      ip: "192.168.12.45",
      dateTime: new Date().toISOString()
    };
    setAudits(prev => [audit, ...prev]);

    // Reset Form
    setNewUserName('');
    setNewUserUsername('');
    setNewUserEmail('');
    setIsUserModalOpen(false);
  };

  // Handler: Delete User
  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the organization?`)) {
      setUsersList(prev => prev.filter(u => u.id !== id));
      
      const audit = {
        id: `aud-${audits.length + 1}`,
        action: "User Deleted",
        user: "Admin",
        target: name,
        ip: "192.168.12.45",
        dateTime: new Date().toISOString()
      };
      setAudits(prev => [audit, ...prev]);
    }
  };

  // Handler: Add Repo
  const handleAddRepo = (e) => {
    e.preventDefault();
    if (!newRepoName.trim()) return;

    const newRepo = {
      id: `repo-${reposList.length + 1}`,
      name: newRepoName,
      description: newRepoDesc,
      owner: orgInfo.name,
      visibility: newRepoVis,
      language: newRepoLang,
      langColor: newRepoLang === 'Go' ? '#00ADD8' : newRepoLang === 'Python' ? '#3572A5' : newRepoLang === 'Java' ? '#b07219' : '#f1e05a',
      stars: 0,
      forks: 0,
      branchesCount: 1,
      contributorsCount: 1,
      openIssuesCount: 0,
      openPRsCount: 0,
      lastUpdated: new Date().toISOString(),
      storageUsed: "12 MB",
      contributors: ["swilson"]
    };

    setReposList(prev => [newRepo, ...prev]);

    const audit = {
      id: `aud-${audits.length + 1}`,
      action: "Repo Created",
      user: "Admin",
      target: newRepoName,
      ip: "192.168.12.45",
      dateTime: new Date().toISOString()
    };
    setAudits(prev => [audit, ...prev]);

    // Reset Form
    setNewRepoName('');
    setNewRepoDesc('');
    setIsRepoModalOpen(false);
  };

  // Handler: Toggle Repo Visibility
  const toggleVisibility = (id, currentVis) => {
    const nextVis = currentVis === 'Private' ? 'Public' : 'Private';
    setReposList(prev => prev.map(r => r.id === id ? { ...r, visibility: nextVis } : r));
    
    const targetRepo = reposList.find(r => r.id === id);
    const audit = {
      id: `aud-${audits.length + 1}`,
      action: "Repo Permission Change",
      user: "Admin",
      target: `${targetRepo ? targetRepo.name : 'Repo'} set to ${nextVis.toUpperCase()}`,
      ip: "192.168.12.45",
      dateTime: new Date().toISOString()
    };
    setAudits(prev => [audit, ...prev]);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Admin Panel
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-505 font-medium mt-1">
          Configure users, repository access rights, license allocations, and inspect audit logs.
        </p>
      </div>

      {/* Admin Tab Nav */}
      <div className="flex border-b border-slate-205 dark:border-slate-850 gap-2 pb-1 overflow-x-auto scrollbar">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap
            ${activeSubTab === 'users' ? 'border-blue-650 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-450 hover:text-slate-650'}
          `}
        >
          <FiUsers size={14} /> Users & Roles
        </button>
        <button
          onClick={() => setActiveSubTab('repos')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap
            ${activeSubTab === 'repos' ? 'border-blue-655 text-blue-605 dark:text-blue-405' : 'border-transparent text-slate-450 hover:text-slate-655'}
          `}
        >
          <FiFolder size={14} /> Manage Repositories
        </button>
        <button
          onClick={() => setActiveSubTab('audits')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap
            ${activeSubTab === 'audits' ? 'border-blue-660 text-blue-610 dark:text-blue-410' : 'border-transparent text-slate-450 hover:text-slate-660'}
          `}
        >
          <FiFileText size={14} /> Audit Logs
        </button>
        <button
          onClick={() => setActiveSubTab('org')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap
            ${activeSubTab === 'org' ? 'border-blue-665 text-blue-615 dark:text-blue-415' : 'border-transparent text-slate-450 hover:text-slate-665'}
          `}
        >
          <FiShield size={14} /> Organization Settings
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[400px]">
        
        {/* TAB 1: USERS & ROLES */}
        {activeSubTab === 'users' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Active Seats ({usersList.length})</h3>
                <p className="text-xs text-slate-400 font-medium">Add, remove, or modify roles of development staff.</p>
              </div>
              
              <button
                onClick={() => setIsUserModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow"
              >
                <FiUserPlus /> Create User
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-450 uppercase tracking-wider">
                    <th className="pb-3 pr-4">User</th>
                    <th className="pb-3 pr-4">Role</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Repositories</th>
                    <th className="pb-3 pr-4">Gitea Sync Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {usersList.map(dev => (
                    <tr key={dev.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="py-3.5 pr-4 flex items-center gap-3">
                        <img src={dev.avatar} alt={dev.name} className="w-8 h-8 rounded-full object-cover" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700 dark:text-white">{dev.name}</span>
                          <span className="text-[10px] text-slate-400">@{dev.username}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <select
                          value={dev.role}
                          onChange={(e) => {
                            setUsersList(prev => prev.map(u => u.id === dev.id ? { ...u, role: e.target.value } : u));
                            // add audit log
                            const audit = {
                              id: `aud-${audits.length + 1}`,
                              action: "Role Assigned",
                              user: "Admin",
                              target: `${dev.name} -> ${e.target.value}`,
                              ip: "192.168.12.45",
                              dateTime: new Date().toISOString()
                            };
                            setAudits(prev => [audit, ...prev]);
                          }}
                          className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-xs font-semibold focus:outline-none"
                        >
                          <option value="Lead Architect">Lead Architect</option>
                          <option value="Senior Frontend Developer">Senior Frontend Developer</option>
                          <option value="Senior Backend Developer">Senior Backend Developer</option>
                          <option value="DevOps Lead">DevOps Lead</option>
                          <option value="Full Stack Engineer">Full Stack Engineer</option>
                          <option value="QA Automation Engineer">QA Automation Engineer</option>
                        </select>
                      </td>
                      <td className="py-3.5 pr-4 text-xs font-semibold text-slate-500">{dev.email}</td>
                      <td className="py-3.5 pr-4 font-semibold text-slate-700 dark:text-slate-350">{dev.repoCount || 0}</td>
                      <td className="py-3.5 pr-4 text-xs">
                        <span className="inline-flex items-center gap-1.5 font-bold text-green-500">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Synchronized
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteUser(dev.id, dev.name)}
                          className="p-1 text-slate-450 hover:text-red-650 transition-colors"
                          title="Delete User"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE REPOSITORIES */}
        {activeSubTab === 'repos' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Tracked Repositories ({reposList.length})</h3>
                <p className="text-xs text-slate-400 font-medium">Control repository flags and project visibilities.</p>
              </div>
              
              <button
                onClick={() => setIsRepoModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow"
              >
                <FiFolderPlus /> Create Repository
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-450 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Repository</th>
                    <th className="pb-3 pr-4">Language</th>
                    <th className="pb-3 pr-4">Contributors</th>
                    <th className="pb-3 pr-4">Visibility</th>
                    <th className="pb-3 pr-4">Lock Config</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {reposList.map(repo => (
                    <tr key={repo.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="py-3.5 pr-4 flex items-center gap-2">
                        <FiFolder className="text-blue-500" />
                        <span className="text-sm font-bold text-slate-700 dark:text-white">{repo.name}</span>
                      </td>
                      <td className="py-3.5 pr-4 text-xs font-semibold text-slate-500">{repo.language}</td>
                      <td className="py-3.5 pr-4 font-semibold text-slate-700 dark:text-slate-350">{repo.contributorsCount}</td>
                      <td className="py-3.5 pr-4 text-xs font-bold">
                        <span className={`px-2 py-0.5 rounded ${repo.visibility === 'Private' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                          {repo.visibility}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <button
                          onClick={() => toggleVisibility(repo.id, repo.visibility)}
                          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-450 hover:underline"
                        >
                          {repo.visibility === 'Private' ? (
                            <><FiUnlock /> Make Public</>
                          ) : (
                            <><FiLock /> Make Private</>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete repository ${repo.name}? This action is simulated.`)) {
                              setReposList(prev => prev.filter(r => r.id !== repo.id));
                            }
                          }}
                          className="p-1 text-slate-450 hover:text-red-650 transition-colors"
                          title="Delete Repository"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOGS */}
        {activeSubTab === 'audits' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-850 dark:text-white">Admin Audit Logs</h3>
              <p className="text-xs text-slate-400 font-medium">Track modifications made to users and access tokens.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-450 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Action</th>
                    <th className="pb-3 pr-4">Triggered By</th>
                    <th className="pb-3 pr-4">Target Item</th>
                    <th className="pb-3 pr-4">IP Address</th>
                    <th className="pb-3 text-right">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {audits.map(audit => (
                    <tr key={audit.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-xs">
                      <td className="py-3 pr-4">
                        <span className="font-bold text-slate-700 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded">
                          {audit.action}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-semibold text-slate-650 dark:text-slate-350">{audit.user}</td>
                      <td className="py-3 pr-4 font-medium text-slate-500">{audit.target}</td>
                      <td className="py-3 pr-4 font-mono text-slate-400">{audit.ip}</td>
                      <td className="py-3 text-right text-slate-400 font-medium">
                        {new Date(audit.dateTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ORG SETTINGS */}
        {activeSubTab === 'org' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-base font-bold text-slate-850 dark:text-white">Organization Configuration</h3>
              <p className="text-xs text-slate-400 font-medium font-sans">Manage corporate workspace policies.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert("Simulated: Org settings saved."); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    defaultValue={orgInfo.name}
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none text-slate-750 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">Domain Lock</label>
                  <input
                    type="text"
                    defaultValue={orgInfo.domain}
                    className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none text-slate-755 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-460 dark:text-slate-500 uppercase tracking-wider">Plan Level</label>
                  <input
                    type="text"
                    disabled
                    value={orgInfo.plan}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-465 dark:text-slate-500 uppercase tracking-wider">License Expiry</label>
                  <input
                    type="text"
                    disabled
                    value={new Date(orgInfo.licenseExpires).toLocaleDateString()}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-4">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><FiKey /> Global API Sync Token</h4>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs text-blue-500 select-all break-all">
                  dt_ent_sync_9a48b327fe01ccdd923485ba83c21a4f00db12
                </div>
                <p className="text-[10px] text-slate-450 dark:text-slate-500">Provide this token to Gitea server webhook hooks to authorize sync channels.</p>
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition-colors"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

      </div>

      {/* MODAL 1: ADD USER FORM */}
      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Create New Seat Account">
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Richard Hendricks"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none text-slate-750 dark:text-slate-200"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Username</label>
            <input
              type="text"
              placeholder="e.g. rhendricks"
              value={newUserUsername}
              onChange={(e) => setNewUserUsername(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none text-slate-750 dark:text-slate-200"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none text-slate-750 dark:text-slate-200"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Organization Role</label>
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none"
            >
              <option value="Lead Architect">Lead Architect</option>
              <option value="Senior Frontend Developer">Senior Frontend Developer</option>
              <option value="Senior Backend Developer">Senior Backend Developer</option>
              <option value="DevOps Lead">DevOps Lead</option>
              <option value="Full Stack Engineer">Full Stack Engineer</option>
              <option value="QA Automation Engineer">QA Automation Engineer</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
            <button
              type="button"
              onClick={() => setIsUserModalOpen(false)}
              className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: ADD REPO FORM */}
      <Modal isOpen={isRepoModalOpen} onClose={() => setIsRepoModalOpen(false)} title="Create Organization Repository">
        <form onSubmit={handleAddRepo} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Repository Name</label>
            <input
              type="text"
              placeholder="e.g. BillingEngine"
              value={newRepoName}
              onChange={(e) => setNewRepoName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none text-slate-750 dark:text-slate-200"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Description</label>
            <textarea
              placeholder="Brief summary of what this codebase contains..."
              value={newRepoDesc}
              onChange={(e) => setNewRepoDesc(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none text-slate-755 dark:text-slate-200 h-24 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Primary Language</label>
              <select
                value={newRepoLang}
                onChange={(e) => setNewRepoLang(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none"
              >
                <option value="JavaScript">JavaScript</option>
                <option value="Go">Go</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Initial Visibility</label>
              <select
                value={newRepoVis}
                onChange={(e) => setNewRepoVis(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none"
              >
                <option value="Private">Private</option>
                <option value="Public">Public</option>
                <option value="Internal">Internal</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
            <button
              type="button"
              onClick={() => setIsRepoModalOpen(false)}
              className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-455 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow"
            >
              Create Repository
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Admin;
