import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiBookOpen, FiCalendar, FiEdit, FiTrash2, FiEye, FiCheckCircle, FiMinusCircle } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

const InternCard = ({ intern, onView, onEdit, onDelete, onToggleStatus }) => {
  const { id, employeeId, firstName, lastName, email, phone, university, degree, startDate, endDate, status } = intern;
  const fullName = `${firstName} ${lastName}`;

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all font-sans">
      {/* Top section: Name and status */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-bold text-slate-800 text-sm">{fullName}</h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
            ID: {employeeId}
          </span>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Info details */}
      <div className="py-3.5 space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <FiBookOpen className="text-slate-400 shrink-0" size={14} />
          <span className="truncate">{degree}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="text-slate-400 select-none text-[10px] font-bold uppercase shrink-0">Uni</span>
          <span className="truncate font-medium">{university}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <FiMail className="text-slate-400 shrink-0" size={14} />
          <span className="truncate">{email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <FiPhone className="text-slate-400 shrink-0" size={14} />
          <span className="truncate">{phone}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wide bg-slate-50 border border-slate-100 p-2 rounded-lg">
          <FiCalendar size={12} className="text-slate-400 shrink-0" />
          <span>
            {startDate} to {endDate}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Status Toggle Button */}
          {status === 'ACTIVE' ? (
            <button
              onClick={() => onToggleStatus(id, false)}
              className="p-2 rounded-lg text-slate-450 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              title="Deactivate intern"
            >
              <FiMinusCircle size={15} />
            </button>
          ) : (
            <button
              onClick={() => onToggleStatus(id, true)}
              className="p-2 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer"
              title="Activate intern"
            >
              <FiCheckCircle size={15} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            to={`/admin/interns/${id}`}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer"
            title="View Details"
          >
            <FiEye size={15} />
          </Link>
          <Link
            to={`/admin/interns/${id}/edit`}
            className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 cursor-pointer"
            title="Edit Profile"
          >
            <FiEdit size={15} />
          </Link>
          <button
            onClick={() => onDelete(id, fullName)}
            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
            title="Delete Intern"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternCard;
