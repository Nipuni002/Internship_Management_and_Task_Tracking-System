import React from 'react';

const LoadingSpinner = ({ fullScreen = true }) => {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center space-y-3">
      {/* Premium animate-spin element */}
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-slate-500 tracking-wide animate-pulse">Loading portal...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center z-50">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6 w-full">
      {spinnerContent}
    </div>
  );
};

export default LoadingSpinner;
