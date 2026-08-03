import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

const DailyLogTable = ({
  logs = [],
  internsMap = {}, // Lookup map of internId -> Full Name (used if showInternName is true)
  showInternName = false,
  onDelete,
  userRole = 'ROLE_INTERN',
}) => {
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
    <div className="overflow-x-auto w-full bg-white rounded-t-xl border-x border-t border-slate-200/80 shadow-sm font-sans">
      <table className="min-w-full divide-y divide-slate-150 text-left text-xs font-semibold text-slate-500">
        <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider select-none">
          <tr>
            <th className="px-6 py-4">Date</th>
            {showInternName && <th className="px-6 py-4">Intern Name</th>}
            <th className="px-6 py-4">Hours Worked</th>
            <th className="px-6 py-4">Completed Work</th>
            <th className="px-6 py-4">Current Work</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
          {logs.map((log) => {
            const { id, date, hoursWorked, completedWork, currentWork, internId } = log;
            const internName = internsMap[internId] || 'Unknown Intern';

            return (
              <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3.5 whitespace-nowrap font-bold text-slate-900">
                  {formatDate(date)}
                </td>
                {showInternName && (
                  <td className="px-6 py-3.5 whitespace-nowrap font-bold text-slate-800">
                    {internName}
                  </td>
                )}
                <td className="px-6 py-3.5 whitespace-nowrap font-semibold text-slate-750">
                  {hoursWorked ? `${hoursWorked.toFixed(1)} hrs` : 'N/A'}
                </td>
                <td className="px-6 py-3.5 max-w-[200px] truncate text-slate-500 font-medium" title={completedWork}>
                  {completedWork}
                </td>
                <td className="px-6 py-3.5 max-w-[200px] truncate text-slate-500 font-medium" title={currentWork}>
                  {currentWork}
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {/* View Details */}
                    <Link
                      to={getDetailsPath(id)}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <FiEye size={15} />
                    </Link>

                    {/* Edit Log (Intern only) */}
                    {userRole !== 'ROLE_ADMIN' && (
                      <Link
                        to={`/intern/logs/${id}/edit`}
                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                        title="Edit Log"
                      >
                        <FiEdit size={15} />
                      </Link>
                    )}

                    {/* Delete Log (Owner Intern or Admin) */}
                    <button
                      onClick={() => onDelete(id, formatDate(date))}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Log"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DailyLogTable;
