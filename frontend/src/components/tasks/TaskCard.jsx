import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2, FiUser, FiFolder, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import TaskStatusBadge from './TaskStatusBadge';
import PriorityBadge from './PriorityBadge';

const TaskCard = ({
  task,
  projectsMap = {},
  internsMap = {},
  onDelete,
  onAssign,
  isAdmin = false,
}) => {
  const { id, title, description, priority, deadline, status, projectId, assignedInternId } = task;

  const projectName = projectsMap[projectId] || `Project (ID: ${projectId?.substring(0, 8)}...)`;
  const internName = internsMap[assignedInternId] || `Intern (ID: ${assignedInternId?.substring(0, 8)}...)`;

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all font-sans flex flex-col justify-between h-full">
      <div>
        {/* Title and Badges */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-bold text-slate-805 text-sm leading-snug line-clamp-1" title={title}>
              {title}
            </h4>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <PriorityBadge priority={priority} />
              <TaskStatusBadge status={status} />
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="py-3.5 space-y-2.5">
          {description && (
            <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mb-1">
              {description}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-650 font-medium">
            <FiFolder className="text-slate-400 shrink-0" size={14} />
            <span className="truncate">{projectName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-650 font-medium">
            <FiUser className="text-slate-400 shrink-0" size={14} />
            <span className="truncate">{internName}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wide bg-slate-50 border border-slate-100 p-2 rounded-lg">
            <FiCalendar size={12} className="text-slate-450 shrink-0" />
            <span>Deadline: {deadline}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2 mt-auto">
        <div>
          {isAdmin && (
            <button
              onClick={() => onAssign(id, title, assignedInternId)}
              className="text-[10px] bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              title="Assign Intern"
            >
              <FiUser size={12} />
              Assign
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            to={isAdmin ? `/admin/tasks/${id}` : `/intern/tasks/${id}`}
            className="p-2 rounded-lg text-blue-650 hover:bg-blue-50 cursor-pointer transition-colors"
            title="View Details"
          >
            <FiEye size={15} />
          </Link>
          {isAdmin && (
            <>
              <Link
                to={`/admin/tasks/${id}/edit`}
                className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 cursor-pointer transition-colors"
                title="Edit Task"
              >
                <FiEdit size={15} />
              </Link>
              <button
                onClick={() => onDelete(id, title)}
                className="p-2 rounded-lg text-rose-650 hover:bg-rose-50 cursor-pointer transition-colors"
                title="Delete Task"
              >
                <FiTrash2 size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
