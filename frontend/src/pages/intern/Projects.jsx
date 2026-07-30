import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import EmptyState from '../../components/common/EmptyState';

const Projects = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="My Projects" 
        description="View details of development projects you have been assigned to."
      />
      <EmptyState 
        title="No Project Assignments" 
        description="You are currently not assigned to any projects. Check back later or contact your admin."
      />
    </PageContainer>
  );
};

export default Projects;
