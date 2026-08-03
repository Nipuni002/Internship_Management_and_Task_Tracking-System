import React from 'react';

const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`max-w-7xl mx-auto w-full px-1.5 sm:px-2.5 py-1 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
