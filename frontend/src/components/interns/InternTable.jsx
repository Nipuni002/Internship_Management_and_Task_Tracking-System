import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit, FiTrash2, FiArrowUp, FiArrowDown, FiCheckCircle, FiMinusCircle } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

const InternTable = ({
  interns = [],
  sortField = '',
  sortDirection = 'asc',
  onSort,
  onDelete,
  onToggleStatus,
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
              onClick={() => handleSortClick('employeeId')}
              className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              Employee ID {renderSortIcon('employeeId')}
            </th>
            <th
              onClick={() => handleSortClick('firstName')}
              className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              Name {renderSortIcon('firstName')}
            </th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Phone</th>
            <th
              onClick={() => handleSortClick('university')}
              className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              University {renderSortIcon('university')}
            </th>
            <th className="px-6 py-4">Degree</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th
              onClick={() => handleSortClick('startDate')}
              className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              Start Date {renderSortIcon('startDate')}
            </th>
            <th className="px-6 py-4">End Date</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
          {interns.map((intern) => {
            const {
              id,
              employeeId,
              firstName,
              lastName,
              email,
              phone,
              university,
              degree,
              startDate,
              endDate,
              status,
            } = intern;
            const fullName = `${firstName} ${lastName}`;

            return (
              <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3.5 whitespace-nowrap font-bold text-slate-900">
                  {employeeId}
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap font-bold text-slate-805">
                  {fullName}
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap font-medium text-slate-500">
                  {email}
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap font-medium text-slate-500">
                  {phone}
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap font-medium text-slate-600">
                  {university}
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap font-medium text-slate-600">
                  {degree}
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap text-center">
                  <StatusBadge status={status} />
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap font-medium text-slate-500">
                  {startDate}
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap font-medium text-slate-500">
                  {endDate}
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-1">
                    {/* View */}
                    <Link
                      to={`/admin/interns/${id}`}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <FiEye size={15} />
                    </Link>

                    {/* Edit */}
                    <Link
                      to={`/admin/interns/${id}/edit`}
                      className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                      title="Edit Profile"
                    >
                      <FiEdit size={15} />
                    </Link>

                    {/* Status Activate/Deactivate Toggle */}
                    {status === 'ACTIVE' ? (
                      <button
                        onClick={() => onToggleStatus(id, false)}
                        className="p-1.5 rounded-lg text-slate-450 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Deactivate Intern"
                      >
                        <FiMinusCircle size={15} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleStatus(id, true)}
                        className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="Activate Intern"
                      >
                        <FiCheckCircle size={15} />
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => onDelete(id, fullName)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Intern"
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

export default InternTable;
