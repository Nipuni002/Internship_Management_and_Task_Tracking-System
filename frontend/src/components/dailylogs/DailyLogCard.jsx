import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2, FiClock, FiBookOpen } from 'react-icons/fi';

const DailyLogCard = ({
  log,
  internsMap = {},
  showInternName = false,
  onDelete,
  userRole = 'ROLE_INTERN',
}) => {
  const { id, date, hoursWorked, completedWork, currentWork, internId } = log;
  const internName = internsMap[internId] || 'Unknown Intern';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const getDetailsPath = (id) => {
    return userRole === 'ROLE_ADMIN' ? `/admin/logs/${id}` : `/intern/logs/${id}`;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all font-sans flex flex-col justify-between">
      <div>
        {/* Top Header: Date and Hours */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
          <div>
            <h4 className="font-bold text-slate-800 text-sm leading-snug">{formatDate(date)}</h4>
            {showInternName && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                Intern: {internName}
              </span>
            )}
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 gap-1 shrink-0">
            <FiClock size={10} />
            {hoursWorked ? `${hoursWorked.toFixed(1)} hrs` : 'N/A'}
          </span>
        </div>

        {/* Content Preview */}
        <div className="space-y-3 py-1">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide">Completed Work</span>
            <p className="text-xs text-slate-600 font-medium line-clamp-3 leading-relaxed" title={completedWork}>
              {completedWork}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide">Current Work</span>
            <p className="text-xs text-slate-600 font-medium line-clamp-3 leading-relaxed" title={currentWork}>
              {currentWork}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-slate-100 pt-3 flex items-center justify-end gap-2 mt-4">
        <Link
          to={getDetailsPath(id)}
          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
          title="View Details"
        >
          <FiEye size={15} />
        </Link>

        {userRole !== 'ROLE_ADMIN' && (
          <Link
            to={`/intern/logs/${id}/edit`}
            className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 cursor-pointer transition-colors"
            title="Edit Log"
          >
            <FiEdit size={15} />
          </Link>
        )}

        <button
          onClick={() => onDelete(id, formatDate(date))}
          className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
          title="Delete Log"
        >
          <FiTrash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default DailyLogCard;
