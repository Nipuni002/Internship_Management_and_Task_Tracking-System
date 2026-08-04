import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiLink, FiMessageSquare, FiBriefcase, FiUser, FiInfo, FiTrendingUp, FiSave } from 'react-icons/fi';
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

  // Intern update state
  const [selectedStatus, setSelectedStatus] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchTaskDetails = async () => {
    try {
      const response = await taskService.getTaskById(id);
      if (response.success && response.data) {
        const fetchedTask = response.data;
        setTask(fetchedTask);
        setSelectedStatus(fetchedTask.status);
        setSubmissionLink(fetchedTask.submissionLink || '');

        // Fetch project name
        if (fetchedTask.projectId) {
          try {
            const pResponse = await taskService.getAllProjects();
            const project = pResponse.data.content.find((p) => p.id === fetchedTask.projectId);
            setProjectName(project ? project.title : 'Unknown Project');
          } catch {
            setProjectName('Unknown Project');
          }
        }

        // Fetch intern name
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
        navigate('/intern/tasks');
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
      toast.error(error.response?.data?.message || 'Error occurred while loading task details');
      navigate('/intern/tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const handleUpdateSubmission = async (e) => {
    e.preventDefault();

    // Validate URL if entered
    if (submissionLink.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
      if (!urlPattern.test(submissionLink.trim())) {
        toast.error('Please enter a valid submission URL (e.g. https://github.com/...)');
        return;
      }
    }

    setUpdating(true);
    try {
      const response = await taskService.updateTaskStatus(id, {
        status: selectedStatus,
        submissionLink: submissionLink.trim(),
      });
      if (response.success) {
        toast.success(response.message || 'Work submission saved successfully!');
        fetchTaskDetails();
      } else {
        toast.error(response.message || 'Failed to submit work properties');
      }
    } catch (error) {
      console.error('Error updating task submission:', error);
      toast.error(error.response?.data?.message || 'Failed to update work submission');
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
        title="My Task Overview"
        description="Inspect requirements, submit your work outputs, and review supervisor feedback notes."
        actions={
          <Link
            to="/intern/tasks"
            className="border border-slate-200 text-slate-655 hover:bg-slate-50 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FiArrowLeft size={15} />
            My Tasks Board
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* Main Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Information Card */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

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

            {/* Metadata projects & assignees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <FiBriefcase size={15} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Assigned Project</p>
                  <p className="text-xs font-bold text-slate-750 mt-1">{projectName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <FiUser size={15} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Assignee (You)</p>
                  <p className="text-xs font-bold text-slate-750 mt-1">{internName}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Submission and Feedback Cards */}
          <div className="grid grid-cols-1 gap-6">
            {/* Work Submission Panel */}
            <Card title="Task Workspace & Submission">
              <form onSubmit={handleUpdateSubmission} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="statusSelect" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Work Progress State
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
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="linkInput" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Work Output Link (GitHub / Figma / Docs URL)
                    </label>
                    <input
                      id="linkInput"
                      type="text"
                      value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                      placeholder="e.g. https://github.com/internship/repo-name"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-805 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    <FiSave size={14} />
                    {updating ? 'Saving Workspace...' : 'Save Workspace'}
                  </button>
                </div>
              </form>
            </Card>

            {/* Read-Only Feedback Panel */}
            <Card title="Supervisor Feedback Notes">
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <FiMessageSquare size={16} />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Feedback Notes</span>
                </div>
                {task.feedback ? (
                  <p className="text-xs text-slate-650 font-semibold bg-slate-50 border border-slate-105 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                    {task.feedback}
                  </p>
                ) : (
                  <div className="text-xs font-medium text-slate-400 bg-slate-50/50 border border-dashed border-slate-200 p-4 rounded-xl">
                    No feedback comments or reviews left by the supervisor yet.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Info Timeline Sidebar */}
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
