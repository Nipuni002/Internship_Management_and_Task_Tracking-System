import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FiSave, FiX, FiLoader, FiGithub, FiLink2 } from 'react-icons/fi';

const SubmissionForm = ({
  tasks = [], // Array of tasks assigned to the logged-in intern
  initialData = {},
  onSubmit,
  isSubmitting = false,
  isEdit = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      taskId: initialData.taskId || '',
      githubLink: initialData.githubLink || '',
      documentLink: initialData.documentLink || '',
      notes: initialData.notes || '',
    },
  });

  const urlPattern = {
    value: /^https?:\/\/.+/,
    message: 'Must be a valid URL starting with http:// or https://',
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-sans">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
          Deliverable Details
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Task Dropdown Selection */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="taskId" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Select Task <span className="text-rose-500">*</span>
            </label>
            {isEdit ? (
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700">
                {tasks.find((t) => t.id === initialData.taskId)?.title || 'Task Deliverable'}
                <input type="hidden" {...register('taskId', { required: 'Task selection is required' })} />
              </div>
            ) : (
              <select
                id="taskId"
                disabled={isSubmitting}
                className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer ${
                  errors.taskId ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
                }`}
                {...register('taskId', { required: 'Task selection is required' })}
              >
                <option value="">-- Choose Assigned Task --</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title} ({task.status})
                  </option>
                ))}
              </select>
            )}
            {errors.taskId && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.taskId.message}</p>
            )}
          </div>

          {/* GitHub Link */}
          <div className="space-y-1.5">
            <label htmlFor="githubLink" className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <FiGithub size={13} className="text-slate-400" />
              <span>GitHub Repository Link</span>
            </label>
            <input
              id="githubLink"
              type="text"
              placeholder="https://github.com/username/project"
              disabled={isSubmitting}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.githubLink ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('githubLink', {
                pattern: urlPattern,
              })}
            />
            {errors.githubLink && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.githubLink.message}</p>
            )}
          </div>

          {/* Document Link */}
          <div className="space-y-1.5">
            <label htmlFor="documentLink" className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <FiLink2 size={13} className="text-slate-400" />
              <span>Documentation Link</span>
            </label>
            <input
              id="documentLink"
              type="text"
              placeholder="https://docs.google.com/document/d/..."
              disabled={isSubmitting}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.documentLink ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('documentLink', {
                pattern: urlPattern,
              })}
            />
            {errors.documentLink && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.documentLink.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="notes" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Completion Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="notes"
              rows={5}
              placeholder="Detail what accomplishments were completed, dependencies introduced, and configurations to run this build..."
              disabled={isSubmitting}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.notes ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('notes', { required: 'Completion notes are required' })}
            />
            {errors.notes && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.notes.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Link
          to="/intern/submissions"
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
              <span>Submitting Work...</span>
            </>
          ) : (
            <>
              <FiSave size={14} />
              <span>{isEdit ? 'Re-Submit Task' : 'Submit Task'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SubmissionForm;
