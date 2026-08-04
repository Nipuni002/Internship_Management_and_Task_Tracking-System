import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import ProjectForm from '../../../components/projects/ProjectForm';
import projectService from '../../../services/projectService';

const CreateProject = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const response = await projectService.createProject(formData);
      if (response.success) {
        toast.success(response.message || 'Project created successfully!');
        navigate('/admin/projects');
      } else {
        toast.error(response.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMsg = error.response?.data?.message || 'Error occurred while creating project. Please verify data.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Create New Project"
        description="Launch a new project scope. Define technologies, deadlines, and configure core trackers."
      />
      <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
        <ProjectForm onSubmit={handleSubmit} isSubmitting={submitting} isEdit={false} />
      </div>
    </PageContainer>
  );
};

export default CreateProject;
