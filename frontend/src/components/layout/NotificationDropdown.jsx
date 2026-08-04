import React, { useState, useRef, useEffect } from 'react';
import useNotifications from '../../hooks/useNotifications';
import { FiBell, FiCheckCircle, FiInfo, FiFileText, FiCalendar, FiTrash2, FiMessageSquare } from 'react-icons/fi';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications 
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRelativeTime = (timeString) => {
    const date = new Date(timeString);
    const diffMs = new Date() - date;
    const diffMin = Math.floor(diffMs / 1000 / 60);
    const diffHrs = Math.floor(diffMin / 60);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getIcon = (type) => {
    switch (type) {
      case 'SUBMISSION':
        return <FiFileText className="text-blue-500" size={16} />;
      case 'LEAVE':
        return <FiCalendar className="text-amber-500" size={16} />;
      case 'TASK':
        return <FiCheckCircle className="text-violet-500" size={16} />;
      case 'FEEDBACK':
        return <FiMessageSquare className="text-rose-500" size={16} />;
      default:
        return <FiInfo className="text-blue-500" size={16} />;
    }
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white dark:border-slate-900">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-72 sm:w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-lg shadow-slate-200/50 dark:shadow-none py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Notifications</span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Read All
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-[10px] font-semibold text-rose-500 hover:underline cursor-pointer flex items-center gap-0.5"
                  title="Clear All"
                >
                  <FiTrash2 size={10} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-3 flex gap-3 transition-colors cursor-pointer ${
                    !item.read 
                      ? 'bg-blue-50/20 hover:bg-blue-50/40 dark:bg-blue-900/10 dark:hover:bg-blue-900/20' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="mt-0.5 shrink-0 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs text-slate-800 dark:text-slate-200 leading-normal truncate ${!item.read ? 'font-bold' : 'font-medium'}`}>
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-normal mt-0.5 break-words">
                      {item.desc}
                    </p>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 block font-bold uppercase tracking-wide">
                      {getRelativeTime(item.time)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 dark:text-slate-600 text-xs font-semibold">
                No new notifications.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
