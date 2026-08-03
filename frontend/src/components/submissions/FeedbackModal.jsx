import React, { useEffect } from 'react';
import { FiMessageSquare, FiX, FiCheck } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

const FeedbackModal = ({ isOpen, onClose, taskTitle, feedback, status }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800">
            <FiMessageSquare size={18} className="text-blue-500 shrink-0" />
            <h3 className="text-sm font-bold tracking-wide uppercase">Review Feedback</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
            title="Close dialog"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Task Name</span>
            <h4 className="text-xs font-bold text-slate-800 leading-snug">{taskTitle}</h4>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Evaluation Status</span>
            <StatusBadge status={status} />
          </div>

          <div className="space-y-1.5 border-t border-slate-100 pt-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Review Comments</span>
            <p className="text-xs text-slate-650 font-medium leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-4 whitespace-pre-line min-h-[80px]">
              {feedback || <span className="italic text-slate-350">No review comments provided.</span>}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <FiCheck size={14} />
            <span>Acknowledge</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
