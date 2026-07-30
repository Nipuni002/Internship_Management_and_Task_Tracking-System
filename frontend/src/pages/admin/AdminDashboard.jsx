import React from 'react';
import { FiUsers, FiFolder, FiCheckSquare, FiAward } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Active Interns', value: '12', icon: <FiUsers size={24} />, color: 'bg-blue-500 text-blue-500' },
    { name: 'Total Projects', value: '4', icon: <FiFolder size={24} />, color: 'bg-emerald-500 text-emerald-500' },
    { name: 'Assigned Tasks', value: '28', icon: <FiCheckSquare size={24} />, color: 'bg-amber-500 text-amber-500' },
    { name: 'Submissions to Review', value: '5', icon: <FiAward size={24} />, color: 'bg-rose-500 text-rose-500' },
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="Admin Control Center" 
        description={`Hello, ${user?.fullName || 'Admin'}. Here is your overview of internship engagements.`}
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

      {/* Main layout widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Recent Submissions" className="lg:col-span-2">
          <div className="text-center py-10 text-slate-400 text-sm">
            No submissions pending final approval.
          </div>
        </Card>

        <Card title="Active Projects">
          <div className="text-center py-10 text-slate-400 text-sm">
            Interactive project listing is coming soon.
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AdminDashboard;
