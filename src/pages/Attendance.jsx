import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiClock, FiCheckCircle, FiAlertTriangle, FiMonitor, 
  FiSearch, FiMapPin, FiInfo, FiCheck, FiXCircle, FiPlay, FiSquare 
} from 'react-icons/fi';
import { useOrgInfo, useAttendanceLogs } from '../hooks/useDevTrackQueries';

const Attendance = () => {
  const { data: orgInfo = {} } = useOrgInfo();
  const { data: fetchedLogs = [] } = useAttendanceLogs();

  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  // Clock-in simulation state
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Sync fetched logs into local state so clock-in additions still work
  useEffect(() => {
    if (fetchedLogs.length > 0) setLogs(fetchedLogs);
  }, [fetchedLogs]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const getAuthUser = () => {
    try {
      const auth = JSON.parse(localStorage.getItem('devtrack-auth') || '{}');
      return { username: auth.username || 'user', name: auth.name || 'User' };
    } catch {
      return { username: 'user', name: 'User' };
    }
  };

  // Clock in handler
  const handleClockIn = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsCheckedIn(true);
    setClockInTime(timeStr);
    setClockOutTime(null);
    
    const user = getAuthUser();
    const newLog = {
      id: `att-${Date.now()}`,
      name: user.name,
      username: user.username,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`,
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
      clockIn: timeStr,
      clockOut: '--',
      workHours: 0
    };

    setLogs(prev => [newLog, ...prev.filter(l => !(l.username === user.username && l.date === newLog.date))]);
    triggerToast(`Successfully Clocked In at ${timeStr}`);
  };

  // Clock out handler
  const handleClockOut = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsCheckedIn(false);
    setClockOutTime(timeStr);
    const user = getAuthUser();
    const todayStr = new Date().toISOString().split('T')[0];
    setLogs(prev => prev.map(l => {
      if (l.username === user.username && l.date === todayStr) {
        const inParts = l.clockIn.split(':');
        const outParts = timeStr.split(':');
        const hours = (parseInt(outParts[0]) - parseInt(inParts[0])) + (parseInt(outParts[1]) - parseInt(inParts[1])) / 60;
        return { ...l, clockOut: timeStr, status: 'Present', workHours: Math.max(0, hours).toFixed(1) };
      }
      return l;
    }));
    triggerToast(`Successfully Clocked Out at ${timeStr}`);
  };

  const getStatusColor = (status) => {
    const map = {
      'Present': 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
      'Late': 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
      'Absent': 'bg-red-500/10 text-red-500 border border-red-500/20',
      'Half Day': 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    };
    return map[status] || 'bg-slate-500/10 text-slate-500';
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.username?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const matchesDate = dateFilter === 'All' ||
      (dateFilter === 'Today' && log.date === today) ||
      (dateFilter === 'Yesterday' && log.date === yesterday);
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Summary stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.date === todayStr);
  const presentToday = todayLogs.filter(l => l.status === 'Present' || l.status === 'Late').length;
  const lateToday = todayLogs.filter(l => l.status === 'Late').length;
  const absentToday = todayLogs.filter(l => l.status === 'Absent').length;
  const avgHours = todayLogs.length > 0
    ? (todayLogs.reduce((sum, l) => sum + (parseFloat(l.workHours) || 0), 0) / todayLogs.length).toFixed(1)
    : '0.0';

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl font-semibold"
          >
            <FiCheck /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Attendance</h1>
          <p className="text-sm text-slate-400 mt-1">Track and manage developer attendance</p>
        </div>

        {/* Clock In/Out Button */}
        <div className="flex items-center gap-3">
          {isCheckedIn ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleClockOut}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-lg shadow-red-500/20 transition-all"
            >
              <FiSquare className="text-base" /> Clock Out
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleClockIn}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all"
            >
              <FiPlay className="text-base" /> Clock In
            </motion.button>
          )}
        </div>
      </div>

      {/* Clock In/Out Status Bar */}
      {(isCheckedIn || clockOutTime) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex flex-wrap gap-6 text-sm"
        >
          <div className="flex items-center gap-2 text-emerald-400">
            <FiCheckCircle />
            <span>Clocked In: <strong>{clockInTime || '--'}</strong></span>
          </div>
          {clockOutTime && (
            <div className="flex items-center gap-2 text-red-400">
              <FiXCircle />
              <span>Clocked Out: <strong>{clockOutTime}</strong></span>
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-400">
            <FiMonitor />
            <span className="capitalize">Status: <strong className={isCheckedIn ? 'text-emerald-400' : 'text-slate-300'}>{isCheckedIn ? 'Active' : 'Checked Out'}</strong></span>
          </div>
        </motion.div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Present Today", value: presentToday, icon: FiCheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Late Today", value: lateToday, icon: FiAlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Absent Today", value: absentToday, icon: FiXCircle, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Avg Work Hours", value: `${avgHours}h`, icon: FiClock, color: "text-blue-500", bg: "bg-blue-500/10" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${s.bg}`}>
              <s.icon className={`text-lg ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search developer..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        {['All', 'Today', 'Yesterday'].map(d => (
          <button key={d} onClick={() => setDateFilter(d)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${dateFilter === d ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500'}`}
          >{d}</button>
        ))}
        {['All', 'Present', 'Late', 'Absent', 'Half Day'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500'}`}
          >{s}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                {['Developer', 'Date', 'Status', 'Clock In', 'Clock Out', 'Work Hours'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    {logs.length === 0 ? 'No attendance records yet. Clock in to get started!' : 'No records match your filters.'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={log.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(log.name || 'U')}&background=3b82f6&color=fff`}
                          alt={log.name}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(log.name || 'U')}&background=3b82f6&color=fff`; }}
                        />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white">{log.name}</p>
                          <p className="text-xs text-slate-400">@{log.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{log.date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">{log.clockIn || '--'}</td>
                    <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">{log.clockOut || '--'}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{log.workHours ? `${log.workHours}h` : '--'}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
