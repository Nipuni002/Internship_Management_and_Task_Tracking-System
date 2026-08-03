import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import TaskForm from '../../../components/tasks/TaskForm';
import taskService from '../../../services/taskService';

const CreateTask = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const response = await taskService.createTask(formData);
      if (response.success) {
        toast.success(response.message || 'Task created successfully');
        navigate('/admin/tasks');
      } else {
        toast.error(response.message || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.response?.data?.message || 'Error occurred while creating task. Please verify properties.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Create Development Task"
        description="Configure new task attributes and assign them directly to an active internship project."
      />
      <div className="max-w-4xl mx-auto">
        <TaskForm onSubmit={handleSubmit} isSubmitting={submitting} isEdit={false} />
      </div>
    </PageContainer>
  );
};

export default CreateTask;
