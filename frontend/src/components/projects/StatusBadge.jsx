import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'ON_HOLD':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const getDotStyles = () => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-emerald-500';
      case 'COMPLETED':
        return 'bg-blue-500';
      case 'ON_HOLD':
        return 'bg-amber-500';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles()}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getDotStyles()}`}></span>
      {status || 'UNKNOWN'}
    </span>
  );
};

export default StatusBadge;
