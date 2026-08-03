import React from 'react';

const TaskStatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status?.toUpperCase()) {
      case 'TODO':
        return 'bg-slate-100 text-slate-750 border-slate-200';
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-750 border-blue-200/60';
      case 'SUBMITTED':
        return 'bg-amber-50 text-amber-750 border-amber-200/80';
      case 'REVISION_REQUIRED':
        return 'bg-rose-50 text-rose-750 border-rose-200/70';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-755 border-emerald-200/80';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const getDotStyles = () => {
    switch (status?.toUpperCase()) {
      case 'TODO':
        return 'bg-slate-400';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'SUBMITTED':
        return 'bg-amber-500';
      case 'REVISION_REQUIRED':
        return 'bg-rose-500';
      case 'COMPLETED':
        return 'bg-emerald-500';
      default:
        return 'bg-slate-400';
    }
  };

  const formatStatus = (statusStr) => {
    if (!statusStr) return 'UNKNOWN';
    return statusStr.replace('_', ' ').toUpperCase();
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wide ${getStatusStyles()}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${getDotStyles()}`}></span>
      {formatStatus(status)}
    </span>
  );
};

export default TaskStatusBadge;
