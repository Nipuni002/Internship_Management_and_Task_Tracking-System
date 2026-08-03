import React, { useState, useEffect } from 'react';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';
import taskService from '../../services/taskService';

const FilterPanel = ({
  initialFilters = { status: '', date: '', taskId: '' },
  onApply,
  onReset,
  showTaskFilter = false,
}) => {
  const [status, setStatus] = useState(initialFilters.status || '');
  const [date, setDate] = useState(initialFilters.date || '');
  const [taskId, setTaskId] = useState(initialFilters.taskId || '');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (showTaskFilter) {
      const fetchTasks = async () => {
        try {
          const response = await taskService.getAllTasks({ size: 1000 });
          if (response.success && response.data) {
            setTasks(response.data.content || []);
          }
        } catch (error) {
          console.error('Error fetching tasks list for filters:', error);
        }
      };
      fetchTasks();
    }
  }, [showTaskFilter]);

  // Sync state with parent filters
  useEffect(() => {
    setStatus(initialFilters.status || '');
    setDate(initialFilters.date || '');
    setTaskId(initialFilters.taskId || '');
  }, [initialFilters]);

  const handleApply = (e) => {
    e.preventDefault();
    onApply({
      status,
      date,
      taskId,
    });
  };

  const handleReset = () => {
    setStatus('');
    setDate('');
    setTaskId('');
    onReset();
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm font-sans animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-800 uppercase tracking-wider">
        <FiFilter size={15} className="text-blue-500" />
        <span>Filter Submissions</span>
      </div>

      <form onSubmit={handleApply} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Status Filter */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="REVISION_REQUIRED">Revision Required</option>
          </select>
        </div>

        {/* Submission Date Filter */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Submission Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          />
        </div>

        {/* Task Filter (Optional helper) */}
        {showTaskFilter ? (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Task Selection</label>
            <select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="">All Tasks</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="hidden md:block"></div>
        )}

        {/* Actions Row */}
        <div className="md:col-span-3 flex justify-end gap-3 mt-2 border-t border-slate-100 pt-3">
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
