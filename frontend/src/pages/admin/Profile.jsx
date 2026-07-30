import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  return (
    <PageContainer>
      <PageHeader 
        title="My Profile" 
        description="View and update your administrator details and login preferences."
      />
      <div className="max-w-2xl">
        <Card title="Account Profile">
          <div className="space-y-4 font-sans text-sm">
            <div className="grid grid-cols-3 py-2 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Full Name</span>
              <span className="col-span-2 text-slate-800 font-semibold">{user?.fullName}</span>
            </div>
            <div className="grid grid-cols-3 py-2 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Email Address</span>
              <span className="col-span-2 text-slate-800 font-semibold">{user?.email}</span>
            </div>
            <div className="grid grid-cols-3 py-2 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Access Privileges</span>
              <span className="col-span-2 text-slate-800 font-semibold uppercase">{user?.role?.replace('ROLE_', '')}</span>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Profile;
