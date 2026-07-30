import React from 'react';

const SectionTitle = ({ children, subtitle, className = '' }) => {
  return (
    <div className={`mb-4 space-y-0.5 font-sans ${className}`}>
      <h2 className="text-base font-bold text-slate-800 tracking-wide uppercase">
        {children}
      </h2>
      {subtitle && (
        <p className="text-xs text-slate-400 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
