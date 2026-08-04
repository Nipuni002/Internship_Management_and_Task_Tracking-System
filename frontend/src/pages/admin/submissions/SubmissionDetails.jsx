import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiBook, FiGithub, FiMessageSquare, FiInfo, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import StatusBadge from '../../../components/submissions/StatusBadge';

import submissionService from '../../../services/submissionService';
import taskService from '../../../services/taskService';
import internService from '../../../services/internService';

const SubmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [task, setTask] = useState(null);
  const [intern, setIntern] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      try {
        const response = await submissionService.getSubmissionById(id);
        if (response.success && response.data) {
          setSubmission(response.data);

          // Fetch associated task profile
          try {
            const taskResponse = await taskService.getTaskById(response.data.taskId);
            if (taskResponse.success && taskResponse.data) {
              setTask(taskResponse.data);

              // Fetch intern profile details
              if (taskResponse.data.assignedInternId) {
                const internResponse = await internService.getInternById(taskResponse.data.assignedInternId);
                if (internResponse.success && internResponse.data) {
                  setIntern(internResponse.data);
                }
              }
            }
          } catch (err) {
            console.error('Error fetching associated task/intern info:', err);
          }
        } else {
          toast.error(response.message || 'Failed to retrieve submission details');
          navigate('/admin/submissions');
        }
      } catch (error) {
        console.error('Error fetching submission details:', error);
        toast.error('Error occurred while loading submission details');
        navigate('/admin/submissions');
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

  const { githubLink, documentLink, notes, feedback, status, submittedAt } = submission;
  const taskTitle = task ? task.title : 'Loading Task...';
  const internName = intern ? `${intern.firstName} ${intern.lastName}` : 'Loading Intern...';

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
        title="Audit Submission Details"
        description={`Audit details and historical log details for submission from ${internName}.`}
        actions={
          <div className="flex items-center gap-2 font-sans">
            <Link
              to="/admin/submissions"
              className="border border-slate-200 bg-white text-slate-650 hover:bg-slate-50 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FiArrowLeft size={15} />
              Registry List
            </Link>
            {status === 'PENDING' && (
              <Link
                to={`/admin/submissions/${id}/review`}
                className="bg-blue-650 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm hover:shadow-md"
              >
                <span>Process Review</span>
              </Link>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* Core details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notes Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <FiActivity className="text-blue-500" />
              Completion Notes
            </h4>
            <p className="text-xs text-slate-650 font-medium leading-relaxed whitespace-pre-line bg-slate-50 border border-slate-100 rounded-xl p-4 min-h-[100px]">
              {notes}
            </p>
          </div>

          {/* Links Card */}
          {(githubLink || documentLink) && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <FiInfo className="text-indigo-500" />
                Submitted Code & Documents
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
                    <FiExternalLinkWrapper />
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
                    <FiExternalLinkWrapper />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Supervisor Feedback Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <FiMessageSquare className="text-emerald-500" />
              Supervisor Evaluation Notes
            </h4>
            {feedback ? (
              <p className="text-xs text-slate-655 font-medium leading-relaxed whitespace-pre-line bg-slate-50 border border-slate-100 rounded-xl p-4 min-h-[80px]">
                {feedback}
              </p>
            ) : (
              <div className="text-slate-350 text-xs italic font-semibold border border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50/50">
                No evaluation notes provided for this submission.
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
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Evaluation Status</span>
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

          {/* Intern Profile Card */}
          {intern && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">
                Submitted By
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-extrabold text-sm flex items-center justify-center border border-slate-200 shrink-0">
                  {intern.firstName.charAt(0)}{intern.lastName.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h5 className="text-xs font-bold text-slate-805 truncate">
                    {intern.firstName} {intern.lastName}
                  </h5>
                  <p className="text-[10px] font-bold text-slate-450 uppercase mt-0.5 tracking-wider">
                    ID: {intern.employeeId}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[10px] font-semibold text-slate-500">
                <div>Email: <span className="text-slate-700 font-bold">{intern.email}</span></div>
                <div>Univ: <span className="text-slate-700 font-bold">{intern.university}</span></div>
              </div>
            </div>
          )}

          {/* Task Summary Profile */}
          {task && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">
                Task Info
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Task Title</span>
                  <span className="text-xs font-bold text-slate-805 leading-snug">{task.title}</span>
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

// Inline external link svg to save file size
const FiExternalLinkWrapper = () => (
  <svg 
    stroke="currentColor" 
    fill="none" 
    strokeWidth="2" 
    viewBox="0 0 24 24" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="text-slate-400 group-hover:text-slate-650 shrink-0" 
    height="14" 
    width="14" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

export default SubmissionDetails;
