import React from 'react';
import { FiClock, FiCheckCircle, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  const normalizedStatus = status ? status.toUpperCase() : 'PENDING';

  const badgeConfig = {
    PENDING: {
      text: 'Pending Review',
      styles: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <FiClock size={11} className="shrink-0" />
    },
    APPROVED: {
      text: 'Approved',
      styles: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <FiCheckCircle size={11} className="shrink-0" />
    },
    REJECTED: {
      text: 'Rejected',
      styles: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: <FiAlertTriangle size={11} className="shrink-0" />
    },
    REVISION_REQUIRED: {
      text: 'Revision Required',
      styles: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: <FiRefreshCw size={11} className="shrink-0 animate-spin-slow" />
    }
  };

  const config = badgeConfig[normalizedStatus] || badgeConfig.PENDING;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${config.styles} select-none font-sans shrink-0`}>
      {config.icon}
      <span>{config.text}</span>
    </span>
  );
};

export default StatusBadge;
