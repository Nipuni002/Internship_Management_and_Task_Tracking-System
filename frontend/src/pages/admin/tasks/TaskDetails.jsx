import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiClock, FiLink, FiMessageSquare, FiBriefcase, FiUser, FiInfo, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Card from '../../../components/common/Card';
import TaskStatusBadge from '../../../components/tasks/TaskStatusBadge';
import PriorityBadge from '../../../components/tasks/PriorityBadge';

import taskService from '../../../services/taskService';
import internService from '../../../services/internService';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  
  // Lookups
  const [projectName, setProjectName] = useState('Loading Project...');
  const [internName, setInternName] = useState('Loading Intern...');

  // Admin status/feedback update state
  const [selectedStatus, setSelectedStatus] = useState('');
  const [feedback, setFeedback] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchTaskDetails = async () => {
    try {
      const response = await taskService.getTaskById(id);
      if (response.success && response.data) {
        const fetchedTask = response.data;
        setTask(fetchedTask);
        setSelectedStatus(fetchedTask.status);
        setFeedback(fetchedTask.feedback || '');

        // Fetch project and intern names
        if (fetchedTask.projectId) {
          try {
            const pResponse = await taskService.getAllProjects();
            const project = pResponse.data.content.find((p) => p.id === fetchedTask.projectId);
            setProjectName(project ? project.title : 'Unknown Project');
          } catch {
            setProjectName('Unknown Project');
          }
        }

        if (fetchedTask.assignedInternId) {
          try {
            const iResponse = await internService.getInternById(fetchedTask.assignedInternId);
            if (iResponse.success && iResponse.data) {
              setInternName(`${iResponse.data.firstName} ${iResponse.data.lastName}`);
            } else {
              setInternName('Unknown Intern');
            }
          } catch {
            setInternName('Unknown Intern');
          }
        }
      } else {
        toast.error(response.message || 'Failed to fetch task details');
        navigate('/admin/tasks');
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
      toast.error(error.response?.data?.message || 'Error occurred while loading task details');
      navigate('/admin/tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const handleUpdateStatusAndFeedback = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await taskService.updateTaskStatus(id, {
        status: selectedStatus,
        feedback: feedback.trim(),
      });
      if (response.success) {
        toast.success(response.message || 'Task status & feedback updated successfully');
        fetchTaskDetails();
      } else {
        toast.error(response.message || 'Failed to update task properties');
      }
    } catch (error) {
      console.error('Error updating task status/feedback:', error);
      toast.error(error.response?.data?.message || 'Failed to update task properties');
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !task) {
    return <LoadingSpinner />;
  }

  if (!task) return null;

  return (
    <PageContainer>
      <PageHeader
        title="Admin Task Details"
        description="Inspect development task records, review submitted work links, and leave feedback instructions."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/tasks"
              className="border border-slate-200 text-slate-655 hover:bg-slate-50 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FiArrowLeft size={15} />
              Checklist Registry
            </Link>
            <Link
              to={`/admin/tasks/${id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md hover:shadow-lg"
            >
              <FiEdit size={15} />
              Edit Task Properties
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* Main Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

            {/* Task Info */}
            <div className="border-b border-slate-100 pb-5">
              <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                <PriorityBadge priority={task.priority} />
                <TaskStatusBadge status={task.status} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">{task.title}</h3>
              {task.description ? (
                <p className="text-xs text-slate-600 leading-relaxed font-medium mt-3 whitespace-pre-wrap">
                  {task.description}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic mt-3">No description provided.</p>
              )}
            </div>

            {/* Metadata references */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <FiBriefcase size={15} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Development Project</p>
                  <p className="text-xs font-bold text-slate-750 mt-1">{projectName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <FiUser size={15} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Assigned Member</p>
                  <p className="text-xs font-bold text-slate-750 mt-1">{internName}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Submission and Feedback Reviews */}
          <Card title="Review Work Submission" className="space-y-5">
            {/* Submission Link */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <FiLink className="text-slate-400" />
                Work Output Link
              </h4>
              {task.submissionLink ? (
                <a
                  href={task.submissionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-blue-650 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
                >
                  <FiLink size={14} />
                  Open Work Output in New Tab
                </a>
              ) : (
                <div className="text-xs font-medium text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 p-4 rounded-xl">
                  Intern has not supplied any work output submission links yet.
                </div>
              )}
            </div>

            {/* Admin evaluation form */}
            <form onSubmit={handleUpdateStatusAndFeedback} className="space-y-4 border-t border-slate-100 pt-5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <FiMessageSquare className="text-slate-400" />
                Task Review & Feedback
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="statusSelect" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Override Status
                  </label>
                  <select
                    id="statusSelect"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full md:w-1/2 bg-slate-50 border border-slate-200 text-slate-805 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="TODO">Todo</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="REVISION_REQUIRED">Revision Required</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="feedbackInput" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Feedback Notes / Revision Comments
                  </label>
                  <textarea
                    id="feedbackInput"
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter review notes, feedback guidelines, or reasons for requesting revision..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-805 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {updating ? 'Saving Changes...' : 'Save Status & Feedback'}
                </button>
              </div>
            </form>
          </Card>
        </div>

        {/* Timeline Sidebar */}
        <div className="space-y-6">
          <Card title="Task Timeline" className="relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-450 flex items-center gap-1.5">
                  <FiClock size={13} className="text-slate-400" />
                  Task Deadline
                </span>
                <span className="text-slate-800 font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                  {task.deadline}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold border-t border-slate-105 pt-3">
                <span className="text-slate-450 flex items-center gap-1.5">
                  <FiInfo size={13} className="text-slate-400" />
                  Date Created
                </span>
                <span className="text-slate-550 font-bold">
                  {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold border-t border-slate-105 pt-3">
                <span className="text-slate-450 flex items-center gap-1.5">
                  <FiTrendingUp size={13} className="text-slate-400" />
                  Last Updated
                </span>
                <span className="text-slate-550 font-bold">
                  {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default TaskDetails;
