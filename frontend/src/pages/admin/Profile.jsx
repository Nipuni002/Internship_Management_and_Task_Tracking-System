import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import useAuth from '../../hooks/useAuth';
import dashboardService from '../../services/dashboardService';
import toast from 'react-hot-toast';
import { 
  FiUser, 
  FiMail, 
  FiShield, 
  FiAward, 
  FiActivity, 
  FiBriefcase, 
  FiClock, 
  FiCalendar
} from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await dashboardService.getAdminDashboard();
        if (response.success && response.data) {
          setAdminStats(response.data);
        }
      } catch (error) {
        console.error('Failed to retrieve admin details metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const nameParts = user?.fullName ? user.fullName.split(' ') : ['Admin', 'User'];
  const firstName = nameParts[0] || 'Admin';
  const lastName = nameParts.slice(1).join(' ') || 'Manager';

  return (
    <PageContainer>
      <PageHeader 
        title="My Profile" 
        description="Review and update your administrator credentials, access permissions, and account security settings."
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl font-sans">
          
          {/* Left Column: Account Summary Card & Privileges */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Account Card */}
            <Card>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/25 mb-4 transform transition-transform duration-300 hover:rotate-3 cursor-pointer">
                  {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : 'AD'}
                </div>
                <h2 className="text-xl font-bold text-slate-800 leading-snug">{user?.fullName}</h2>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
                  {user?.role?.replace('ROLE_', '') || 'ADMINISTRATOR'}
                </p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/50 mt-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Session
                </span>
              </div>
            </Card>

            {/* Access Privileges */}
            <Card title="Access Privileges">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-1">
                  <div className="p-2.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl">
                    <FiShield size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-700 leading-none">Security clearance</div>
                    <div className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-1">
                      {user?.role || 'ROLE_ADMIN'}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Granted Permissions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Manage Interns', 'Approve Submissions', 'Create Projects', 'Modify Tasks', 'View Analytics'].map(perm => (
                      <span key={perm} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-650 text-[9px] font-bold">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Information & Password Security */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Admin Metadata Information */}
            <Card title="Administrator Profile Information">
              <div className="divide-y divide-slate-100 font-sans text-xs font-medium text-slate-600">
                {/* ID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 py-4 gap-2">
                  <span className="text-slate-400 font-bold flex items-center gap-2">
                    <FiAward size={16} /> Admin ID
                  </span>
                  <span className="sm:col-span-2 text-slate-800 font-black">
                    ADM-2026-001
                  </span>
                </div>

                {/* First Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 py-4 gap-2">
                  <span className="text-slate-400 font-bold flex items-center gap-2">
                    <FiUser size={16} /> First Name
                  </span>
                  <span className="sm:col-span-2 text-slate-800 font-bold">
                    {firstName}
                  </span>
                </div>

                {/* Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 py-4 gap-2">
                  <span className="text-slate-400 font-bold flex items-center gap-2">
                    <FiUser size={16} /> Last Name
                  </span>
                  <span className="sm:col-span-2 text-slate-800 font-bold">
                    {lastName}
                  </span>
                </div>

                {/* Email */}
                <div className="grid grid-cols-1 sm:grid-cols-3 py-4 gap-2">
                  <span className="text-slate-400 font-bold flex items-center gap-2">
                    <FiMail size={16} /> Email Address
                  </span>
                  <span className="sm:col-span-2 text-slate-800 font-bold">
                    {user?.email}
                  </span>
                </div>

                {/* Department */}
                <div className="grid grid-cols-1 sm:grid-cols-3 py-4 gap-2">
                  <span className="text-slate-400 font-bold flex items-center gap-2">
                    <FiBriefcase size={16} /> Organization Department
                  </span>
                  <span className="sm:col-span-2 text-slate-800 font-bold">
                    Engineering, Human Resources & Mentorships
                  </span>
                </div>

                {/* Join Date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 py-4 gap-2">
                  <span className="text-slate-400 font-bold flex items-center gap-2">
                    <FiCalendar size={16} /> Joined Date
                  </span>
                  <span className="sm:col-span-2 text-slate-800 font-bold">
                    January 10, 2026
                  </span>
                </div>
              </div>
            </Card>

            {/* Management Stats Overview */}
            {adminStats && (
              <Card title="Internship Management Summary">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-1">
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl text-center">
                    <div className="text-lg font-black text-blue-700 leading-none">
                      {adminStats.totalInterns}
                    </div>
                    <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide mt-1.5 block">Total Interns</span>
                  </div>

                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-center">
                    <div className="text-lg font-black text-emerald-700 leading-none">
                      {adminStats.activeProjects}
                    </div>
                    <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide mt-1.5 block">Active Projects</span>
                  </div>

                  <div className="p-3 bg-violet-50/50 border border-violet-100 rounded-2xl text-center">
                    <div className="text-lg font-black text-violet-700 leading-none">
                      {adminStats.completedTasks}
                    </div>
                    <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide mt-1.5 block">Tasks Approved</span>
                  </div>

                  <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-2xl text-center">
                    <div className="text-lg font-black text-rose-700 leading-none">
                      {adminStats.overdueTasks}
                    </div>
                    <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide mt-1.5 block">Overdue Tasks</span>
                  </div>
                </div>
              </Card>
            )}


          </div>

        </div>
      )}
    </PageContainer>
  );
};

export default Profile;
