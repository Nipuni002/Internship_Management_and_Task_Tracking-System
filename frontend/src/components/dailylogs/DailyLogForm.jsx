import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FiSave, FiX, FiLoader } from 'react-icons/fi';

const DailyLogForm = ({ initialData = {}, onSubmit, isSubmitting = false, isEdit = false }) => {
  // Get today's date in yyyy-MM-dd format for native HTML validation
  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: initialData.date || todayStr,
      hoursWorked: initialData.hoursWorked || '',
      completedWork: initialData.completedWork || '',
      currentWork: initialData.currentWork || '',
      challenges: initialData.challenges || '',
      nextDayPlan: initialData.nextDayPlan || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-sans">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
          Log Properties
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Selector */}
          <div className="space-y-1.5">
            <label htmlFor="date" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Log Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="date"
              type="date"
              max={todayStr}
              disabled={isSubmitting}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer ${
                errors.date ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('date', {
                required: 'Date is required',
                validate: (value) => {
                  const selectDate = new Date(value + 'T00:00:00');
                  const today = new Date();
                  today.setHours(23, 59, 59, 999);
                  return selectDate <= today || 'Daily log date cannot be in the future';
                },
              })}
            />
            {errors.date && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Hours Worked */}
          <div className="space-y-1.5">
            <label htmlFor="hoursWorked" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Hours Worked <span className="text-rose-500">*</span>
            </label>
            <input
              id="hoursWorked"
              type="number"
              step="0.1"
              placeholder="e.g. 8.0"
              disabled={isSubmitting}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.hoursWorked ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('hoursWorked', {
                required: 'Hours worked is required',
                valueAsNumber: true,
                min: { value: 0.1, message: 'Hours worked must be at least 0.1' },
                max: { value: 24.0, message: 'Hours worked cannot exceed 24.0' },
              })}
            />
            {errors.hoursWorked && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.hoursWorked.message}</p>
            )}
          </div>

          {/* Completed Work Description */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="completedWork" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Completed Work <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="completedWork"
              rows={4}
              placeholder="Detail what task requirements or actions were successfully delivered today..."
              disabled={isSubmitting}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.completedWork ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('completedWork', { required: 'Completed work details are required' })}
            />
            {errors.completedWork && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.completedWork.message}</p>
            )}
          </div>

          {/* Current Work Description */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="currentWork" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Current Work <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="currentWork"
              rows={3}
              placeholder="What deliverables are currently in progress or active right now?"
              disabled={isSubmitting}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.currentWork ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('currentWork', { required: 'Current work details are required' })}
            />
            {errors.currentWork && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.currentWork.message}</p>
            )}
          </div>

          {/* Challenges / Blockers */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="challenges" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Challenges & Obstacles
            </label>
            <textarea
              id="challenges"
              rows={3}
              placeholder="Encountered any code dependencies, blockers, environment configurations issues? (Optional)"
              disabled={isSubmitting}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              {...register('challenges')}
            />
          </div>

          {/* Next Day Plan */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="nextDayPlan" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Next Day Plan
            </label>
            <textarea
              id="nextDayPlan"
              rows={3}
              placeholder="What are the key goals or milestones you plan to focus on tomorrow? (Optional)"
              disabled={isSubmitting}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              {...register('nextDayPlan')}
            />
          </div>
        </div>
      </div>

      {/* Action panel */}
      <div className="flex justify-end gap-3">
        <Link
          to="/intern/logs"
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
              <span>{isEdit ? 'Save Changes' : 'Submit Daily Log'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default DailyLogForm;
