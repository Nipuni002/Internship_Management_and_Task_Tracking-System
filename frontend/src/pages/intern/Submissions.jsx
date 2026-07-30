import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { FiUpload } from 'react-icons/fi';

const Submissions = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="My Submissions" 
        description="Submit task resources (file uploads, links) for evaluation and view graded scores."
        actions={
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10">
            <FiUpload size={14} />
            New Submission
          </button>
        }
      />
      <EmptyState 
        title="No Active Submissions" 
        description="You have not submitted any task solutions for grading yet."
      />
    </PageContainer>
  );
};

export default Submissions;
