import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import EmptyState from '../../components/common/EmptyState';

const Tasks = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="My Tasks" 
        description="Track your current assigned tasks, checklists, resource links, and deadlines."
      />
      <EmptyState 
        title="No Tasks Assigned" 
        description="Hooray! You have no pending tasks assigned at this moment."
      />
    </PageContainer>
  );
};

export default Tasks;
