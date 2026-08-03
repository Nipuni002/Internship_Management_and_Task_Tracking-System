import React from 'react';

const PriorityBadge = ({ priority }) => {
  const getStyles = () => {
    switch (priority?.toUpperCase()) {
      case 'LOW':
        return 'bg-slate-100 text-slate-650 border-slate-200';
      case 'MEDIUM':
        return 'bg-amber-50/70 text-amber-700 border-amber-200/50';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200/60';
      case 'URGENT':
        return 'bg-rose-50 text-rose-700 border-rose-250/50 font-extrabold animate-pulse';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border tracking-wide uppercase ${getStyles()}`}>
      {priority || 'UNKNOWN'}
    </span>
  );
};

export default PriorityBadge;
