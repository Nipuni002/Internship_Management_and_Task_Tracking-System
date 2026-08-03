import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertOctagon, FiArrowLeft } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

const AccessDenied = () => {
  const { user } = useAuth();

  const dashboardPath = user?.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/intern/dashboard';

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"></div>
      
      <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-xl p-8 text-center z-10">
        <div className="mx-auto w-16 h-16 bg-rose-950/50 border border-rose-500/30 rounded-full flex items-center justify-center text-rose-500 mb-6">
          <FiAlertOctagon size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-white tracking-tight">Access Denied</h1>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          You do not have the required permissions to view this page. If you believe this is an error, please contact your administrator.
        </p>
        
        <div className="mt-8">
          <Link
            to={dashboardPath}
            className="inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-650 text-white font-medium py-2.5 px-6 rounded-lg transition-all border border-slate-600 focus:outline-none w-full"
          >
            <FiArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
