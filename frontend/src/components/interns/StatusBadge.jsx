import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'INACTIVE':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles()}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status?.toUpperCase() === 'ACTIVE' ? 'bg-emerald-500' :
        status?.toUpperCase() === 'INACTIVE' ? 'bg-slate-400' :
        status?.toUpperCase() === 'COMPLETED' ? 'bg-blue-500' : 'bg-slate-400'
      }`}></span>
      {status || 'UNKNOWN'}
    </span>
  );
};

export default StatusBadge;
