import React from 'react';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { FiFolderPlus } from 'react-icons/fi';

const Projects = () => {
  return (
    <PageContainer>
      <PageHeader 
        title="Project Management" 
        description="Create, assign, and track overall development projects and client deliverables."
        actions={
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10">
            <FiFolderPlus size={14} />
            New Project
          </button>
        }
      />
      <EmptyState 
        title="No Projects Defined" 
        description="Create a project to group related task checklists and organize teams."
      />
    </PageContainer>
  );
};

export default Projects;
