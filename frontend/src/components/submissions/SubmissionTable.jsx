import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiMessageSquare, FiEdit3, FiDownloadCloud, FiGithub, FiTrash2 } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

const SubmissionTable = ({
  submissions = [],
  tasksMap = {},
  internsMap = {},
  showInternColumn = false,
  onOpenFeedback,
  onOpenReview, // Admin callback to open the review modal or trigger action
  onDelete,
  userRole = 'ROLE_INTERN',
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDetailsPath = (id) => {
    return userRole === 'ROLE_ADMIN' ? `/admin/submissions/${id}` : `/intern/submissions/${id}`;
  };

  return (
    <div className="overflow-x-auto w-full bg-white rounded-t-xl border-x border-t border-slate-200/80 shadow-sm font-sans animate-in fade-in duration-300">
      <table className="min-w-full divide-y divide-slate-150 text-left text-xs font-semibold text-slate-500">
        <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider select-none">
          <tr>
            <th className="px-6 py-4">Task Name</th>
            {showInternColumn && <th className="px-6 py-4">Intern</th>}
            <th className="px-6 py-4">Submitted Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Feedback</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
          {submissions.map((sub) => {
            const { id, taskId, status, submittedAt, feedback, githubLink, documentLink } = sub;
            const taskTitle = tasksMap[taskId] || 'Loading Task...';
            
            // Resolve intern name
            let internName = 'Unknown Intern';
            if (showInternColumn) {
              // Retrieve from task map if task object has assignedInternId
              internName = internsMap[sub.internId] || 'Intern'; 
            }

            return (
              <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3.5 whitespace-nowrap font-bold text-slate-900 max-w-[220px] truncate" title={taskTitle}>
                  {taskTitle}
                </td>
                {showInternColumn && (
                  <td className="px-6 py-3.5 whitespace-nowrap font-bold text-slate-800">
                    {internName}
                  </td>
                )}
                <td className="px-6 py-3.5 whitespace-nowrap text-slate-500 font-medium">
                  {formatDate(submittedAt)}
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <StatusBadge status={status} />
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap">
                  {feedback ? (
                    <button
                      onClick={() => onOpenFeedback(taskTitle, feedback, status)}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-bold focus:outline-none"
                    >
                      <FiMessageSquare size={13} />
                      <span>Read Feedback</span>
                    </button>
                  ) : (
                    <span className="text-slate-350 italic text-[11px]">No feedback yet</span>
                  )}
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* View Details */}
                    <Link
                      to={getDetailsPath(id)}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <FiEye size={15} />
                    </Link>

                    {/* Edit Option (Intern only, only if Pending or Revision Required) */}
                    {userRole !== 'ROLE_ADMIN' && (status === 'PENDING' || status === 'REVISION_REQUIRED') && (
                      <Link
                        to={`/intern/submissions/${id}/edit`}
                        className="p-1.5 rounded-lg text-amber-650 hover:bg-amber-50 transition-colors cursor-pointer"
                        title="Edit Submission"
                      >
                        <FiEdit3 size={15} />
                      </Link>
                    )}

                    {/* Delete Option (Intern only, only if Pending or Revision Required) */}
                    {userRole !== 'ROLE_ADMIN' && (status === 'PENDING' || status === 'REVISION_REQUIRED') && (
                      <button
                        onClick={() => onDelete(id, taskTitle)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer focus:outline-none"
                        title="Delete Submission"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    )}

                    {/* Links Shortcuts */}
                    {githubLink && (
                      <a
                        href={githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="GitHub repository link"
                      >
                        <FiGithub size={14} />
                      </a>
                    )}

                    {documentLink && (
                      <a
                        href={documentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Documentation link"
                      >
                        <FiDownloadCloud size={14} />
                      </a>
                    )}

                    {/* Admin Review Action */}
                    {userRole === 'ROLE_ADMIN' && status === 'PENDING' && (
                      <button
                        onClick={() => onOpenReview(id, taskTitle, internName)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] transition-colors cursor-pointer shadow-xs flex items-center gap-1 focus:outline-none"
                        title="Review submission"
                      >
                        <FiEdit3 size={11} />
                        <span>Review</span>
                      </button>
                    )}
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

export default SubmissionTable;
