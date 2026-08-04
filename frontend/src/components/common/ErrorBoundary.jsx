import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  console.error('Route boundary captured error:', error);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white text-center font-sans">
      <div className="max-w-md w-full bg-slate-850/80 border border-slate-750 backdrop-blur-md rounded-2xl p-8 shadow-xl space-y-6">
        <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <FiAlertTriangle size={28} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-white">Something went wrong</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            An unexpected error occurred while loading this page view. This is often resolved by refreshing the browser or checking connection settings.
          </p>
        </div>

        {error && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-left overflow-x-auto max-h-32 text-[10px] text-rose-400 font-mono select-all">
            <strong>Error details:</strong>
            <p className="mt-1 break-words">{error.message || String(error)}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <FiRefreshCw size={14} />
            <span>Reload Page</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-1/2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <FiHome size={14} />
            <span>Back Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
