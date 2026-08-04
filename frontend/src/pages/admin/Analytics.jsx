import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiActivity, FiClock, FiCheckCircle, FiFileText, FiUsers, FiRotateCw, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { exportToCSV, exportToPDF } from '../../utils/reportExporter';
import PageContainer from '../../components/common/PageContainer';
import PageHeader from '../../components/layout/PageHeader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import StatisticCard from '../../components/dashboard/StatisticCard';

// Recharts imports
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';

// Services
import internService from '../../services/internService';
import projectService from '../../services/projectService';
import taskService from '../../services/taskService';
import dailyLogService from '../../services/dailyLogService';
import submissionService from '../../services/submissionService';
import attendanceService from '../../services/attendanceService';
import leaveService from '../../services/leaveService';
import evaluationService from '../../services/evaluationService';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Raw state collections
  const [metrics, setMetrics] = useState({
    totalHours: 0,
    avgHoursPerIntern: 0,
    taskCompletionRate: 0,
    submissionApprovalRate: 0,
  });

  const [chartsData, setChartsData] = useState({
    internPerformance: [],
    submissionBreakdown: [],
    projectTaskComparison: [],
    dailyHoursTimeline: [],
  });

  const [extraChartsData, setExtraChartsData] = useState({
    attendanceOverview: [],
    leaveStats: [],
    performanceScores: [],
  });

  const [internPerformanceList, setInternPerformanceList] = useState([]);

  const loadAnalyticsData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Parallel fetches for speed and stability
      const [internsRes, projectsRes, tasksRes, logsRes, submissionsRes, attendanceRes, leavesRes, evaluationsRes] = await Promise.all([
        internService.getAllInterns({ size: 1000 }),
        projectService.getAllProjects({ size: 1000 }),
        taskService.getAllTasks({ size: 1000 }),
        dailyLogService.getAllLogs({ size: 1000 }),
        submissionService.getAllSubmissions({ size: 1000 }),
        attendanceService.getAllAttendance({ size: 1000 }),
        leaveService.getAllLeaves({ size: 1000 }),
        evaluationService.getEvaluations({ size: 1000 }),
      ]);

      const interns = (internsRes.success && internsRes.data?.content) || [];
      const projects = (projectsRes.success && projectsRes.data?.content) || [];
      const tasks = (tasksRes.success && tasksRes.data?.content) || [];
      const logs = (logsRes.success && logsRes.data?.content) || [];
      const submissions = (submissionsRes.success && submissionsRes.data?.content) || [];

      // 1. Calculate General Aggregations
      const totalHours = logs.reduce((sum, l) => sum + (l.hoursWorked || 0), 0);
      const avgHours = interns.length > 0 ? totalHours / interns.length : 0;
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
      const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      const totalSubmissions = submissions.length;
      const approvedSubmissions = submissions.filter(s => s.status === 'APPROVED').length;
      const submissionApprovalRate = totalSubmissions > 0 ? (approvedSubmissions / totalSubmissions) * 100 : 0;

      setMetrics({
        totalHours,
        avgHoursPerIntern: avgHours,
        taskCompletionRate,
        submissionApprovalRate,
      });

      // 2. Compute Intern Performance Comparison (Bar Chart + List Grid)
      const performance = interns.map((intern) => {
        const fullName = `${intern.firstName} ${intern.lastName}`;
        const internLogs = logs.filter((l) => l.internId === intern.id);
        const hoursLogged = internLogs.reduce((sum, l) => sum + (l.hoursWorked || 0), 0);
        
        const internTasks = tasks.filter((t) => t.assignedInternId === intern.id);
        const resolvedTasks = internTasks.filter((t) => t.status === 'COMPLETED').length;
        const pendingTasks = internTasks.length - resolvedTasks;

        return {
          id: intern.id,
          name: fullName,
          university: intern.university || 'Unknown University',
          hours: hoursLogged,
          completedTasks: resolvedTasks,
          totalTasks: internTasks.length,
          pendingTasks
        };
      });

      // Sort by hours descending
      performance.sort((a, b) => b.hours - a.hours);
      setInternPerformanceList(performance);

      const processedPerformanceChart = performance.slice(0, 10).map(p => ({
        name: p.name.split(' ')[0], // First name only to prevent XAxis overcrowding
        hours: p.hours,
        tasks: p.completedTasks
      }));

      // 3. Process Submission Status Distribution (Pie Chart)
      const subStatuses = {
        'APPROVED': 0,
        'PENDING': 0,
        'REVISION REQUIRED': 0,
        'REJECTED': 0
      };

      submissions.forEach(s => {
        const status = s.status?.replace(/_/g, ' ').toUpperCase();
        if (subStatuses[status] !== undefined) {
          subStatuses[status]++;
        }
      });

      const processedSubmissionChart = Object.keys(subStatuses).map(key => ({
        name: key,
        value: subStatuses[key]
      }));

      // 4. Project Tasks Comparison (Stacked Bar Chart: Completed vs Pending)
      const processedProjectTasksChart = projects.slice(0, 8).map(p => {
        const projTasks = tasks.filter(t => t.projectId === p.id);
        const completed = projTasks.filter(t => t.status === 'COMPLETED').length;
        const pending = projTasks.length - completed;
        return {
          name: p.title.length > 12 ? p.title.substring(0, 12) + '...' : p.title,
          completed,
          pending
        };
      });

      // 5. Daily Log Hours Timeline Trend (Line Chart)
      const hoursByDate = {};
      logs.forEach(l => {
        if (!l.date) return;
        hoursByDate[l.date] = (hoursByDate[l.date] || 0) + (l.hoursWorked || 0);
      });

      // Take last 15 days of activity to show neat line chart
      const sortedDates = Object.keys(hoursByDate).sort();
      const last15Dates = sortedDates.slice(-15);
      const processedDailyHoursChart = last15Dates.map(date => {
        // Format to "Month Day" e.g. "Aug 4"
        const parts = date.split('-');
        let label = date;
        if (parts.length >= 3) {
          const dummy = new Date(parts[0], parseInt(parts[1], 10) - 1, parts[2]);
          label = dummy.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        }
        return {
          name: label,
          hours: hoursByDate[date]
        };
      });

      // Feature 7 - Additional Charts processing
      const attLogs = (attendanceRes.success && attendanceRes.data?.content) || [];
      const attCounts = { PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 };
      attLogs.forEach(log => {
        if (attCounts[log.status] !== undefined) {
          attCounts[log.status]++;
        }
      });
      const attendanceChart = Object.keys(attCounts).map(status => ({
        name: status,
        count: attCounts[status]
      }));

      const leaveLogs = (leavesRes.success && leavesRes.data?.content) || [];
      const leaveCounts = { SICK: 0, CASUAL: 0, ANNUAL: 0 };
      leaveLogs.forEach(req => {
        const type = req.leaveType?.toUpperCase();
        if (leaveCounts[type] !== undefined) {
          leaveCounts[type]++;
        }
      });
      const leavesChart = Object.keys(leaveCounts).map(type => ({
        name: type,
        value: leaveCounts[type]
      }));

      const evalLogs = (evaluationsRes.success && evaluationsRes.data?.content) || [];
      const perfChart = evalLogs.map(ev => ({
        name: ev.internName.split(' ')[0],
        score: ev.overallScore
      })).slice(0, 10);

      setChartsData({
        internPerformance: processedPerformanceChart,
        submissionBreakdown: processedSubmissionChart,
        projectTaskComparison: processedProjectTasksChart,
        dailyHoursTimeline: processedDailyHoursChart,
      });

      setExtraChartsData({
        attendanceOverview: attendanceChart,
        leaveStats: leavesChart,
        performanceScores: perfChart
      });

      if (isRefresh) {
        toast.success('Analytics graphs refreshed');
      }
    } catch (error) {
      console.error('Error compiling analytics dashboards:', error);
      toast.error('Could not construct system analytics dashboards.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const handleExportCSV = () => {
    try {
      const csvData = internPerformanceList.map(intern => ({
        name: intern.name,
        university: intern.university,
        completedTasks: intern.completedTasks,
        totalTasks: intern.totalTasks,
        hours: intern.hours.toFixed(1),
        rate: intern.totalTasks > 0 ? ((intern.completedTasks / intern.totalTasks) * 100).toFixed(1) + '%' : '0%'
      }));

      exportToCSV(
        csvData,
        [
          { label: 'Intern Name', key: 'name' },
          { label: 'University', key: 'university' },
          { label: 'Completed Tasks', key: 'completedTasks' },
          { label: 'Total Tasks', key: 'totalTasks' },
          { label: 'Hours Logged', key: 'hours' },
          { label: 'Completion Rate', key: 'rate' }
        ],
        `Intern_Progress_Report_${new Date().toISOString().split('T')[0]}.csv`
      );
      toast.success('Progress report exported as CSV!');
    } catch (e) {
      toast.error('Failed to export CSV report.');
    }
  };

  const handleExportPDF = () => {
    try {
      const pdfData = internPerformanceList.map(intern => ({
        name: intern.name,
        university: intern.university,
        completedTasks: String(intern.completedTasks),
        totalTasks: String(intern.totalTasks),
        hours: intern.hours.toFixed(1) + ' hrs',
        rate: intern.totalTasks > 0 ? ((intern.completedTasks / intern.totalTasks) * 100).toFixed(1) + '%' : '0%'
      }));

      exportToPDF(
        'Intern Progress & Engagement Report',
        [
          { label: 'Name', key: 'name' },
          { label: 'University', key: 'university' },
          { label: 'Tasks Done', key: 'completedTasks' },
          { label: 'Total Tasks', key: 'totalTasks' },
          { label: 'Hours Logged', key: 'hours' },
          { label: 'Rate %', key: 'rate' }
        ],
        pdfData,
        `Intern_Progress_Report_${new Date().toISOString().split('T')[0]}.pdf`
      );
      toast.success('Progress report exported as PDF!');
    } catch (e) {
      toast.error('Failed to export PDF report.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center">
        <LoadingSpinner fullScreen={false} />
        <span className="text-slate-400 text-xs font-bold font-sans mt-2">Compiling System Metrics and Analytics...</span>
      </div>
    );
  }

  // Submission Pie Chart Colors
  const SUBMISSION_COLORS = {
    'APPROVED': '#10b981', // Emerald
    'PENDING': '#3b82f6', // Blue
    'REVISION REQUIRED': '#f59e0b', // Amber
    'REJECTED': '#f43f5e' // Rose
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-5 font-sans">
        
        <PageHeader 
          title="Analytics & Reports" 
          description="High-level aggregations and comparative charts of task resolutions, submission status distributions, and logs timelines."
          actions={
            <div className="flex items-center gap-2">
              <button 
                onClick={() => loadAnalyticsData(true)} 
                disabled={refreshing}
                className="bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-650 disabled:text-slate-350 px-3.5 py-2.5 rounded-xl border border-slate-200/50 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700"
                title="Refresh Charts"
              >
                <FiRotateCw className={`shrink-0 ${refreshing ? 'animate-spin' : ''}`} size={14} />
                <span>Refresh Data</span>
              </button>
              
              <button 
                onClick={handleExportCSV}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                title="Export CSV Progress Report"
              >
                <FiDownload size={14} />
                <span>Export CSV</span>
              </button>
              
              <button 
                onClick={handleExportPDF}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800"
                title="Export PDF Progress Report"
              >
                <FiFileText size={14} />
                <span>Export PDF</span>
              </button>
            </div>
          }
        />

        {/* Statistic Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatisticCard 
            title="Total Hours Logged" 
            value={metrics.totalHours.toFixed(1)} 
            colorTheme="blue" 
            icon={<FiClock size={20} />} 
          />
          <StatisticCard 
            title="Average Hours/Intern" 
            value={metrics.avgHoursPerIntern.toFixed(1)} 
            colorTheme="emerald" 
            icon={<FiUsers size={20} />} 
          />
          <StatisticCard 
            title="Task Completion Rate" 
            value={`${metrics.taskCompletionRate.toFixed(1)}%`} 
            colorTheme="violet" 
            icon={<FiCheckCircle size={20} />} 
          />
          <StatisticCard 
            title="Submission Approval Rate" 
            value={`${metrics.submissionApprovalRate.toFixed(1)}%`} 
            colorTheme="cyan" 
            icon={<FiFileText size={20} />} 
          />
        </div>

        {/* First Charts row: Daily trend and Submission Statuses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily timeline trend */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs h-[350px] flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                <h4 className="font-bold text-slate-800 text-sm">Work Effort Timeline (Last 15 days)</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-50 px-2 py-0.5 rounded border">Hours/Day</span>
              </div>
              <div className="flex-1 min-h-0">
                {chartsData.dailyHoursTimeline.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartsData.dailyHoursTimeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="blueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '11px',
                          fontWeight: '600',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        }}
                      />
                      <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#blueAreaGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold">No Activity Logged</div>
                )}
              </div>
            </div>
          </div>

          {/* Submissions breakdown */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs h-[350px] flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                <h4 className="font-bold text-slate-800 text-sm">Submission Status Breakdown</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-50 px-2 py-0.5 rounded border">Ratio</span>
              </div>
              <div className="flex-1 min-h-0 relative">
                {chartsData.submissionBreakdown.some(item => item.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartsData.submissionBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartsData.submissionBreakdown.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={SUBMISSION_COLORS[entry.name] || '#64748b'} 
                            stroke="rgba(255,255,255,0.7)"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                            {value.replace(/_/g, ' ')}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs font-semibold">No Submissions Found</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Second Charts row: Intern Performance and Project tasks completed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Intern comparison by hours */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs h-[350px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
              <h4 className="font-bold text-slate-800 text-sm">Hours Logged per Intern (Top 10)</h4>
              <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-50 px-2 py-0.5 rounded border">Hours</span>
            </div>
            <div className="flex-1 min-h-0">
              {chartsData.internPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartsData.internPerformance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barSize={16}>
                    <defs>
                      <linearGradient id="purpleBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="hours" fill="url(#purpleBarGradient)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold">No Intern Log Data</div>
              )}
            </div>
          </div>

          {/* Project task completion comparison */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs h-[350px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
              <h4 className="font-bold text-slate-800 text-sm">Project Tasks: Completed vs Pending</h4>
              <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-50 px-2 py-0.5 rounded border">Tasks Count</span>
            </div>
            <div className="flex-1 min-h-0">
              {chartsData.projectTaskComparison.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartsData.projectTaskComparison} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">{value}</span>} />
                    <Bar dataKey="completed" name="Completed" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="pending" name="Pending" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold">No Project Task Metrics</div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Dashboard Charts (Feature 7) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Overview Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs h-[320px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-250 text-sm">Attendance Overview</h4>
              <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border dark:border-slate-750">Days</span>
            </div>
            <div className="flex-1 min-h-0">
              {extraChartsData.attendanceOverview.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={extraChartsData.attendanceOverview} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-650 text-xs font-semibold">No Attendance Data</div>
              )}
            </div>
          </div>

          {/* Leave Statistics Pie Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs h-[320px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-250 text-sm">Leave Statistics</h4>
              <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border dark:border-slate-750">Types</span>
            </div>
            <div className="flex-1 min-h-0">
              {extraChartsData.leaveStats.some(i => i.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={extraChartsData.leaveStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      <Cell fill="#f59e0b" />
                      <Cell fill="#10b981" />
                      <Cell fill="#3b82f6" />
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" iconSize={8} verticalAlign="bottom" height={36} formatter={(value) => <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-650 text-xs font-semibold">No Leave Data</div>
              )}
            </div>
          </div>

          {/* Performance Scores Bar Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs h-[320px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
              <h4 className="font-bold text-slate-800 dark:text-slate-250 text-sm">Performance Scores (Top 10)</h4>
              <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border dark:border-slate-750">Score %</span>
            </div>
            <div className="flex-1 min-h-0">
              {extraChartsData.performanceScores.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={extraChartsData.performanceScores} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-650 text-xs font-semibold">No Evaluation Scores Yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Intern performance breakdown grid list */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 mb-4">Intern Engagement Rankings</h4>
          
          {internPerformanceList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-medium font-sans">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Intern Name</th>
                    <th className="py-3 px-4">University</th>
                    <th className="py-3 px-4 text-center">Completed Tasks</th>
                    <th className="py-3 px-4 text-center">Total Tasks</th>
                    <th className="py-3 px-4 text-center">Hours Logged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {internPerformanceList.map((intern, idx) => (
                    <tr key={intern.id} className="hover:bg-slate-50/55 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0">
                          {idx + 1}
                        </span>
                        {intern.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{intern.university}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600">{intern.completedTasks}</td>
                      <td className="py-3.5 px-4 text-center text-slate-400 font-bold">{intern.totalTasks}</td>
                      <td className="py-3.5 px-4 text-center font-black text-slate-800">{intern.hours.toFixed(1)} hrs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-sm font-semibold">No registered interns found to calculate rankings.</div>
          )}
        </div>

      </div>
    </PageContainer>
  );
};

export default Analytics;
