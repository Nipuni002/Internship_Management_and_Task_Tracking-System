import React from 'react';
import { FiCheckSquare, FiActivity, FiClock, FiCheck } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';

const InternDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'My Tasks', value: '4', icon: <FiCheckSquare size={24} />, color: 'bg-indigo-500 text-indigo-500' },
    { name: 'Logs Submitted', value: '18', icon: <FiActivity size={24} />, color: 'bg-emerald-500 text-emerald-500' },
    { name: 'Pending Review', value: '2', icon: <FiClock size={24} />, color: 'bg-amber-500 text-amber-500' },
    { name: 'Completed Tasks', value: '3', icon: <FiCheck size={24} />, color: 'bg-emerald-500 text-emerald-500' },
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="My Workspace" 
        description={`Welcome back, ${user?.fullName || 'Intern'}. Here is your task tracking summary.`}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg ${stat.color.split(' ')[0]}/10 flex items-center justify-center ${stat.color.split(' ')[1]}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 leading-none">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1.5">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main widgets container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="My Assigned Tasks" className="lg:col-span-2">
          <div className="text-center py-10 text-slate-400 text-sm">
            You have no pending tasks.
          </div>
        </Card>

        <Card title="Recent Feedback">
          <div className="text-center py-10 text-slate-400 text-sm">
            No feedback received recently.
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default InternDashboard;
