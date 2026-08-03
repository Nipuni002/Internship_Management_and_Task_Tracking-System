import React, { useEffect } from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const DeleteTaskModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div 
        className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600">
            <FiAlertTriangle size={20} className="shrink-0 animate-bounce" />
            <h3 className="text-sm font-bold tracking-wide uppercase">Confirm Task Deletion</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-650 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
            title="Close dialog"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            Are you sure you want to permanently delete the task{' '}
            <strong className="text-slate-950 font-bold">{taskTitle}</strong>?
          </p>
          <p className="text-xs text-rose-500 mt-2 font-semibold bg-rose-50 border border-rose-100 p-2.5 rounded-lg">
            Warning: This action will permanently remove this task and cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border border-slate-200 text-slate-650 hover:bg-slate-100 font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm hover:shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
