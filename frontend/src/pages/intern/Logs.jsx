import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { FiPlus } from 'react-icons/fi';

const Logs = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="Daily Work Logs" 
        description="Post logs about your daily tasks, achievements, issues encountered, and hours worked."
        actions={
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10">
            <FiPlus size={14} />
            Submit Daily Log
          </button>
        }
      />
      <EmptyState 
        title="No Daily Logs Found" 
        description="You haven't submitted any logs yet. Submit your first daily work log to record your progress."
      />
    </PageContainer>
  );
};

export default Logs;
