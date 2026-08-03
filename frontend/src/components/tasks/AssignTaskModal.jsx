import React, { useState, useEffect } from 'react';
import { FiUsers, FiX, FiLoader } from 'react-icons/fi';
import internService from '../../services/internService';
import toast from 'react-hot-toast';

const AssignTaskModal = ({ isOpen, onClose, onAssign, taskTitle, currentAssigneeId }) => {
  const [interns, setInterns] = useState([]);
  const [selectedInternId, setSelectedInternId] = useState(currentAssigneeId || '');
  const [loading, setLoading] = useState(false);

  // Restores selectedInternId when currentAssigneeId changes
  useEffect(() => {
    setSelectedInternId(currentAssigneeId || '');
  }, [currentAssigneeId]);

  // Fetch interns when the modal opens
  useEffect(() => {
    const fetchAvailableInterns = async () => {
      if (!isOpen) return;
      setLoading(true);
      try {
        const response = await internService.getAllInterns({ size: 100, status: 'ACTIVE' });
        if (response.success && response.data) {
          setInterns(response.data.content || []);
        } else {
          toast.error('Failed to load interns for assignment');
        }
      } catch (error) {
        console.error('Error fetching interns:', error);
        toast.error('Error loading interns listing');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableInterns();
  }, [isOpen]);

  // ESC key listener
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedInternId) {
      toast.error('Please select an intern to assign this task');
      return;
    }
    onAssign(selectedInternId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div 
        className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <FiUsers size={20} className="shrink-0" />
            <h3 className="text-sm font-bold tracking-wide uppercase">Assign / Reassign Task</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-650 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
            title="Close dialog"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-450 uppercase tracking-wider">Task Title</p>
              <p className="text-sm font-bold text-slate-805 mt-1 leading-snug">{taskTitle}</p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="internSelect" className="block text-xs font-bold text-slate-705 uppercase tracking-wide">
                Select Assignee <span className="text-rose-500">*</span>
              </label>
              {loading ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-550 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
                  <FiLoader className="animate-spin text-blue-600" size={15} />
                  <span>Loading active interns...</span>
                </div>
              ) : (
                <select
                  id="internSelect"
                  value={selectedInternId}
                  onChange={(e) => setSelectedInternId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="">-- Choose Intern --</option>
                  {interns.map((intern) => (
                    <option key={intern.id} value={intern.id}>
                      {intern.firstName} {intern.lastName} ({intern.employeeId})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;
