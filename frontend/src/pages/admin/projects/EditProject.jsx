import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import ProjectForm from '../../../components/projects/ProjectForm';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import projectService from '../../../services/projectService';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await projectService.getProjectById(id);
        if (response.success && response.data) {
          setProject(response.data);
        } else {
          toast.error(response.message || 'Failed to retrieve project details');
          navigate('/admin/projects');
        }
      } catch (error) {
        console.error('Error fetching project for edit:', error);
        toast.error(error.response?.data?.message || 'Error loading project details');
        navigate('/admin/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const response = await projectService.updateProject(id, formData);
      if (response.success) {
        toast.success(response.message || 'Project updated successfully!');
        navigate('/admin/projects');
      } else {
        toast.error(response.message || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      const errorMsg = error.response?.data?.message || 'Error updating project details. Please verify inputs.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Edit Project Details"
        description="Update project deliverables, adjust status, and manage deadlines."
      />
      
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-16 flex justify-center items-center shadow-sm max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner fullScreen={false} />
            <span className="text-slate-400 text-xs font-bold font-sans">Fetching project details...</span>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
          <ProjectForm
            initialData={project}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
            isEdit={true}
          />
        </div>
      )}
    </PageContainer>
  );
};

export default EditProject;
