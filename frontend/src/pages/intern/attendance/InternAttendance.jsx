import React, { useState, useEffect } from 'react';
import PageContainer from '../../../components/common/PageContainer';
import PageHeader from '../../../components/layout/PageHeader';
import Card from '../../../components/common/Card';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import attendanceService from '../../../services/attendanceService';
import toast from 'react-hot-toast';
import { FiClock, FiCheckCircle, FiAlertCircle, FiCalendar, FiLogIn, FiLogOut } from 'react-icons/fi';

const InternAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0, leave: 0 });
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [checkedOutToday, setCheckedOutToday] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [attendanceRes, summaryRes] = await Promise.all([
        attendanceService.getPersonalAttendance(),
        attendanceService.getMonthlySummary()
      ]);

      if (attendanceRes.success && attendanceRes.data) {
        const personalLogs = attendanceRes.data.content;
        setLogs(personalLogs);
        
        // Find if check-in exists for today
        const todayStr = new Date().toISOString().split('T')[0];
        const todayLog = personalLogs.find(l => l.date === todayStr);
        if (todayLog) {
          setCheckedInToday(true);
          if (todayLog.checkOut) {
            setCheckedOutToday(true);
          }
        } else {
          setCheckedInToday(false);
          setCheckedOutToday(false);
        }
      }

      if (summaryRes.success) {
        setSummary(summaryRes.data);
      }
    } catch (error) {
      console.error('Failed to load personal attendance:', error);
      toast.error('Unable to fetch attendance log history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckIn = async () => {
    try {
      const res = await attendanceService.checkIn();
      if (res.success) {
        toast.success('Successfully checked in!');
        loadData();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error('Failed to check in.');
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await attendanceService.checkOut();
      if (res.success) {
        toast.success('Successfully checked out!');
        loadData();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error('Failed to check out.');
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="My Attendance" 
        description="Log your daily check-in check-out checkouts and track check-in punctuality."
      />

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner fullScreen={false} /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-sans text-xs">
          
          {/* Check in Check out controller Card */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Daily check-in/out trigger */}
            <Card title="Register Attendance">
              <div className="space-y-4 py-1 text-center">
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-2">
                  <FiClock size={22} />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Punctuality Check</h4>
                <p className="text-[10px] text-slate-450 leading-relaxed max-w-[200px] mx-auto">
                  Standard shift starts at 09:00 AM. Checking in past this timestamp records check-in status as LATE.
                </p>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleCheckIn}
                    disabled={checkedInToday}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 text-white disabled:text-slate-400 font-bold py-2.5 rounded-xl transition-all shadow-xs disabled:shadow-none flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <FiLogIn size={15} />
                    <span>{checkedInToday ? 'Checked In' : 'Check In'}</span>
                  </button>

                  <button
                    onClick={handleCheckOut}
                    disabled={!checkedInToday || checkedOutToday}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-100 text-white disabled:text-slate-400 font-bold py-2.5 rounded-xl transition-all shadow-xs disabled:shadow-none flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <FiLogOut size={15} />
                    <span>{checkedOutToday ? 'Checked Out' : 'Check Out'}</span>
                  </button>
                </div>
              </div>
            </Card>

            {/* Attendance Summary */}
            <Card title="Monthly Breakdown">
              <div className="space-y-3 font-semibold text-slate-600">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Present</span>
                  <span className="text-slate-850 font-black">{summary.present} days</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Late</span>
                  <span className="text-slate-850 font-black">{summary.late} days</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Leave</span>
                  <span className="text-slate-850 font-black">{summary.leave} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Absent</span>
                  <span className="text-slate-850 font-black">{summary.absent} days</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Timeline and Logs Table list */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs h-full flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h4 className="font-bold text-slate-800 text-sm">Attendance Log Timelines</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Chronological</span>
              </div>

              {logs.length > 0 ? (
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse text-xs font-semibold">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3 text-center">Status</th>
                        <th className="py-3 px-3 text-center">Check In Time</th>
                        <th className="py-3 px-3 text-center">Check Out Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700">
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
                            <td className="py-3.5 px-3 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold ${statusColors[log.status] || 'bg-slate-100'}`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-center text-slate-500 font-bold">{log.checkIn || '-'}</td>
                            <td className="py-3.5 px-3 text-center text-slate-500 font-bold">{log.checkOut || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                  <FiCalendar size={24} className="text-slate-300 mb-2" />
                  <p className="text-slate-400 font-bold">No Attendance Records Yet</p>
                  <p className="text-[10px] text-slate-350 font-medium max-w-[200px] mt-1">
                    Check-in shift cards on the sidebar to establish records.
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

export default InternAttendance;
