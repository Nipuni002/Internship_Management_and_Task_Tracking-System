import React, { useState, useEffect } from 'react';
import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import Card from '../../../components/common/Card';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import leaveService from '../../../services/leaveService';
import toast from 'react-hot-toast';
import { FiPlus, FiCalendar, FiFileText, FiClock, FiTrash2, FiAlertCircle } from 'react-icons/fi';

const InternLeaveList = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  
  // Leave Form State
  const [formData, setFormData] = useState({
    leaveType: 'SICK',
    startDate: '',
    endDate: '',
    reason: '',
    halfDay: false,
  });

  const [applying, setApplying] = useState(false);

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const res = await leaveService.getPersonalLeaves();
      if (res.success && res.data) {
        setLeaves(res.data.content);
      }
    } catch (err) {
      toast.error('Failed to retrieve leave history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'halfDay') {
      setFormData(prev => ({
        ...prev,
        halfDay: checked,
        endDate: checked ? prev.startDate : prev.endDate
      }));
    } else if (name === 'startDate') {
      setFormData(prev => ({
        ...prev,
        startDate: value,
        endDate: prev.halfDay ? value : prev.endDate
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = { ...formData };
    if (finalData.halfDay) {
      finalData.endDate = finalData.startDate;
    }

    if (!finalData.startDate || !finalData.endDate || !finalData.reason) {
      toast.error('All fields are required.');
      return;
    }

    if (new Date(finalData.startDate) > new Date(finalData.endDate)) {
      toast.error('Start date must be before or equal to End date.');
      return;
    }

    setApplying(true);
    try {
      const res = await leaveService.applyForLeave(finalData);
      if (res.success) {
        toast.success('Leave requested successfully!');
        setFormData({
          leaveType: 'SICK',
          startDate: '',
          endDate: '',
          reason: '',
          halfDay: false,
        });
        loadLeaves();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error('Failed to submit leave request.');
    } finally {
      setApplying(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this pending leave request?')) {
      try {
        const res = await leaveService.cancelLeaveRequest(id);
        if (res.success) {
          toast.success(res.message);
          loadLeaves();
        } else {
          toast.error(res.message);
        }
      } catch (err) {
        toast.error('Failed to cancel request.');
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Leave Requests" 
        description="Request time-offs, check administrator approval status, and manage active pending requests."
      />

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner fullScreen={false} /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans text-xs">
          
          {/* Apply leave form */}
          <div className="lg:col-span-1 space-y-6">
            <Card title="Apply for Leave">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Leave Type</label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value="SICK">Sick Leave</option>
                    <option value="CASUAL">Casual Leave</option>
                    <option value="ANNUAL">Annual Leave</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 py-1 select-none">
                  <input
                    type="checkbox"
                    id="halfDay"
                    name="halfDay"
                    checked={formData.halfDay}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="halfDay" className="text-xs font-semibold text-slate-650 cursor-pointer">
                    Half-day Leave
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    {formData.halfDay ? 'Date' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    required
                  />
                </div>

                {!formData.halfDay && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                      required
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Reason</label>
                  <textarea
                    name="reason"
                    rows="3"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Brief description of reasoning..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none placeholder-slate-400 font-sans"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={applying}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FiPlus size={14} />
                  <span>{applying ? 'Submitting...' : 'Apply Leave'}</span>
                </button>
              </form>
            </Card>
          </div>

          {/* Leave History List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs h-full flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h4 className="font-bold text-slate-800 text-sm">Leave Applications History</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Requests</span>
              </div>

              {leaves.length > 0 ? (
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {leaves.map((item) => (
                    <div key={item.id} className="bg-slate-50/50 border border-slate-150 rounded-xl p-4 flex flex-col sm:flex-row items-start justify-between gap-3 shadow-xs hover:border-slate-300 transition-colors">
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                           <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[9px] font-bold uppercase border border-blue-200">
                            {item.leaveType} {item.halfDay ? '(Half Day)' : ''}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold ${getStatusStyle(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          <FiCalendar size={12} className="text-slate-400" />
                          <span>
                            {item.halfDay 
                              ? `Date: ${item.startDate}` 
                              : `Dates: ${item.startDate} to ${item.endDate}`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-650 font-semibold">{item.reason}</p>
                      </div>

                      <div className="shrink-0 flex items-center self-end sm:self-start">
                        {item.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancel(item.id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                            title="Cancel Application"
                          >
                            <FiTrash2 size={13} /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                  <FiClock size={24} className="text-slate-300 mb-2" />
                  <p className="text-slate-400 font-bold">No Leave Requests Found</p>
                  <p className="text-[10px] text-slate-350 font-medium max-w-[200px] mt-1">
                    Submit requested dates on the sidebar to launch leave request workflows.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </PageContainer>
  );
};

export default InternLeaveList;
