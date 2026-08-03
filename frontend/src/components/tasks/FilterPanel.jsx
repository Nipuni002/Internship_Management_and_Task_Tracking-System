import React, { useState, useEffect } from 'react';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';
import taskService from '../../services/taskService';
import internService from '../../services/internService';

const FilterPanel = ({
  initialFilters = { status: '', priority: '', projectId: '', assignedInternId: '', deadline: '' },
  onApply,
  onReset,
  hideAssigneeFilter = false, // useful for MyTasks page where only the current intern's tasks are fetched
}) => {
  const [status, setStatus] = useState(initialFilters.status || '');
  const [priority, setPriority] = useState(initialFilters.priority || '');
  const [projectId, setProjectId] = useState(initialFilters.projectId || '');
  const [assignedInternId, setAssignedInternId] = useState(initialFilters.assignedInternId || '');
  const [deadline, setDeadline] = useState(initialFilters.deadline || '');

  const [projects, setProjects] = useState([]);
  const [interns, setInterns] = useState([]);

  // Fetch projects and interns for selectors
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const projResponse = await taskService.getAllProjects();
        if (projResponse.success && projResponse.data) {
          setProjects(projResponse.data.content || []);
        }

        if (!hideAssigneeFilter) {
          const internResponse = await internService.getAllInterns({ size: 1000 });
          if (internResponse.success && internResponse.data) {
            setInterns(internResponse.data.content || []);
          }
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchMetadata();
  }, [hideAssigneeFilter]);

  // Sync state if initialFilters changes
  useEffect(() => {
    setStatus(initialFilters.status || '');
    setPriority(initialFilters.priority || '');
    setProjectId(initialFilters.projectId || '');
    setAssignedInternId(initialFilters.assignedInternId || '');
    setDeadline(initialFilters.deadline || '');
  }, [initialFilters]);

  const handleApply = (e) => {
    e.preventDefault();
    onApply({ status, priority, projectId, assignedInternId, deadline });
  };

  const handleReset = () => {
    setStatus('');
    setPriority('');
    setProjectId('');
    setAssignedInternId('');
    setDeadline('');
    onReset();
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm font-sans">
      <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-800 uppercase tracking-wider">
        <FiFilter size={15} className="text-blue-500" />
        <span>Filter Panel</span>
      </div>

      <form onSubmit={handleApply} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
        {/* Status Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="REVISION_REQUIRED">Revision Required</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        {/* Project Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Projects</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assigned Intern Selector (only if admin panel) */}
        {!hideAssigneeFilter && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Assigned Intern</label>
            <select
              value={assignedInternId}
              onChange={(e) => setAssignedInternId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="">All Interns</option>
              {interns.map((intern) => (
                <option key={intern.id} value={intern.id}>
                  {intern.firstName} {intern.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Deadline Calendar Select */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Actions Button */}
        <div className={`flex justify-end gap-3 pt-3 mt-2 border-t border-slate-100 ${hideAssigneeFilter ? 'col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-5' : 'col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-5'}`}>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold py-2 px-4 rounded-lg text-xs transition-colors cursor-pointer shrink-0"
          >
            <FiRefreshCw size={13} className="shrink-0" />
            Reset Filters
          </button>
          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-5 rounded-lg text-xs transition-colors cursor-pointer shadow-sm shrink-0"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterPanel;
