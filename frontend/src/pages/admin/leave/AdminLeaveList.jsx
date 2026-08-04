import React, { useState, useEffect } from 'react';
import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import Card from '../../../components/common/Card';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import leaveService from '../../../services/leaveService';
import useNotifications from '../../../hooks/useNotifications';
import toast from 'react-hot-toast';
import { FiSearch, FiCalendar, FiCheck, FiX, FiClock, FiAlertCircle } from 'react-icons/fi';

const AdminLeaveList = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  
  // Filter settings
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Notifications trigger
  const { addNotification } = useNotifications();

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const res = await leaveService.getAllLeaves({ 
        search: searchQuery, 
        status: filterStatus 
      });
      if (res.success && res.data) {
        setLeaves(res.data.content);
      }
    } catch (err) {
      toast.error('Failed to retrieve leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, [searchQuery, filterStatus]);

  useEffect(() => {
    const handleGlobalSearch = (e) => {
      setSearchQuery(e.detail);
    };
    window.addEventListener('global-search', handleGlobalSearch);
    return () => window.removeEventListener('global-search', handleGlobalSearch);
  }, []);

  const handleApprove = async (id, internName, leaveType) => {
    try {
      const res = await leaveService.approveLeave(id);
      if (res.success) {
        toast.success(`Leave request approved for ${internName}.`);
        
        // Notify the intern
        addNotification(
          'Leave Approved 🎉',
          `Your requested ${leaveType} leave has been APPROVED by the administrator.`,
          'LEAVE',
          'ROLE_INTERN'
        );

        loadLeaves();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error('Approval failed.');
    }
  };

  const handleReject = async (id, internName, leaveType) => {
    if (window.confirm(`Are you sure you want to reject ${internName}'s leave request?`)) {
      try {
        const res = await leaveService.rejectLeave(id);
        if (res.success) {
          toast.success(`Leave request rejected for ${internName}.`);
          
          // Notify the intern
          addNotification(
            'Leave Rejected ❌',
            `Your requested ${leaveType} leave has been REJECTED by the administrator.`,
            'LEAVE',
            'ROLE_INTERN'
          );

          loadLeaves();
        } else {
          toast.error(res.message);
        }
      } catch (err) {
        toast.error('Rejection failed.');
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
        title="Manage Leaves" 
        description="Review all intern time-off requests, verify details, and approve or reject submissions."
      />

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner fullScreen={false} /></div>
      ) : (
        <div className="space-y-4 font-sans text-xs">
          
          {/* Filtering panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search by intern name or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-700 focus:outline-none placeholder-slate-400 font-semibold"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-48 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Leaves Board Card list */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
            <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 mb-4">Intern Leave Applications Board</h4>

            {leaves.length > 0 ? (
              <div className="space-y-4">
                {leaves.map((item) => (
                  <div key={item.id} className="bg-slate-50/50 border border-slate-150 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-slate-350 transition-colors">
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.internName}</span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-700 text-[9px] font-bold uppercase">
                          {item.leaveType}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${getStatusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-450 uppercase tracking-wide">
                        <FiCalendar size={12} />
                        <span>Dates: {item.startDate} to {item.endDate}</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        Reason: "{item.reason}"
                      </p>
                    </div>

                    {/* Approve/Reject Controls */}
                    <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                      {item.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleApprove(item.id, item.internName, item.leaveType)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                          >
                            <FiCheck size={13} /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(item.id, item.internName, item.leaveType)}
                            className="bg-rose-50 border border-rose-250 text-rose-600 hover:bg-rose-100 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                          >
                            <FiX size={13} /> Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Processed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 flex flex-col items-center justify-center">
                <FiClock size={24} className="text-slate-350 mb-2" />
                <p className="text-slate-400 font-bold">No Leave Applications Found</p>
              </div>
            )}
          </div>

        </div>
      )}
    </PageContainer>
  );
};

export default AdminLeaveList;
