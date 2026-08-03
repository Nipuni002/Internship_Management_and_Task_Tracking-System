import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FiSave, FiX, FiLoader } from 'react-icons/fi';

const InternForm = ({ initialData = {}, onSubmit, isSubmitting = false, isEdit = false }) => {
  // Setup react-hook-form with default values
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employeeId: initialData.employeeId || '',
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      university: initialData.university || '',
      degree: initialData.degree || '',
      startDate: initialData.startDate || '',
      endDate: initialData.endDate || '',
      status: initialData.status || 'ACTIVE',
    },
  });

  const startDateWatch = watch('startDate');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-sans">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
          Intern Information
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employee ID */}
          <div className="space-y-1.5">
            <label htmlFor="employeeId" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Employee ID <span className="text-rose-500">*</span>
            </label>
            <input
              id="employeeId"
              type="text"
              disabled={isEdit && isSubmitting} // Can disable or make read-only if desired, but request says "Allow updating all editable fields."
              placeholder="e.g. EMP1001"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.employeeId ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('employeeId', { required: 'Employee ID is required' })}
            />
            {errors.employeeId && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.employeeId.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label htmlFor="status" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Status <span className="text-rose-500">*</span>
            </label>
            <select
              id="status"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.status ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('status', { required: 'Status is required' })}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="COMPLETED">Completed</option>
            </select>
            {errors.status && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.status.message}</p>
            )}
          </div>

          {/* First Name */}
          <div className="space-y-1.5">
            <label htmlFor="firstName" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              First Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="First Name"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.firstName ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('firstName', { required: 'First name is required' })}
            />
            {errors.firstName && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <label htmlFor="lastName" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Last Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Last Name"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.lastName ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('lastName', { required: 'Last name is required' })}
            />
            {errors.lastName && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@example.com"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.email ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              id="phone"
              type="text"
              placeholder="e.g. +94771234567 or 0771234567"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.phone ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^\+?[0-9]{7,15}$/,
                  message: 'Invalid phone number format (between 7 and 15 digits)',
                },
              })}
            />
            {errors.phone && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* University */}
          <div className="space-y-1.5">
            <label htmlFor="university" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              University <span className="text-rose-500">*</span>
            </label>
            <input
              id="university"
              type="text"
              placeholder="University"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.university ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('university', { required: 'University is required' })}
            />
            {errors.university && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.university.message}</p>
            )}
          </div>

          {/* Degree */}
          <div className="space-y-1.5">
            <label htmlFor="degree" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Degree Programme <span className="text-rose-500">*</span>
            </label>
            <input
              id="degree"
              type="text"
              placeholder="Degree / Major"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.degree ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('degree', { required: 'Degree is required' })}
            />
            {errors.degree && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.degree.message}</p>
            )}
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <label htmlFor="startDate" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Internship Start Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="startDate"
              type="date"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.startDate ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('startDate', { required: 'Start date is required' })}
            />
            {errors.startDate && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.startDate.message}</p>
            )}
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <label htmlFor="endDate" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Internship End Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="endDate"
              type="date"
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.endDate ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
              {...register('endDate', {
                required: 'End date is required',
                validate: (value) => {
                  if (!startDateWatch) return true;
                  return new Date(value) >= new Date(startDateWatch) || 'End date cannot be prior to start date';
                },
              })}
            />
            {errors.endDate && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.endDate.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form Action buttons */}
      <div className="flex items-center justify-end gap-3.5">
        <Link
          to="/admin/interns"
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
              Saving Profile...
            </>
          ) : (
            <>
              <FiSave size={15} />
              Save Profile
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InternForm;
