import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FiSave, FiX, FiPlus, FiLoader } from 'react-icons/fi';

const ProjectForm = ({ initialData = {}, onSubmit, isSubmitting = false, isEdit = false }) => {
  const [tagInput, setTagInput] = useState('');

  // Form Setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      technology: initialData.technology || [],
      deadline: initialData.deadline || '',
      status: initialData.status || 'ACTIVE',
    },
  });

  const tags = watch('technology') || [];

  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmed = tagInput.trim();
    if (trimmed) {
      // Split by comma in case they type comma-separated items
      const splitTags = trimmed.split(',').map(t => t.trim()).filter(t => t && !tags.includes(t));
      if (splitTags.length > 0) {
        setValue('technology', [...tags, ...splitTags]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setValue('technology', tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-sans">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
          Project Information
        </h4>

        <div className="space-y-5">
          {/* Project Title */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Internship Tracking Portal"
              disabled={isSubmitting}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.title ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('title', { required: 'Project name is required' })}
            />
            {errors.title && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Enter brief details about the project scope, technologies, and milestones..."
              disabled={isSubmitting}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.description ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters long',
                },
              })}
            />
            {errors.description && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Technology Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Technology Stack
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. React, Spring Boot, MongoDB (press Enter or comma to add)"
                disabled={isSubmitting}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={isSubmitting}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-750"
              >
                <FiPlus size={15} />
              </button>
            </div>
            {/* Tag Badges */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                {tags.map((tag, idx) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(idx)}
                      disabled={isSubmitting}
                      className="text-slate-400 hover:text-rose-600 focus:outline-none p-0.5 hover:bg-blue-100 rounded-full"
                    >
                      <FiX size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deadline */}
            <div className="space-y-1.5">
              <label htmlFor="deadline" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Deadline <span className="text-rose-500">*</span>
              </label>
              <input
                id="deadline"
                type="date"
                disabled={isSubmitting}
                className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                  errors.deadline ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
                }`}
                {...register('deadline', {
                  required: 'Deadline is required',
                  validate: (value) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const selDate = new Date(value + 'T00:00:00'); // set to local timezone midnight
                    return (
                      selDate >= today || 'Deadline must be today or in the future'
                    );
                  },
                })}
              />
              {errors.deadline && (
                <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.deadline.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label htmlFor="status" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                id="status"
                disabled={isSubmitting}
                className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                  errors.status ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
                }`}
                {...register('status', { required: 'Status is required' })}
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
              {errors.status && (
                <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Link
          to="/admin/projects"
          className="border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-5 rounded-xl text-xs transition-colors cursor-pointer"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors cursor-pointer shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <FiLoader size={14} className="animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <FiSave size={14} />
              <span>{isEdit ? 'Save Changes' : 'Create Project'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
