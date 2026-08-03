import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import EmptyState from '../../components/common/EmptyState';

const Feedback = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="Feedback &amp; Reviews" 
        description="Check grading scores, logs and task critiques posted by administrators."
      />
      <EmptyState 
        title="No Reviews Received" 
        description="No feedback summaries have been posted by your administrator yet."
      />
    </PageContainer>
  );
};

export default Feedback;
