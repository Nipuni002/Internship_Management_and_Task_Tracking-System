import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiBook, FiGithub, FiExternalLink, FiMessageSquare, FiInfo, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Card from '../../../components/common/Card';
import StatusBadge from '../../../components/submissions/StatusBadge';

import submissionService from '../../../services/submissionService';
import taskService from '../../../services/taskService';

const SubmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      try {
        const response = await submissionService.getSubmissionById(id);
        if (response.success && response.data) {
          setSubmission(response.data);
          
          // Fetch associated task profile for titles/timelines
          try {
            const taskResponse = await taskService.getTaskById(response.data.taskId);
            if (taskResponse.success && taskResponse.data) {
              setTask(taskResponse.data);
            }
          } catch (taskErr) {
            console.error('Error fetching associated task:', taskErr);
          }
        } else {
          toast.error(response.message || 'Failed to retrieve submission details');
          navigate('/intern/submissions');
        }
      } catch (error) {
        console.error('Error fetching submission details:', error);
        toast.error('Error occurred while loading submission details');
        navigate('/intern/submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionDetails();
  }, [id, navigate]);

  if (loading && !submission) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center font-sans">
        <LoadingSpinner fullScreen={false} />
        <span className="text-slate-400 text-xs font-bold mt-2">Loading submission details...</span>
      </div>
    );
  }

  if (!submission) return null;

  const { taskId, githubLink, documentLink, notes, feedback, status, submittedAt } = submission;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Submission Details"
        description="Review completion notes, reference links, and feedback reviews for this deliverable."
        actions={
          <Link
            to="/intern/submissions"
            className="border border-slate-200 bg-white text-slate-650 hover:bg-slate-50 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer font-sans"
          >
            <FiArrowLeft size={15} />
            Submissions List
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* Core Submission Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notes Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
            <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <FiActivity className="text-blue-500" />
              Completion Notes
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-line bg-slate-50 border border-slate-100 rounded-xl p-4 min-h-[120px]">
              {notes}
            </p>
          </div>

          {/* Links Card */}
          {(githubLink || documentLink) && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
              <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <FiInfo className="text-indigo-500" />
                Submitted Artifacts
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {githubLink && (
                  <a
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-100 text-slate-800 rounded-lg group-hover:bg-slate-200">
                        <FiGithub size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GitHub Link</span>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[150px] block">Repository Code</span>
                      </div>
                    </div>
                    <FiExternalLink size={14} className="text-slate-400 group-hover:text-slate-600" />
                  </a>
                )}

                {documentLink && (
                  <a
                    href={documentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100">
                        <FiBook size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Document URL</span>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[150px] block">Documentation Link</span>
                      </div>
                    </div>
                    <FiExternalLink size={14} className="text-slate-400 group-hover:text-slate-600" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Supervisor Feedback Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
            <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <FiMessageSquare className="text-emerald-500" />
              Supervisor Evaluation Notes
            </h4>
            {feedback ? (
              <p className="text-xs text-slate-650 font-medium leading-relaxed whitespace-pre-line bg-emerald-55/10 border border-emerald-100 rounded-xl p-4 min-h-[80px]">
                {feedback}
              </p>
            ) : (
              <div className="text-slate-350 text-xs italic font-semibold border border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-55/20">
                Evaluation feedback will appear here once reviewed.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info Panels */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Submission Status
            </h4>
            
            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Current Status</span>
              <StatusBadge status={status} />
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600 border border-blue-100 shrink-0">
                <FiCalendar size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Submitted On</span>
                <span className="text-xs font-bold text-slate-800">{formatDate(submittedAt)}</span>
              </div>
            </div>
          </div>

          {/* Task Summary Profile */}
          {task && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">
                Assigned Task Profile
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Task Title</span>
                  <span className="text-xs font-bold text-slate-805 leading-snug">{task.title}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Task Priority</span>
                  <span className="text-xs font-semibold text-slate-650">{task.priority}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Description</span>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-3 leading-relaxed mt-0.5">
                    {task.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default SubmissionDetails;
