import React, { useState, useRef, useEffect } from 'react';
import { FiBell, FiCheckCircle, FiInfo } from 'react-icons/fi';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dummy notifications list
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Task Assigned',
      desc: 'Complete database documentation updates.',
      time: '10 mins ago',
      read: false,
      icon: <FiInfo className="text-blue-500" size={16} />
    },
    {
      id: 2,
      title: 'Feedback Approved',
      desc: 'Your daily log for July 29 has been graded.',
      time: '2 hours ago',
      read: false,
      icon: <FiCheckCircle className="text-emerald-500" size={16} />
    },
    {
      id: 3,
      title: 'Project Update',
      desc: 'Tracker System project scope revised.',
      time: '1 day ago',
      read: true,
      icon: <FiInfo className="text-blue-500" size={16} />
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer text-slate-500 hover:text-slate-700"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-72 sm:w-80 rounded-xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 flex gap-3 transition-colors ${
                    !item.read ? 'bg-blue-50/20 hover:bg-blue-50/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs text-slate-800 leading-normal truncate ${!item.read ? 'font-semibold' : ''}`}>
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5 break-words">
                      {item.desc}
                    </p>
                    <span className="text-[9px] text-slate-400 mt-1 block font-medium">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
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
