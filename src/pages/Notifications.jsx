import React, { useState } from 'react';
import { FiBell, FiCheck, FiCheckSquare, FiClock, FiTrash2, FiInfo } from 'react-icons/fi';
import { notifications } from '../data/mockData';

const Notifications = () => {
  const [notificationsList, setNotificationsList] = useState(notifications);
  const [filter, setFilter] = useState('All'); // All or Unread

  const handleMarkRead = (id) => {
    setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotificationsList(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notificationsList.filter(n => {
    if (filter === 'Unread') return !n.read;
    return true;
  });

  const getUnreadCount = () => notificationsList.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Notifications
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">
            Stay updated with commits, branches, issues, and pull request changes.
          </p>
        </div>

        {getUnreadCount() > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-blue-650 hover:text-blue-500 dark:text-blue-400 flex items-center gap-1.5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl shadow-sm transition-all"
          >
            <FiCheckSquare /> Mark all as read
          </button>
        )}
      </div>

      {/* Tabs / Filters */}
      <div className="flex border-b border-slate-205 dark:border-slate-850 gap-4 pb-1">
        <button
          onClick={() => setFilter('All')}
          className={`px-4 py-2 text-xs font-bold transition-all relative border-b-2
            ${filter === 'All' 
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400' 
              : 'border-transparent text-slate-450 hover:text-slate-650'}
          `}
        >
          All Notifications ({notificationsList.length})
        </button>
        <button
          onClick={() => setFilter('Unread')}
          className={`px-4 py-2 text-xs font-bold transition-all relative border-b-2
            ${filter === 'Unread' 
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400' 
              : 'border-transparent text-slate-450 hover:text-slate-650'}
          `}
        >
          Unread ({getUnreadCount()})
        </button>
      </div>

      {/* Notification Cards List */}
      <div className="space-y-3.5">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 bg-white dark:bg-[#1E293B] border rounded-2xl shadow-sm transition-all flex items-center justify-between gap-4 group
                ${notif.read 
                  ? 'border-slate-200/80 dark:border-slate-800/80 opacity-75' 
                  : 'border-blue-200/60 dark:border-blue-900/40 bg-blue-500/5 dark:bg-blue-500/5'}
              `}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl mt-0.5
                  ${notif.read ? 'bg-slate-100 text-slate-450 dark:bg-slate-800' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}
                `}>
                  <FiBell size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-750 dark:text-slate-200 leading-tight">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1.5 flex items-center gap-1">
                    <FiClock /> {new Date(notif.time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {!notif.read && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    title="Mark as read"
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-400 hover:text-green-550 transition-colors"
                  >
                    <FiCheck size={14} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notif.id)}
                  title="Delete notification"
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-850 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-200/80 dark:border-slate-800/80 rounded-3xl bg-white dark:bg-[#1E293B]/20">
            <FiInfo className="text-4xl mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-slate-700 dark:text-white">No notifications</h3>
            <p className="text-xs mt-1">
              {filter === 'Unread' ? 'You have read all system alerts!' : 'Your inbox is currently empty.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Notifications;
