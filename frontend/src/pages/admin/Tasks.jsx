import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { FiPlus } from 'react-icons/fi';

const Tasks = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="Task Management" 
        description="Create tasks, assign due dates, link repositories, and map them to interns."
        actions={
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10">
            <FiPlus size={14} />
            Create Task
          </button>
        }
      />
      <EmptyState 
        title="No Tasks Assigned" 
        description="Assign a task to interns to start tracking their daily logs and submissions."
      />
    </PageContainer>
  );
};

export default Tasks;
