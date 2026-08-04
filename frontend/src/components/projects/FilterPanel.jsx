import React, { useState, useEffect } from 'react';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';

const FilterPanel = ({ initialFilters = { status: '', technology: '', deadline: '' }, onApply, onReset }) => {
  const [status, setStatus] = useState(initialFilters.status || '');
  const [technology, setTechnology] = useState(initialFilters.technology || '');
  const [deadline, setDeadline] = useState(initialFilters.deadline || '');

  // Sync state if initialFilters changes
  useEffect(() => {
    setStatus(initialFilters.status || '');
    setTechnology(initialFilters.technology || '');
    setDeadline(initialFilters.deadline || '');
  }, [initialFilters]);

  const handleApply = (e) => {
    e.preventDefault();
    onApply({ status, technology, deadline });
  };

  const handleReset = () => {
    setStatus('');
    setTechnology('');
    setDeadline('');
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
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
        </div>

        {/* Technology Stack Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Technology Stack</label>
          <input
            type="text"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            placeholder="e.g. React"
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-slate-400"
          />
        </div>

        {/* Deadline Date picker */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Before Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          />
        </div>

        {/* Actions */}
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
