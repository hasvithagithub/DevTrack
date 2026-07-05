import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiClock, FiCheckCircle, FiAlertTriangle, FiMonitor, 
  FiSearch, FiMapPin, FiInfo, FiCheck, FiXCircle, FiPlay, FiSquare 
} from 'react-icons/fi';
import { attendanceLogs, orgInfo } from '../data/mockData';

const Attendance = () => {
  const [logs, setLogs] = useState(attendanceLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  // Clock-in simulation state
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Clock in handler
  const handleClockIn = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsCheckedIn(true);
    setClockInTime(timeStr);
    setClockOutTime(null);
    
    // Add user attendance log to today
    const newLog = {
      id: `att-${Date.now()}`,
      developerId: "dev-2",
      name: "Sarah Wilson",
      username: "swilson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      date: new Date().toISOString().split('T')[0],
      status: "Present",
      clockIn: timeStr,
      clockOut: "--",
      workHours: 0
    };

    setLogs(prev => [newLog, ...prev.filter(l => !(l.username === 'swilson' && l.date === newLog.date))]);
    triggerToast(`Successfully Clocked In at ${timeStr}`);
  };

  // Clock out handler
  const handleClockOut = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsCheckedIn(false);
    setClockOutTime(timeStr);

    const todayStr = new Date().toISOString().split('T')[0];
    setLogs(prev => prev.map(l => {
      if (l.username === 'swilson' && l.date === todayStr) {
        return {
          ...l,
          clockOut: timeStr,
          workHours: 8.5 // Simulated duration
        };
      }
      return l;
    }));
    triggerToast(`Successfully Clocked Out at ${timeStr}`);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Statistics calculation for today (2026-07-05)
  const todayStr = "2026-07-05";
  const todayLogs = logs.filter(l => l.date === todayStr);
  const presentCount = todayLogs.filter(l => l.status === 'Present').length;
  const remoteCount = todayLogs.filter(l => l.status === 'Remote').length;
  const lateCount = todayLogs.filter(l => l.status === 'Late').length;
  const absentCount = todayLogs.filter(l => l.status === 'Absent').length;

  // Filter Attendance Logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === 'Today') matchesDate = log.date === "2026-07-05";
    if (dateFilter === 'Yesterday') matchesDate = log.date === "2026-07-04";

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-green-500/10 text-green-600 dark:text-green-400">
            <FiCheckCircle size={10} /> Present
          </span>
        );
      case 'Remote':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <FiMonitor size={10} /> Remote
          </span>
        );
      case 'Late':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <FiAlertTriangle size={10} /> Late
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400">
            <FiXCircle size={10} /> Absent
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Developer Attendance
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">
            Check-in dashboard, remote telemetry work logs, and team presence indexes.
          </p>
        </div>
      </div>

      {/* Check-in Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-green-500 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 w-fit mx-auto sticky top-4 z-50 border border-green-400"
          >
            <FiCheck size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Console Grid: Active Clock-in Simulator & Organization stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Clock In Simulator */}
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-2">Punch Card Console</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
              Log your working hours. Work hours are registered with location markers based on server telemetry.
            </p>
          </div>

          <div className="my-6 text-center">
            {isCheckedIn ? (
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-slate-800 dark:text-white block animate-pulse">Checked In</span>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 justify-center">
                  <FiClock /> since {clockInTime}
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-slate-400 dark:text-slate-600 block">Not Checked In</span>
                {clockOutTime && (
                  <span className="text-xs font-semibold text-slate-405 flex items-center gap-1 justify-center">
                    Last punch out at {clockOutTime}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {!isCheckedIn ? (
              <button
                onClick={handleClockIn}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all"
              >
                <FiPlay size={14} /> Clock In
              </button>
            ) : (
              <button
                onClick={handleClockOut}
                className="flex-1 py-3 bg-red-500 hover:bg-red-650 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all animate-pulse"
              >
                <FiSquare size={12} /> Clock Out
              </button>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Organization stats today */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-805 dark:text-white mb-1">Organization Presence Index</h3>
            <p className="text-xs text-slate-400 font-medium">Telemetry status updates for today ({todayStr})</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-green-500/5 dark:bg-green-950/10 rounded-2xl border border-green-500/10 text-center">
              <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider block">Office Present</span>
              <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1.5 block">{presentCount}</span>
            </div>
            <div className="p-4 bg-blue-500/5 dark:bg-blue-950/10 rounded-2xl border border-blue-500/10 text-center">
              <span className="text-[10px] font-bold text-blue-650 dark:text-blue-400 uppercase tracking-wider block">Remote Present</span>
              <span className="text-2xl font-bold text-slate-800 dark:text-white mt-1.5 block">{remoteCount}</span>
            </div>
            <div className="p-4 bg-amber-500/5 dark:bg-amber-955/10 rounded-2xl border border-amber-500/10 text-center">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Late Arrivals</span>
              <span className="text-2xl font-bold text-slate-850 dark:text-white mt-1.5 block">{lateCount}</span>
            </div>
            <div className="p-4 bg-red-500/5 dark:bg-red-955/10 rounded-2xl border border-red-500/10 text-center">
              <span className="text-[10px] font-bold text-red-550 dark:text-red-400 uppercase tracking-wider block">Unexcused Absent</span>
              <span className="text-2xl font-bold text-slate-850 dark:text-white mt-1.5 block">{absentCount}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-450 dark:text-slate-500 mt-6 flex items-center gap-1.5">
            <FiInfo /> Presence sync is verified by IP validation matching domain bounds ({orgInfo.domain}).
          </div>
        </div>

      </div>

      {/* Roster logs section */}
      <div className="space-y-4">
        
        {/* Filters */}
        <div className="p-4 bg-white dark:bg-[#1E293B] border border-slate-202/80 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search roster logs by developer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none text-slate-700 dark:text-slate-200"
            />
            <FiSearch className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-655 text-sm" />
          </div>

          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-350 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Remote">Remote</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-350 focus:outline-none"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today (July 5)</option>
              <option value="Yesterday">Yesterday (July 4)</option>
            </select>
          </div>
        </div>

        {/* Logs Table Card */}
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto font-sans">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-450 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                  <th className="px-6 py-4">Developer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Clock In</th>
                  <th className="px-6 py-4">Clock Out</th>
                  <th className="px-6 py-4 text-center">Work Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src={log.avatar} alt={log.name} className="w-8 h-8 rounded-full object-cover" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700 dark:text-white">{log.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">@{log.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                        {log.date}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-650 dark:text-slate-350">
                        {log.clockIn}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-650 dark:text-slate-350">
                        {log.clockOut}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-705 dark:text-slate-300">
                        {log.workHours > 0 ? `${log.workHours} hrs` : '--'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-450 dark:text-slate-500">
                      No attendance logs found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Attendance;
