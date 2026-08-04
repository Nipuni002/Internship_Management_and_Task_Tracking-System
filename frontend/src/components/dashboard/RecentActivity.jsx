import React from 'react';
import { FiClock, FiFileText, FiUser, FiCheckCircle, FiMessageSquare, FiEdit, FiInfo } from 'react-icons/fi';

const RecentActivity = ({ activities = [] }) => {
  // Helper to calculate relative time
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Recent';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay}d ago`;
    
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const getActivityIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'SUBMISSION':
        return {
          icon: <FiFileText size={14} />,
          bg: 'bg-blue-50 border-blue-100 text-blue-600',
        };
      case 'DAILY_LOG':
        return {
          icon: <FiEdit size={14} />,
          bg: 'bg-amber-50 border-amber-100 text-amber-600',
        };
      case 'TASK_ASSIGNED':
      case 'TASK':
        return {
          icon: <FiUser size={14} />,
          bg: 'bg-violet-50 border-violet-100 text-violet-600',
        };
      case 'COMPLETED':
      case 'TASK_COMPLETED':
        return {
          icon: <FiCheckCircle size={14} />,
          bg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
        };
      case 'FEEDBACK':
        return {
          icon: <FiMessageSquare size={14} />,
          bg: 'bg-rose-50 border-rose-100 text-rose-600',
        };
      default:
        return {
          icon: <FiInfo size={14} />,
          bg: 'bg-slate-50 border-slate-100 text-slate-600',
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs font-sans h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
        <h4 className="font-bold text-slate-800 text-sm">Recent Activity Log</h4>
        <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
          Chronological
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-start">
        {activities && activities.length > 0 ? (
          <div className="relative border-l border-slate-100 ml-3.5 pl-5 space-y-5">
            {activities.map((act, index) => {
              const meta = getActivityIcon(act.type);
              return (
                <div key={index} className="relative group">
                  {/* Timeline dot circle */}
                  <span className={`absolute -left-[30px] top-0.5 w-6 h-6 rounded-full border flex items-center justify-center shadow-xs shrink-0 transition-transform duration-200 group-hover:scale-110 ${meta.bg}`}>
                    {meta.icon}
                  </span>

                  <div>
                    <h5 className="text-xs font-semibold text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">
                      {act.title}
                    </h5>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                      <FiClock size={10} />
                      <span>{formatRelativeTime(act.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-350 mb-3">
              <FiInfo size={20} />
            </div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              No recent updates
            </p>
            <p className="text-[10px] text-slate-350 font-medium max-w-[200px] mt-1">
              Events and workspace milestones will compile here as they occur.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
