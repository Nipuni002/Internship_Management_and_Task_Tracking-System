import React from 'react';
import { FiCalendar, FiClock } from 'react-icons/fi';

const DashboardHeader = ({ title, user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const name = user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName}` : 'Guest');
  const roleName = user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Intern';

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs mb-6 font-sans relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Background Decorative Blob */}
      <div className="absolute right-0 top-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-blue-50/40 blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 -mb-10 w-64 h-64 rounded-full bg-indigo-50/30 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wide uppercase border border-blue-100/50 inline-block mb-3">
          {roleName} Portal
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-snug">
          {getGreeting()}, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{name}</span>!
        </h1>
        <p className="text-slate-500 text-sm mt-1.5 font-medium max-w-xl leading-relaxed">
          {user?.role === 'ROLE_ADMIN' 
            ? 'Manage internship programs, review task submissions, monitor projects progress, and provide feedback.'
            : 'Track your assigned tasks, submit work updates, log daily activities, and review feedback.'}
        </p>
      </div>

      <div className="relative z-10 shrink-0 flex flex-col items-start md:items-end gap-1.5 bg-slate-50 md:bg-transparent border border-slate-100 md:border-0 p-4 md:p-0 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <FiCalendar className="text-blue-500" size={14} />
          <span>{formatDate()}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
          <FiClock className="text-slate-400" size={12} />
          <span>Task Tracker System v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
