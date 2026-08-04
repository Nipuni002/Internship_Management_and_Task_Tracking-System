import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2, FiUserPlus, FiArrowUp, FiArrowDown, FiX } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

const ProjectTable = ({
  projects = [],
  internsMap = {}, // Lookup of internId -> Full Name
  sortField = '',
  sortDirection = 'asc',
  onSort,
  onDelete,
  onAssignInterns,
  onRemoveIntern, // Quick remove callback
}) => {
  const handleSortClick = (field) => {
    onSort(field);
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <FiArrowUp size={12} className="ml-1 text-blue-600 inline" />
    ) : (
      <FiArrowDown size={12} className="ml-1 text-blue-600 inline" />
    );
  };

  return (
    <div className="overflow-x-auto w-full bg-white rounded-t-xl border-x border-t border-slate-200/80 shadow-sm font-sans">
      <table className="min-w-full divide-y divide-slate-150 text-left text-xs font-semibold text-slate-500">
        <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider select-none">
          <tr>
            <th
              onClick={() => handleSortClick('title')}
              className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              Project Name {renderSortIcon('title')}
            </th>
            <th className="px-6 py-4">Description</th>
            <th
              onClick={() => handleSortClick('technology')}
              className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              Technology Stack {renderSortIcon('technology')}
            </th>
            <th
              onClick={() => handleSortClick('deadline')}
              className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              Deadline {renderSortIcon('deadline')}
            </th>
            <th
              onClick={() => handleSortClick('status')}
              className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors text-center"
            >
              Status {renderSortIcon('status')}
            </th>
            <th className="px-6 py-4">Assigned Interns</th>
            <th className="px-6 py-4">Created Date</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
          {projects.map((project) => {
            const {
              id,
              title,
              description,
              technology = [],
              deadline,
              status,
              assignedInternIds = [],
              createdAt,
            } = project;

            // Formatted date
            const formattedDeadline = deadline ? new Date(deadline).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : 'No deadline';

            const formattedCreatedDate = createdAt ? new Date(createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : 'N/A';

            return (
              <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900 truncate max-w-[200px]" title={title}>
                  {title}
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium max-w-[250px] truncate" title={description}>
                  {description || <span className="text-slate-350 italic">No description</span>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-[220px]">
                    {technology && technology.length > 0 ? (
                      technology.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-350 italic font-semibold">None</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600">
                  {formattedDeadline}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <StatusBadge status={status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                    {assignedInternIds && assignedInternIds.length > 0 ? (
                      assignedInternIds.map((internId) => {
                        const name = internsMap[internId] || 'Unknown Intern';
                        return (
                          <span
                            key={internId}
                            className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200"
                          >
                            <span className="truncate max-w-[80px]">{name}</span>
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
                      <span className="text-slate-350 italic font-semibold">No interns assigned</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-500">
                  {formattedCreatedDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {/* View Details */}
                    <Link
                      to={`/admin/projects/${id}`}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <FiEye size={15} />
                    </Link>

                    {/* Edit Project */}
                    <Link
                      to={`/admin/projects/${id}/edit`}
                      className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                      title="Edit Project"
                    >
                      <FiEdit size={15} />
                    </Link>

                    {/* Assign Interns Modal Trigger */}
                    <button
                      onClick={() => onAssignInterns(id, title, assignedInternIds)}
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
                      title="Assign Interns"
                    >
                      <FiUserPlus size={15} />
                    </button>

                    {/* Delete Project */}
                    <button
                      onClick={() => onDelete(id, title)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Project"
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

export default ProjectTable;
