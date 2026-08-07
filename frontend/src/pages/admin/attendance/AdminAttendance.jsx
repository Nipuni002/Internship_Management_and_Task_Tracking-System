import React, { useState, useEffect } from 'react';
import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import Card from '../../../components/common/Card';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import attendanceService from '../../../services/attendanceService';
import internService from '../../../services/internService';
import toast from 'react-hot-toast';
import { FiSearch, FiCalendar, FiFileText, FiDownload, FiUserCheck, FiPlus, FiAlertCircle, FiTrash2, FiAlertTriangle, FiX } from 'react-icons/fi';
import { exportToCSV, exportToPDF } from '../../../utils/reportExporter';

const AdminAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('PRESENT');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0, leave: 0 });

  // Delete modal state
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    id: null,
    date: '',
    internName: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [attendanceRes, internsRes, summaryRes] = await Promise.all([
        attendanceService.getAllAttendance({ search: searchQuery, date: filterDate }),
        internService.getAllInterns({ size: 1000 }),
        attendanceService.getMonthlySummary()
      ]);

      if (attendanceRes.success && attendanceRes.data) {
        setLogs(attendanceRes.data.content);
      }
      if (internsRes.success && internsRes.data) {
        setInterns(internsRes.data.content);
      }
      if (summaryRes.success) {
        setSummary(summaryRes.data);
      }
    } catch (error) {
      console.error('Failed to load attendance metadata:', error);
      toast.error('Unable to fetch attendance logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, filterDate]);

  useEffect(() => {
    const handleGlobalSearch = (e) => {
      setSearchQuery(e.detail);
    };
    window.addEventListener('global-search', handleGlobalSearch);
    return () => window.removeEventListener('global-search', handleGlobalSearch);
  }, []);

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!selectedIntern) {
      toast.error('Please select an intern.');
      return;
    }

    try {
      const res = await attendanceService.markAttendance(selectedIntern, selectedStatus, selectedDate);
      if (res.success) {
        toast.success('Attendance recorded successfully!');
        loadData();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error('Failed to mark attendance.');
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF(
        'Intern Attendance Report',
        [
          { label: 'Date', key: 'date' },
          { label: 'Intern Name', key: 'internName' },
          { label: 'Status', key: 'status' },
          { label: 'Check In', key: 'checkIn' },
          { label: 'Check Out', key: 'checkOut' }
        ],
        logs,
        `Attendance_Report_${new Date().toISOString().split('T')[0]}.pdf`
      );
      toast.success('PDF report exported successfully!');
    } catch (e) {
      toast.error('Failed to generate PDF.');
    }
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(
        logs,
        [
          { label: 'Date', key: 'date' },
          { label: 'Intern ID', key: 'internId' },
          { label: 'Intern Name', key: 'internName' },
          { label: 'Status', key: 'status' },
          { label: 'Check In', key: 'checkIn' },
          { label: 'Check Out', key: 'checkOut' }
        ],
        `Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`
      );
      toast.success('CSV report exported successfully!');
    } catch (e) {
      toast.error('Failed to generate CSV.');
    }
  };

  const triggerDeleteModal = (id, date, internName) => {
    setDeleteConfirm({
      isOpen: true,
      id,
      date,
      internName,
    });
  };

  const closeDeleteModal = () => {
    setDeleteConfirm({
      isOpen: false,
      id: null,
      date: '',
      internName: '',
    });
  };

  const handleConfirmDelete = async () => {
    const { id } = deleteConfirm;
    closeDeleteModal();
    setLoading(true);
    try {
      const res = await attendanceService.deleteAttendance(id);
      if (res.success) {
        toast.success('Attendance record deleted successfully!');
        loadData();
      } else {
        toast.error(res.message || 'Failed to delete attendance record.');
        setLoading(false);
      }
    } catch (err) {
      toast.error('Failed to delete attendance record.');
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Intern Attendance" 
        description="Verify daily check-in check-out sessions, log statuses, and export spreadsheet reports."
      />

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner fullScreen={false} /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans text-xs">
          
          {/* Sidebar controls for marking attendance */}
          <div className="lg:col-span-1 space-y-6">
            <Card title="Mark Intern Attendance">
              <form onSubmit={handleMarkAttendance} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Intern</label>
                  <select
                    value={selectedIntern}
                    onChange={(e) => setSelectedIntern(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    required
                  >
                    <option value="">Select Intern</option>
                    {interns.map((intern) => (
                      <option key={intern.id} value={intern.id}>
                        {intern.firstName} {intern.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                    <option value="LATE">Late</option>
                    <option value="LEAVE">Leave</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FiUserCheck size={14} />
                  <span>Log Attendance</span>
                </button>
              </form>
            </Card>
          </div>

          {/* Table display and filtering */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Filter controls panel */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-48">
                  <FiSearch className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-700 focus:outline-none placeholder-slate-450 font-semibold"
                  />
                </div>
                
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none font-semibold"
                />
              </div>

              {/* Exports actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleExportCSV}
                  className="bg-emerald-55 hover:bg-emerald-100/50 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FiDownload size={14} />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="bg-rose-50 hover:bg-rose-100/50 text-rose-700 border border-rose-200 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FiFileText size={14} />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {/* Attendance Logs List Table */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
              <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 mb-4">Daily Logs Table</h4>
              {logs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Intern Name</th>
                        <th className="py-3 px-3 text-center">Status</th>
                        <th className="py-3 px-3 text-center">Check In</th>
                        <th className="py-3 px-3 text-center">Check Out</th>
                        <th className="py-3 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700 font-semibold">
                      {logs.map((log) => {
                        const statusColors = {
                          PRESENT: 'bg-emerald-50 text-emerald-700 border-emerald-150',
                          ABSENT: 'bg-rose-50 text-rose-700 border-rose-150',
                          LATE: 'bg-amber-50 text-amber-700 border-amber-150',
                          LEAVE: 'bg-blue-50 text-blue-700 border-blue-150'
                        };
                        return (
                          <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 px-3">{log.date}</td>
                            <td className="py-3.5 px-3 font-bold text-slate-900">{log.internName}</td>
                            <td className="py-3.5 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${statusColors[log.status] || 'bg-slate-100'}`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-center text-slate-500 font-bold">{log.checkIn || '-'}</td>
                            <td className="py-3.5 px-3 text-center text-slate-500 font-bold">{log.checkOut || '-'}</td>
                            <td className="py-3.5 px-3 text-center">
                              <button
                                onClick={() => triggerDeleteModal(log.id, log.date, log.internName)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Attendance Record"
                              >
                                <FiTrash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 flex flex-col items-center justify-center">
                  <FiAlertCircle size={20} className="text-slate-300 mb-2" />
                  <p className="text-slate-400 font-bold">No Attendance Records Found</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans text-xs">
          <div 
            className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <FiAlertTriangle size={20} className="shrink-0 animate-bounce" />
                <h3 className="text-sm font-bold tracking-wide uppercase">Confirm Delete Attendance</h3>
              </div>
              <button 
                onClick={closeDeleteModal} 
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                title="Close dialog"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6">
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Are you sure you want to permanently delete the attendance log for{' '}
                <strong className="text-slate-950 font-bold">{deleteConfirm.internName}</strong> on{' '}
                <strong className="text-slate-950 font-bold">{deleteConfirm.date}</strong>?
              </p>
              <p className="text-xs text-rose-500/90 mt-2 font-semibold bg-rose-50/70 border border-rose-100 p-2.5 rounded-lg">
                Warning: This action will permanently delete the attendance record and cannot be undone.
              </p>
            </div>

            {/* Actions Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm hover:shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default AdminAttendance;
