import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative background blur objects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Main card container */}
      <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 w-full max-w-md rounded-2xl shadow-xl shadow-slate-950/50 overflow-hidden z-10">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">Internship Portal</h2>
            <p className="text-sm text-slate-400 mt-2">Internship Management & Task Tracking System</p>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
