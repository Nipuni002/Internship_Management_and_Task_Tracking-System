import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import SubmissionForm from '../../../components/submissions/SubmissionForm';

import taskService from '../../../services/taskService';
import submissionService from '../../../services/submissionService';

const SubmitWork = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Read optional task parameter from URL query string
  const queryTaskId = searchParams.get('taskId') || '';

  useEffect(() => {
    const loadAssignedTasks = async () => {
      try {
        // Backend automatically filters to current intern's tasks
        const response = await taskService.getAllTasks({ size: 1000 });
        if (response.success && response.data) {
          // Filter tasks that can be submitted: status is not completed
          const activeTasks = (response.data.content || []).filter(
            (t) => t.status !== 'COMPLETED'
          );
          setTasks(activeTasks);
        }
      } catch (error) {
        console.error('Error fetching assigned tasks:', error);
        toast.error('Failed to load your assigned tasks directory');
      } finally {
        setLoading(false);
      }
    };

    loadAssignedTasks();
  }, []);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const response = await submissionService.createSubmission(formData);
      if (response.success) {
        toast.success(response.message || 'Task work submitted successfully!');
        navigate('/intern/submissions');
      } else {
        toast.error(response.message || 'Failed to submit task work');
      }
    } catch (error) {
      console.error('Error submitting work:', error);
      const errorMsg = error.response?.data?.message || 'Error occurred while submitting work. Please check URLs and details.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Submit Completed Work"
        description="Select your assigned task and upload your code repositories or documentation links for supervisor evaluation."
      />

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-16 flex justify-center items-center shadow-sm max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner fullScreen={false} />
            <span className="text-slate-400 text-xs font-bold font-sans">Loading active assignments...</span>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
          <SubmissionForm
            tasks={tasks}
            initialData={{ taskId: queryTaskId }}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
            isEdit={false}
          />
        </div>
      )}
    </PageContainer>
  );
};

export default SubmitWork;
