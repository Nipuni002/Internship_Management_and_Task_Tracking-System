import React from 'react';
import { FiCheckCircle, FiClock, FiPercent, FiTrendingUp } from 'react-icons/fi';

const DashboardSummary = ({ stats, role }) => {
  if (role === 'ROLE_ADMIN') {
    const activePercent = stats.totalInterns > 0 ? Math.round((stats.activeInterns / stats.totalInterns) * 100) : 0;
    const taskCompletionPercent = (stats.completedTasks + stats.pendingTasks) > 0 
      ? Math.round((stats.completedTasks / (stats.completedTasks + stats.pendingTasks)) * 100) 
      : 0;

    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs font-sans h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h4 className="font-bold text-slate-800 text-sm">System Health Summary</h4>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="space-y-4">
            {/* Active Interns Ratio */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
                <span>Intern Activity Ratio</span>
                <span className="text-blue-600 font-black">{activePercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${activePercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-semibold">
                {stats.activeInterns} out of {stats.totalInterns} total interns are active
              </p>
            </div>

            {/* Tasks Completion Ratio */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
                <span>Task Resolution Rate</span>
                <span className="text-emerald-600 font-black">{taskCompletionPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${taskCompletionPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-semibold">
                {stats.completedTasks} completed / {stats.completedTasks + stats.pendingTasks} total tasks
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-50 pt-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <FiTrendingUp size={18} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-700 leading-none mb-1">Programs Running Smoothly</h5>
            <p className="text-[10px] text-slate-400 font-medium">All database migrations and system API servers are fully optimized.</p>
          </div>
        </div>
      </div>
    );
  }

  // Intern Role
  const assignedTasks = stats.assignedTasks || 0;
  const completedTasks = stats.completedTasks || 0;
  const taskCompletionPercent = assignedTasks > 0 ? Math.round((completedTasks / assignedTasks) * 100) : 0;
  const hoursWorked = stats.dailyLogSummary?.totalHoursWorked || 0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs font-sans h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h4 className="font-bold text-slate-800 text-sm">My Progress Summary</h4>
          <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700 uppercase">
            Active
          </span>
        </div>

        <div className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
              <span>Task Completion</span>
              <span className="text-indigo-600 font-black">{taskCompletionPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${taskCompletionPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-semibold">
              {completedTasks} tasks solved / {assignedTasks} assigned tasks
            </p>
          </div>

          {/* Core performance items */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <FiClock size={13} className="text-amber-500" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Hours Worked</span>
              </div>
              <span className="text-lg font-black text-slate-700">{hoursWorked.toFixed(1)}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <FiCheckCircle size={13} className="text-emerald-500" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Logs Count</span>
              </div>
              <span className="text-lg font-black text-slate-700">{stats.dailyLogSummary?.totalLogsSubmitted || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-50 pt-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
          <FiPercent size={18} />
        </div>
        <div>
          <h5 className="text-xs font-bold text-slate-700 leading-none mb-1">Latest Feedback Received</h5>
          <p className="text-[10px] text-slate-500 font-semibold truncate max-w-[180px]">
            "{stats.latestFeedback || 'No feedback received yet'}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
