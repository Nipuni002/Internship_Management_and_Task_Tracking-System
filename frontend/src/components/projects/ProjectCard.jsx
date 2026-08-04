import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2, FiUserPlus, FiCalendar, FiBookOpen, FiX } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

const ProjectCard = ({
  project,
  internsMap = {},
  onDelete,
  onAssignInterns,
  onRemoveIntern,
}) => {
  const {
    id,
    title,
    description,
    technology = [],
    deadline,
    status,
    assignedInternIds = [],
  } = project;

  const formattedDeadline = deadline ? new Date(deadline).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'No deadline';

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all font-sans flex flex-col justify-between">
      <div>
        {/* Top: title and status */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-bold text-slate-800 text-sm leading-snug">{title}</h4>
          </div>
          <div className="shrink-0">
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Info details */}
        <div className="py-3.5 space-y-3">
          {/* Description */}
          <p className="text-xs text-slate-500 font-medium line-clamp-3 leading-relaxed">
            {description || <span className="text-slate-350 italic">No description available</span>}
          </p>

          {/* Tech Stack */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tech Stack</span>
            <div className="flex flex-wrap gap-1">
              {technology && technology.length > 0 ? (
                technology.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold"
                  >
                    {tech}
                  </span>
                ))
              ) : (
                <span className="text-slate-350 italic font-semibold text-[10px]">None</span>
              )}
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wide bg-slate-50 border border-slate-100 p-2 rounded-lg">
            <FiCalendar size={12} className="text-slate-400 shrink-0" />
            <span>Deadline: {formattedDeadline}</span>
          </div>

          {/* Assigned Interns */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Assigned Interns</span>
            <div className="flex flex-wrap gap-1">
              {assignedInternIds && assignedInternIds.length > 0 ? (
                assignedInternIds.map((internId) => {
                  const name = internsMap[internId] || 'Unknown Intern';
                  return (
                    <span
                      key={internId}
                      className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200"
                    >
                      <span className="truncate max-w-[90px]">{name}</span>
                      <button
                        onClick={() => onRemoveIntern(id, internId, name)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors focus:outline-none"
                        title={`Remove ${name}`}
                      >
                        <FiX size={10} />
                      </button>
                    </span>
                  );
                })
              ) : (
                <span className="text-slate-350 italic font-semibold text-[10px]">No interns assigned</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2 mt-2">
        {/* Assign Trigger on left */}
        <button
          onClick={() => onAssignInterns(id, title, assignedInternIds)}
          className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
          title="Assign Interns"
        >
          <FiUserPlus size={12} />
          <span>Assign</span>
        </button>

        {/* Other actions on right */}
        <div className="flex items-center gap-1.5">
          <Link
            to={`/admin/projects/${id}`}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
            title="View Details"
          >
            <FiEye size={15} />
          </Link>
          <Link
            to={`/admin/projects/${id}/edit`}
            className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 cursor-pointer transition-colors"
            title="Edit Project"
          >
            <FiEdit size={15} />
          </Link>
          <button
            onClick={() => onDelete(id, title)}
            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
            title="Delete Project"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
