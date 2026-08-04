import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FiSave, FiX, FiLoader } from 'react-icons/fi';
import taskService from '../../services/taskService';
import internService from '../../services/internService';

const TaskForm = ({ initialData = {}, onSubmit, isSubmitting = false, isEdit = false }) => {
  const [projects, setProjects] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  // Setup react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      priority: initialData.priority || 'MEDIUM',
      deadline: initialData.deadline || '',
      status: initialData.status || 'TODO',
      projectId: initialData.projectId || '',
      assignedInternId: initialData.assignedInternId || '',
    },
  });

  // Fetch projects and active interns
  useEffect(() => {
    const fetchMetadata = async () => {
      setLoadingMetadata(true);
      try {
        const projResponse = await taskService.getAllProjects();
        if (projResponse.success && projResponse.data) {
          setProjects(projResponse.data.content || []);
        }

        const internResponse = await internService.getAllInterns({ size: 100, status: 'ACTIVE' });
        if (internResponse.success && internResponse.data) {
          setInterns(internResponse.data.content || []);
        }
      } catch (error) {
        console.error('Error loading form metadata:', error);
      } finally {
        setLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, []);

  if (loadingMetadata) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 flex items-center justify-center gap-3">
        <FiLoader className="animate-spin text-blue-600" size={20} />
        <span className="text-xs font-semibold text-slate-500">Loading form options...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-sans">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
          Task Properties
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Task Title */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="title" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Implement JWT Validation Filter"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.title ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('title', { 
                required: 'Task title is required',
                maxLength: { value: 150, message: 'Title cannot exceed 150 characters' }
              })}
            />
            {errors.title && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Task Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Provide a detailed breakdown of the task requirements..."
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.description ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('description', {
                maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' }
              })}
            />
            {errors.description && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Project dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="projectId" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Assigned Project <span className="text-rose-500">*</span>
            </label>
            <select
              id="projectId"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer ${
                errors.projectId ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('projectId', { required: 'Assigned project is required' })}
            >
              <option value="">-- Select Project --</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.title}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.projectId.message}</p>
            )}
          </div>

          {/* Assigned Intern dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="assignedInternId" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Assigned Intern <span className="text-rose-500">*</span>
            </label>
            <select
              id="assignedInternId"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer ${
                errors.assignedInternId ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('assignedInternId', { required: 'Assigned intern is required' })}
            >
              <option value="">-- Select Intern --</option>
              {interns.map((intern) => (
                <option key={intern.id} value={intern.id}>
                  {intern.firstName} {intern.lastName} ({intern.employeeId})
                </option>
              ))}
            </select>
            {errors.assignedInternId && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.assignedInternId.message}</p>
            )}
          </div>

          {/* Priority dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="priority" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Priority Level <span className="text-rose-500">*</span>
            </label>
            <select
              id="priority"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer ${
                errors.priority ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('priority', { required: 'Priority is required' })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            {errors.priority && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.priority.message}</p>
            )}
          </div>

          {/* Status dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="status" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Task Status <span className="text-rose-500">*</span>
            </label>
            <select
              id="status"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer ${
                errors.status ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('status', { required: 'Status is required' })}
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="REVISION_REQUIRED">Revision Required</option>
              <option value="COMPLETED">Completed</option>
            </select>
            {errors.status && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.status.message}</p>
            )}
          </div>

          {/* Deadline Date */}
          <div className="space-y-1.5">
            <label htmlFor="deadline" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Deadline Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="deadline"
              type="date"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.deadline ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('deadline', { 
                required: 'Deadline date is required',
                validate: (val) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const deadlineDate = new Date(val);
                  return deadlineDate >= today || 'Deadline date cannot be in the past';
                }
              })}
            />
            {errors.deadline && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.deadline.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3.5">
        <Link
          to="/admin/tasks"
          className="border border-slate-200 text-slate-650 hover:bg-slate-50 font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <FiX size={15} />
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <FiLoader size={15} className="animate-spin" />
              Saving Task...
            </>
          ) : (
            <>
              <FiSave size={15} />
              Save Task
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
