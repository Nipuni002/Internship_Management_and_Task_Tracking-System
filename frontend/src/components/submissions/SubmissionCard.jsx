import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiMessageSquare, FiEdit3, FiGithub, FiDownloadCloud, FiCalendar, FiTrash2 } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

const SubmissionCard = ({
  submission,
  tasksMap = {},
  internsMap = {},
  showInternName = false,
  onOpenFeedback,
  onOpenReview,
  onDelete,
  userRole = 'ROLE_INTERN',
}) => {
  const { id, taskId, status, submittedAt, feedback, githubLink, documentLink, notes } = submission;
  const taskTitle = tasksMap[taskId] || 'Loading Task...';
  
  let internName = 'Intern';
  if (showInternName) {
    internName = internsMap[submission.internId] || 'Intern';
  }

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
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all font-sans flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
          <div>
            <h4 className="font-bold text-slate-800 text-sm leading-snug" title={taskTitle}>
              {taskTitle}
            </h4>
            {showInternName && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                Intern: {internName}
              </span>
            )}
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Notes Preview */}
        <div className="space-y-3 pb-3">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Completion Notes</span>
            <p className="text-xs text-slate-650 font-medium line-clamp-3 leading-relaxed" title={notes}>
              {notes || <span className="italic text-slate-350">No completion notes logged.</span>}
            </p>
          </div>

          {/* Links Row */}
          {(githubLink || documentLink) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-[10px] font-bold border border-slate-200"
                >
                  <FiGithub size={11} />
                  <span>Repository</span>
                </a>
              )}
              {documentLink && (
                <a
                  href={documentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-[10px] font-bold border border-slate-200"
                >
                  <FiDownloadCloud size={11} />
                  <span>Document</span>
                </a>
              )}
            </div>
          )}

          {/* Feedback Display */}
          <div className="pt-2 border-t border-slate-100">
            {feedback ? (
              <button
                onClick={() => onOpenFeedback(taskTitle, feedback, status)}
                className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-bold focus:outline-none"
              >
                <FiMessageSquare size={13} />
                <span>Read Feedback Notes</span>
              </button>
            ) : (
              <span className="text-slate-350 italic text-[10px]">No feedback yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="border-t border-slate-100 pt-3 mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
          <FiCalendar size={12} />
          <span>{formatDate(submittedAt)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            to={getDetailsPath(id)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
            title="View Details"
          >
            <FiEye size={15} />
          </Link>

          {/* Edit Option (Intern only, only if Pending or Revision Required) */}
          {userRole !== 'ROLE_ADMIN' && (status === 'PENDING' || status === 'REVISION_REQUIRED') && (
            <Link
              to={`/intern/submissions/${id}/edit`}
              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 cursor-pointer transition-colors"
              title="Edit Submission"
            >
              <FiEdit3 size={15} />
            </Link>
          )}

          {/* Delete Option (Intern only, only if Pending or Revision Required) */}
          {userRole !== 'ROLE_ADMIN' && (status === 'PENDING' || status === 'REVISION_REQUIRED') && (
            <button
              onClick={() => onDelete(id, taskTitle)}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors focus:outline-none"
              title="Delete Submission"
            >
              <FiTrash2 size={15} />
            </button>
          )}

          {userRole === 'ROLE_ADMIN' && status === 'PENDING' && (
            <button
              onClick={() => onOpenReview(id, taskTitle, internName)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] transition-colors cursor-pointer flex items-center gap-1 focus:outline-none"
            >
              <FiEdit3 size={11} />
              <span>Review</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;
