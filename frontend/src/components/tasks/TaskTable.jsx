import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2, FiUser, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import TaskStatusBadge from './TaskStatusBadge';
import PriorityBadge from './PriorityBadge';

const TaskTable = ({
  tasks = [],
  projectsMap = {},
  internsMap = {},
  sortField = '',
  sortDirection = 'asc',
  onSort,
  onDelete,
  onAssign,
  onUpdateStatus,
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      // Date is standard string yyyy-MM-dd
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const formatInstant = (instantStr) => {
    if (!instantStr) return 'N/A';
    try {
      const d = new Date(instantStr);
      return d.toLocaleDateString();
    } catch {
      return 'N/A';
    }
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
              Task Title {renderSortIcon('title')}
            </th>
            <th className="px-6 py-4">Project</th>
            <th
              onClick={() => handleSortClick('assignedInternId')}
              className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              Assigned Intern {renderSortIcon('assignedInternId')}
            </th>
            <th
              onClick={() => handleSortClick('priority')}
              className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              Priority {renderSortIcon('priority')}
            </th>
            <th
              onClick={() => handleSortClick('status')}
              className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              Status {renderSortIcon('status')}
            </th>
            <th
              onClick={() => handleSortClick('deadline')}
              className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              Deadline {renderSortIcon('deadline')}
            </th>
            <th className="px-6 py-4">Created Date</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
          {tasks.map((task) => {
            const { id, title, description, priority, deadline, status, projectId, assignedInternId, createdAt } = task;

            const projectName = projectsMap[projectId] || `Project (ID: ${projectId?.substring(0, 8)}...)`;
            const internName = internsMap[assignedInternId] || `Intern (ID: ${assignedInternId?.substring(0, 8)}...)`;

            return (
              <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                {/* Title */}
                <td className="px-6 py-3.5 max-w-xs">
                  <div className="font-bold text-slate-900 truncate" title={title}>{title}</div>
                  {description && (
                    <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5" title={description}>
                      {description}
                    </div>
                  )}
                </td>

                {/* Project */}
                <td className="px-6 py-3.5 whitespace-nowrap font-medium text-slate-600">
                  {projectName}
                </td>

                {/* Assignee */}
                <td className="px-6 py-3.5 whitespace-nowrap font-medium text-slate-600">
                  {internName}
                </td>

                {/* Priority */}
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <PriorityBadge priority={priority} />
                </td>

                {/* Status */}
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <TaskStatusBadge status={status} />
                </td>

                {/* Deadline */}
                <td className="px-6 py-3.5 whitespace-nowrap font-bold text-slate-805">
                  {formatDate(deadline)}
                </td>

                {/* Created Date */}
                <td className="px-6 py-3.5 whitespace-nowrap font-medium text-slate-450">
                  {formatInstant(createdAt)}
                </td>

                {/* Actions */}
                <td className="px-6 py-3.5 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {/* View Details */}
                    <Link
                      to={`/admin/tasks/${id}`}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <FiEye size={15} />
                    </Link>

                    {/* Edit */}
                    <Link
                      to={`/admin/tasks/${id}/edit`}
                      className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                      title="Edit Task"
                    >
                      <FiEdit size={15} />
                    </Link>

                    {/* Assign Modal Trigger */}
                    <button
                      onClick={() => onAssign(id, title, assignedInternId)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Assign Intern"
                    >
                      <FiUser size={15} />
                    </button>

                    {/* Inline Status Dropdown */}
                    <select
                      value={status}
                      onChange={(e) => onUpdateStatus(id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2 py-1 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      title="Change status inline"
                    >
                      <option value="TODO">Todo</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="SUBMITTED">Submitted</option>
                      <option value="REVISION_REQUIRED">Revision Required</option>
                      <option value="COMPLETED">Completed</option>
                    </select>

                    {/* Delete */}
                    <button
                      onClick={() => onDelete(id, title)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Task"
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

export default TaskTable;
