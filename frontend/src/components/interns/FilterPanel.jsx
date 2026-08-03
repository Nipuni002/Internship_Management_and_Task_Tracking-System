import React, { useState, useEffect } from 'react';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';

const FilterPanel = ({ initialFilters = { status: '', university: '', degree: '' }, onApply, onReset }) => {
  const [status, setStatus] = useState(initialFilters.status || '');
  const [university, setUniversity] = useState(initialFilters.university || '');
  const [degree, setDegree] = useState(initialFilters.degree || '');

  // Sync state if initialFilters changes
  useEffect(() => {
    setStatus(initialFilters.status || '');
    setUniversity(initialFilters.university || '');
    setDegree(initialFilters.degree || '');
  }, [initialFilters]);

  const handleApply = (e) => {
    e.preventDefault();
    onApply({ status, university, degree });
  };

  const handleReset = () => {
    setStatus('');
    setUniversity('');
    setDegree('');
    onReset();
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm font-sans">
      <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-800 uppercase tracking-wider">
        <FiFilter size={15} className="text-blue-500" />
        <span>Filter Panel</span>
      </div>

      <form onSubmit={handleApply} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        {/* Status Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* University Search Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">University</label>
          <input
            type="text"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="e.g. Stanford University"
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-slate-450"
          />
        </div>

        {/* Degree Search Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Degree</label>
          <input
            type="text"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            placeholder="e.g. Computer Science"
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-slate-450"
          />
        </div>

        {/* Filter Actions */}
        <div className="sm:col-span-3 flex justify-end gap-3 mt-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <FiRefreshCw size={13} className="shrink-0" />
            Reset Filters
          </button>
          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-5 rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterPanel;
