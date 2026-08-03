import React, { useState, useEffect } from 'react';
import { FiX, FiSearch, FiSave, FiLoader, FiCheckSquare, FiSquare, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import internService from '../../services/internService';
import projectService from '../../services/projectService';
import LoadingSpinner from '../common/LoadingSpinner';

const AssignInternModal = ({ isOpen, onClose, projectId, projectName, currentAssignedIds = [], onSuccess }) => {
  const [interns, setInterns] = useState([]);
  const [loadingInterns, setLoadingInterns] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync selectedIds with currentAssignedIds when modal opens or currentAssignedIds changes
  useEffect(() => {
    if (isOpen) {
      setSelectedIds([...currentAssignedIds]);
      fetchInterns();
    }
  }, [isOpen, currentAssignedIds]);

  // Load all interns from backend
  const fetchInterns = async () => {
    setLoadingInterns(true);
    try {
      const response = await internService.getAllInterns({ size: 1000 });
      if (response.success && response.data) {
        setInterns(response.data.content || []);
      } else {
        toast.error(response.message || 'Failed to fetch interns');
      }
    } catch (error) {
      console.error('Error fetching interns for assignment:', error);
      toast.error('Failed to load interns list');
    } finally {
      setLoadingInterns(false);
    }
  };

  // Listen for Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Toggle selection
  const handleToggleSelect = (internId) => {
    setSelectedIds((prev) =>
      prev.includes(internId) ? prev.filter((id) => id !== internId) : [...prev, internId]
    );
  };

  // Toggle all visible interns
  const filteredInterns = interns.filter((intern) => {
    const fullName = `${intern.firstName} ${intern.lastName}`.toLowerCase();
    const email = (intern.email || '').toLowerCase();
    const empId = (intern.employeeId || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query) || empId.includes(query);
  });

  const allFilteredSelected = filteredInterns.length > 0 && filteredInterns.every((i) => selectedIds.includes(i.id));

  const handleToggleAllFiltered = () => {
    if (allFilteredSelected) {
      // Deselect all filtered
      const filteredIds = filteredInterns.map((i) => i.id);
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      // Select all filtered
      const newSelections = filteredInterns.map((i) => i.id).filter((id) => !selectedIds.includes(id));
      setSelectedIds((prev) => [...prev, ...newSelections]);
    }
  };

  // Submit/Save assignments
  const handleSave = async () => {
    setSaving(true);
    try {
      // Determine what was added and what was removed
      const addedIds = selectedIds.filter((id) => !currentAssignedIds.includes(id));
      const removedIds = currentAssignedIds.filter((id) => !selectedIds.includes(id));

      const promises = [];
      if (addedIds.length > 0) {
        promises.push(projectService.assignInterns(projectId, addedIds));
      }
      if (removedIds.length > 0) {
        promises.push(projectService.removeInterns(projectId, removedIds));
      }

      if (promises.length > 0) {
        await Promise.all(promises);
        toast.success('Project interns updated successfully!');
      } else {
        toast.success('No changes in intern assignments.');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error assigning/removing interns:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update intern assignments';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase text-slate-800">Assign Interns</h3>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate max-w-[350px]">
              Managing assignments for: <strong className="text-slate-700 font-bold">{projectName}</strong>
            </p>
          </div>
          <button 
            onClick={onClose} 
            disabled={saving}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer disabled:opacity-50"
            title="Close dialog"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Search Bar Panel */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FiSearch size={14} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interns by name, email, ID..."
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Content list (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[250px]">
          {loadingInterns ? (
            <div className="h-full flex flex-col justify-center items-center py-12">
              <LoadingSpinner fullScreen={false} />
              <span className="text-slate-400 text-xs font-bold mt-2">Loading interns list...</span>
            </div>
          ) : filteredInterns.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center py-12 text-slate-400">
              <FiUser size={32} className="stroke-1 mb-2" />
              <p className="text-xs font-bold">No interns match search criteria</p>
              {interns.length === 0 && (
                <p className="text-[10px] font-semibold mt-1">There are no interns registered in the system.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Select All Toggle */}
              <div 
                onClick={handleToggleAllFiltered}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/60 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors select-none text-xs font-bold text-slate-700"
              >
                <span>{allFilteredSelected ? 'Deselect All Filtered' : 'Select All Filtered'}</span>
                <button type="button" className="text-blue-600">
                  {allFilteredSelected ? <FiCheckSquare size={16} /> : <FiSquare size={16} />}
                </button>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {filteredInterns.map((intern) => {
                  const isChecked = selectedIds.includes(intern.id);
                  const isInitiallyAssigned = currentAssignedIds.includes(intern.id);
                  return (
                    <div 
                      key={intern.id}
                      onClick={() => handleToggleSelect(intern.id)}
                      className={`flex items-center justify-between p-3 cursor-pointer transition-colors select-none ${
                        isChecked ? 'bg-blue-50/20 hover:bg-blue-50/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                          {intern.firstName.charAt(0)}{intern.lastName.charAt(0)}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-800">
                            {intern.firstName} {intern.lastName}
                          </h5>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-semibold text-slate-400">
                            <span>ID: {intern.employeeId}</span>
                            <span>•</span>
                            <span className="truncate max-w-[150px]">{intern.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isInitiallyAssigned && (
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-md">
                            Assigned
                          </span>
                        )}
                        <button type="button" className="text-blue-600 focus:outline-none">
                          {isChecked ? (
                            <FiCheckSquare size={18} className="text-blue-600" />
                          ) : (
                            <FiSquare size={18} className="text-slate-350" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
          <span className="text-[10px] font-bold text-slate-450">
            {selectedIds.length} intern(s) selected
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="border border-slate-200 text-slate-600 hover:bg-slate-150 font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loadingInterns}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm hover:shadow-md flex items-center gap-1.5 disabled:opacity-55"
            >
              {saving ? (
                <>
                  <FiLoader size={13} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave size={13} />
                  <span>Save Assignments</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignInternModal;
