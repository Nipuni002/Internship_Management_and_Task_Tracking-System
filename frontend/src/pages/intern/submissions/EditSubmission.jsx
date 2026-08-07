import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import SubmissionForm from '../../../components/submissions/SubmissionForm';

import taskService from '../../../services/taskService';
import submissionService from '../../../services/submissionService';

const EditSubmission = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [subRes, tasksRes] = await Promise.all([
          submissionService.getSubmissionById(id),
          taskService.getAllTasks({ size: 1000 }),
        ]);

        if (subRes.success && subRes.data) {
          setSubmission(subRes.data);
        } else {
          toast.error('Failed to load submission data');
          navigate('/intern/submissions');
          return;
        }

        if (tasksRes.success && tasksRes.data) {
          setTasks(tasksRes.data.content || []);
        }
      } catch (error) {
        console.error('Error fetching data for editing submission:', error);
        toast.error('Failed to load data for editing submission');
        navigate('/intern/submissions');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const response = await submissionService.updateSubmission(id, formData);
      if (response.success) {
        toast.success(response.message || 'Submission updated successfully!');
        navigate('/intern/submissions');
      } else {
        toast.error(response.message || 'Failed to update submission');
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      const errorMsg = error.response?.data?.message || 'Error occurred while updating submission.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Edit Submission"
        description="Update your completed deliverables and notes for supervisor re-evaluation."
      />

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-16 flex justify-center items-center shadow-sm max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-2">
            <LoadingSpinner fullScreen={false} />
            <span className="text-slate-400 text-xs font-bold font-sans">Loading submission details...</span>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
          <SubmissionForm
            tasks={tasks}
            initialData={submission}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
            isEdit={true}
          />
        </div>
      )}
    </PageContainer>
  );
};

export default EditSubmission;
