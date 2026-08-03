import React, { useState, useEffect } from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import useAuth from '../../hooks/useAuth';
import internService from '../../services/internService';
import toast from 'react-hot-toast';
import { FiUser, FiBookOpen, FiCalendar, FiPhone, FiMail, FiAward, FiShield } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const [internDetails, setInternDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternProfile = async () => {
      try {
        const response = await internService.getCurrentInternProfile();
        if (response.success && response.data) {
          setInternDetails(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch intern profile details:', error);
        toast.error('Unable to fetch detailed profile information.');
      } finally {
        setLoading(false);
      }
    };

    fetchInternProfile();
  }, []);

  return (
    <PageContainer>
      <PageHeader 
        title="My Profile" 
        description="View your intern account credentials, academic information, and tracking settings."
      />
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
          {/* Main Account details card */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/25 mb-4">
                  {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : 'IN'}
                </div>
                <h2 className="text-xl font-bold text-slate-800">{user?.fullName}</h2>
                <p className="text-sm text-slate-400 font-medium mb-3">{user?.email}</p>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                  internDetails?.status === 'ACTIVE' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${internDetails?.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  {internDetails?.status || 'ACTIVE'}
                </span>
              </div>
            </Card>

            <Card title="Access Privileges">
              <div className="flex items-center gap-3 p-1 font-sans text-sm">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <FiShield size={18} />
                </div>
                <div>
                  <div className="font-semibold text-slate-700">Role Privilege</div>
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{user?.role?.replace('ROLE_', '')}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Detailed profile card */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Internship & Academic Information">
              <div className="divide-y divide-slate-100 font-sans text-sm">
                {/* Employee ID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 py-4 gap-2">
                  <span className="text-slate-400 font-medium flex items-center gap-2">
                    <FiAward className="text-slate-400" size={16} /> Employee ID
                  </span>
                  <span className="sm:col-span-2 text-slate-800 font-semibold">
                    {internDetails?.employeeId || 'N/A'}
                  </span>
                </div>

                {/* University */}
                <div className="grid grid-cols-1 sm:grid-cols-3 py-4 gap-2">
                  <span className="text-slate-400 font-medium flex items-center gap-2">
                    <FiBookOpen className="text-slate-400" size={16} /> University
                  </span>
                  <span className="sm:col-span-2 text-slate-800 font-semibold">
                    {internDetails?.university || 'N/A'}
                  </span>
                </div>

                {/* Degree */}
                <div className="grid grid-cols-1 sm:grid-cols-3 py-4 gap-2">
                  <span className="text-slate-400 font-medium flex items-center gap-2">
                    <FiBookOpen className="text-slate-400" size={16} /> Degree / Major
                  </span>
                  <span className="sm:col-span-2 text-slate-800 font-semibold">
                    {internDetails?.degree || 'N/A'}
                  </span>
                </div>

                {/* Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-3 py-4 gap-2">
                  <span className="text-slate-400 font-medium flex items-center gap-2">
                    <FiPhone className="text-slate-400" size={16} /> Contact Phone
                  </span>
                  <span className="sm:col-span-2 text-slate-800 font-semibold">
                    {internDetails?.phone || 'N/A'}
                  </span>
                </div>

                {/* Start Date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 py-4 gap-2">
                  <span className="text-slate-400 font-medium flex items-center gap-2">
                    <FiCalendar className="text-slate-400" size={16} /> Start Date
                  </span>
                  <span className="sm:col-span-2 text-slate-800 font-semibold">
                    {internDetails?.startDate || 'N/A'}
                  </span>
                </div>

                {/* End Date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 py-4 gap-2">
                  <span className="text-slate-400 font-medium flex items-center gap-2">
                    <FiCalendar className="text-slate-400" size={16} /> End Date
                  </span>
                  <span className="sm:col-span-2 text-slate-800 font-semibold">
                    {internDetails?.endDate || 'N/A'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Profile;
