import React from 'react';
import Breadcrumb from './Breadcrumb';

const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-5">
      <div className="space-y-1">
        <Breadcrumb />
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">{title}</h1>
        {description && (
          <p className="text-sm text-slate-500 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
