import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import TaskForm from '../../../components/tasks/TaskForm';
import taskService from '../../../services/taskService';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [taskData, setTaskData] = useState(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await taskService.getTaskById(id);
        if (response.success && response.data) {
          setTaskData(response.data);
        } else {
          toast.error(response.message || 'Failed to fetch task details');
          navigate('/admin/tasks');
        }
      } catch (error) {
        console.error('Error fetching task details:', error);
        toast.error(error.response?.data?.message || 'Error loading task details');
        navigate('/admin/tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const response = await taskService.updateTask(id, formData);
      if (response.success) {
        toast.success(response.message || 'Task updated successfully!');
        navigate('/admin/tasks');
      } else {
        toast.error(response.message || 'Failed to update task details');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(error.response?.data?.message || 'Error occurred while saving task updates');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Edit Task Details"
        description={`Modify task checklist properties for "${taskData?.title}".`}
      />
      <div className="max-w-4xl mx-auto">
        {taskData && (
          <TaskForm
            initialData={taskData}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
            isEdit={true}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default EditTask;
