import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import EmptyState from '../../components/common/EmptyState';

const Submissions = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="Submission &amp; Feedback" 
        description="Review files submitted by interns for completed tasks, add scores, and write feedback reviews."
      />
      <EmptyState 
        title="No Submissions Ready" 
        description="Completed task assignments will show up here for grading."
      />
    </PageContainer>
  );
};

export default Submissions;
