import React from 'react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ 
  icon = <FiInbox size={36} />, 
  title = 'No Data Found', 
  description = 'There are currently no items in this section.', 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-dashed border-slate-300 rounded-xl font-sans">
      <div className="w-14 h-14 bg-slate-50 border border-slate-205 rounded-full flex items-center justify-center text-slate-400 mb-4 shadow-sm">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
        {title}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed font-medium">
        {description}
      </p>
      {action && (
        <div className="mt-5 shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
