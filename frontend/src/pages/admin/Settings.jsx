import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';

const Settings = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="Settings" 
        description="Configure system parameters, notifications, and integration settings."
      />
      <div className="max-w-2xl">
        <Card title="System Configuration">
          <div className="text-center py-6 text-slate-400 text-sm">
            Configuration fields will display here.
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Settings;
