import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiX, FiCheck, FiRefreshCw, FiAlertTriangle, FiLoader } from 'react-icons/fi';

const ReviewModal = ({ isOpen, onClose, onConfirm, taskTitle, internName }) => {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // 'APPROVE', 'REJECT', 'REVISION'

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      setFeedback('');
      setError('');
      setActionLoading(null);
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAction = async (actionType) => {
    if (!feedback.trim()) {
      setError('Feedback notes are required for review decisions.');
      return;
    }
    setError('');
    setActionLoading(actionType);
    try {
      await onConfirm(actionType, { feedback: feedback.trim() });
    } catch (err) {
      console.error('Review action failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800">
            <FiMessageSquare size={18} className="text-blue-500 shrink-0" />
            <h3 className="text-sm font-bold tracking-wide uppercase">Review Task Submission</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
            title="Close dialog"
            disabled={!!actionLoading}
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Target Deliverable</span>
            <h4 className="text-xs font-bold text-slate-800">{taskTitle}</h4>
            {internName && (
              <span className="text-[10px] font-semibold text-slate-555 block">Submitted by: {internName}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="modalFeedback" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Reviewer Feedback Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="modalFeedback"
              rows={4}
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="Provide constructive feedback explaining approvals, required adjustments, or reason for rejections..."
              disabled={!!actionLoading}
              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                error ? 'border-rose-500 ring-rose-500/10' : 'border-slate-200'
              }`}
            />
            {error && (
              <p className="text-[10px] font-bold text-rose-500 mt-1">{error}</p>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={!!actionLoading}
            className="border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-40"
          >
            Cancel
          </button>

          {/* Request Revision */}
          <button
            onClick={() => handleAction('REVISION')}
            disabled={!!actionLoading}
            className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-40"
          >
            {actionLoading === 'REVISION' ? (
              <FiLoader size={14} className="animate-spin" />
            ) : (
              <FiRefreshCw size={13} />
            )}
            <span>Request Revision</span>
          </button>

          {/* Reject */}
          <button
            onClick={() => handleAction('REJECT')}
            disabled={!!actionLoading}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-40"
          >
            {actionLoading === 'REJECT' ? (
              <FiLoader size={14} className="animate-spin" />
            ) : (
              <FiAlertTriangle size={13} />
            )}
            <span>Reject</span>
          </button>

          {/* Approve */}
          <button
            onClick={() => handleAction('APPROVE')}
            disabled={!!actionLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-40"
          >
            {actionLoading === 'APPROVE' ? (
              <FiLoader size={14} className="animate-spin" />
            ) : (
              <FiCheck size={13} />
            )}
            <span>Approve</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
