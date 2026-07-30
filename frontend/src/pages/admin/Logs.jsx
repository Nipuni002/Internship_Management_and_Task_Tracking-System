import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import EmptyState from '../../components/common/EmptyState';

const Logs = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="Daily Work Logs" 
        description="Monitor daily logs submitted by interns, check work durations, and approve submissions."
      />
      <EmptyState 
        title="No Daily Logs" 
        description="Logs will appear here once interns start posting their daily updates."
      />
    </PageContainer>
  );
};

export default Logs;
