import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { FiUserPlus } from 'react-icons/fi';

const Interns = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="Intern Management" 
        description="View and manage all intern profiles, toggle statuses, and view progress details."
        actions={
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10">
            <FiUserPlus size={14} />
            Register Intern
          </button>
        }
      />
      <EmptyState 
        title="No Interns Registered" 
        description="Get started by registering your first intern to track their tasks, logs, and projects."
      />
    </PageContainer>
  );
};

export default Interns;
